import { Component, AfterContentInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { LocationStrategy } from '@angular/common';
import { SwUpdate } from "@angular/service-worker";

import { MatSnackBar } from "@angular/material/";
import { MatSidenav } from "@angular/material/";

import { AuthService } from '../../services/auth.service';
import { SettingsService, SettingsName } from '../../services/settings.service';
import { StateService } from '../../services/state.service';

import { SidenavButton } from '../../models/lists.model';
import { LoggerService } from '../../services/log.service';


enum toolbarTypes {
    sidenav,
    back
}

const PATH_WHERE_NEW_FAB_SHOULD_BE_DISPLAYED = [
    "/",
];



@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, AfterContentInit {

    @ViewChild(MatSidenav, { static: false })
    public sidenav: MatSidenav;

    // Cheat: Doing so the html part can see the enum
    public toolbarTypes = toolbarTypes;
    public toolbarToShow: toolbarTypes = toolbarTypes.sidenav;

    public DEFAULT_TOOLBAR_TILE = "AC Time Tracker";
    public toolbarTitle = this.DEFAULT_TOOLBAR_TILE;

    public sidenavButtons: SidenavButton[] = [
        {
            text: "View Times",
            icon: "show_chart",
            path: "/times"
        },
        {
            isDivider: true
        },
        {
            text: "My Account",
            icon: "person",
            path: "/account"
        },
        {
            text: "Favorite",
            icon: "favorite",
            path: "/account/favorite",
            isDisabled: true
        },
        {
            text: "Settings",
            icon: "settings",
            path: "/settings"
        }
    ];

    public user;
    public deviceType: "desktop" | "mobile";
    public showNewFAB = true;

    private pathVisited: string[] = ["/"];

    constructor(
        private router: Router,
        private location: LocationStrategy,
        private elementRef: ElementRef,
        private authService: AuthService,
        private loggerService: LoggerService,
        private stateService: StateService,
        private swUpdate: SwUpdate,
        private settingsService: SettingsService,
        private snackBar: MatSnackBar) {

        this.authService.getUserData().subscribe(data => {
            this.loggerService.log(data);
            this.user = data;
        });
    }

    ngAfterViewInit() {
        // When the page is reloaded, navigate to the main path
		/*if (this.router.url.length > 1) {
			this.goToPath("/");
		}*/

        /*
            Check if it's a mobile device.
		    This is used to show the toolbar with the back icon on mobile and
            the toolbar with the sidenav icon on desktop
		*/
        if (this.stateService.isMobile()) {
            this.deviceType = "mobile";
        } else {
            this.deviceType = "desktop";
        }

        // Subscribe to path changes
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                // When user changes path, add it to the array
                if (this.pathVisited.length > 0) {
                    this.pathVisited.push(event.url);
                } else {
                    this.pathVisited = ["/"];
                }
            }
        });


        // Intercept the "back arrow". Both in mobile and desktop
        this.location.onPopState((e) => {
            if (this.location.path() === "/") {
                this.returnToHomePath();
            } else {
                this.goToPath(this.location.path());
            }
        });

        this.stateService.addEventListener("offline", () => {
            this.snackBar.open("You are offline.", "Ok", {
                duration: 10000		// 10s
            });

            // Check that the current device is small, such as a smartphone
            if (this.deviceType === "mobile") {
                // When the snackbar is opend, move up the FAB so that it doesn't get covered
                this.snackBar._openedSnackBarRef.afterOpened().subscribe(e => {
                    document.getElementById("newFAB").style.bottom = "64px";
                });

                // When the snackbar is closed, move down the FAB
                this.snackBar._openedSnackBarRef.afterDismissed().subscribe(e => {
                    document.getElementById("newFAB").style.bottom = "16px";
                });
            }
        });

        this.stateService.addEventListener("online", () => {
            this.snackBar.dismiss();
        });

        // Subscribe to the observer to notify user that a newer version is available
        this.swUpdate.available.subscribe(event => {
            this.loggerService.log("Update available: current version is", event.current, "available version is", event.available);

            // Show a SnackBar asking user if he want to update
            this.snackBar.open("A new version is available. Install now?", "Yes.", {
                duration: 15000
            }).onAction().subscribe(() => {
                // If he presses ok, reload the window, installing the new version
                window.location.reload();
            });
        });
    }

    ngAfterContentInit() {
        // Initialize defualt settings
        this.settingsService.initDefaultSettingsValues();

        // Hide new FAB if the path isn't in the array.
        // This could happen if the page has been reloaded from a different path than "/"
        this.showAndHideNewFAB(this.location.path());

        // Check if the "Show log" button has to be shown
        this.settingsService
            .getSettingValue(SettingsName.EnableLogButton)
            .then(showBtn => {
                if (showBtn) {
                    this.addLogBtn();
                }
            });
    }


    public doLogout() {
        this.authService.signOut();
    }

    public goBack() {
        // Get the previously visited path
        const prevPath = this.pathVisited[this.pathVisited.length - 2];
        // Remove the latest two visited paths (current one and previous).
        this.pathVisited.splice(this.pathVisited.length - 2, 2);
        // Then navigate to that path
        this.goToPath(prevPath);
    }

    public returnToHomePath() {
        this.goToPath("/");
    }

    public goToNew() {
        this.goToPath("/new");
    }

    /**
     * This method will redirect user to the selected path
     * @param path Path where user has to be redirected
     */
    goToPath(path) {
        if (path) {
            // Check if the path is the main one
            if (path === "/") {
                // If so change the toolbar and reset the array of the path visited
                this.toolbarToShow = toolbarTypes.sidenav;
                this.pathVisited = [];

                // If user returns to the main path, show the app name
                this.toolbarTitle = this.DEFAULT_TOOLBAR_TILE;
            } else {
                this.toolbarToShow = toolbarTypes.back;

                if (path === "/new") {
                    this.toolbarTitle = "New time";
                } else {
                    const btn = this.sidenavButtons.find(_btn => _btn.path === path);

                    if (btn) {
                        // When user changes path, show the text alongside the back arrow
                        this.toolbarTitle = btn.text;
                    }
                }
            }

            this.showAndHideNewFAB(path);

            this.router.navigate([path]);
        }
    }

    closeSidenav() {
        this.sidenav.close();
    }

    openSidenav() {
        this.sidenav.open();
    }

    trackByFn(index, item) {
        return index;
    }

    private showAndHideNewFAB(path: string) {
        if (PATH_WHERE_NEW_FAB_SHOULD_BE_DISPLAYED.includes(path)) {
            this.showNewFAB = true;
        } else {
            this.showNewFAB = false;
        }
    }

    private addLogBtn() {
        const extraBtns: SidenavButton[] = [
            {
                isDivider: true
            },
            {
                text: "Advanced features",
                isSubheader: true
            },
            {
                icon: "developer_mode",
                text: "Show logs",
                path: "logs"
            }
        ];

        extraBtns.forEach(btn => {
            this.sidenavButtons.push(btn);
        });
    }
}
