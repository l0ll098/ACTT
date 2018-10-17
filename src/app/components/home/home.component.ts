import { Component, AfterContentInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { LocationStrategy } from '@angular/common';

import { DeviceDetectorService } from 'ngx-device-detector';
import { MatSnackBar, MatSidenav } from '@angular/material';
import * as Hammer from "hammerjs";

import { AuthService } from '../../services/auth.service';
import { FirebaseService } from "../../services/firebase.service";
import { SettingsService } from '../../services/settings.service';

import { SidenavButton } from '../../models/lists.model';


enum toolbarTypes {
    sidenav,
    back
}


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, AfterContentInit {

    @ViewChild(MatSidenav)
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
            text: "Best times",
            icon: "timer",
            path: "/best",
            isDisabled: true
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
        private firebaseService: FirebaseService,
        private deviceService: DeviceDetectorService,
        private settingsService: SettingsService,
        private snackBar: MatSnackBar) {

        this.authService.getUserData().subscribe(data => {
            console.log(data);
            this.user = data;
        });

        const hammerTime = new Hammer(elementRef.nativeElement);
        hammerTime.on("panright", () => {
            this.openSidenav();
        });
        hammerTime.on("panleft", () => {
            this.closeSidenav();
        });
    }

    ngAfterViewInit() {
        // When the page is reloaded, navigate to the main path
		/*if (this.router.url.length > 1) {
			this.goToPath("/");
		}*/

		/* Check if it's a mobile device.
		   This is used to show the toolbar with the back icon on mobile and
		   the toolbar with the sidenav icon on desktop
		*/
        if (this.deviceService.isDesktop()) {
            this.deviceType = "desktop";
        } else {
            this.deviceType = "mobile";
        }

        // Subscribe to path changes
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                // When user changes path, add it to the array
                if (this.pathVisited.includes(event.url.split("/")[0])) {
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

        window.addEventListener("offline", () => {
            this.snackBar.open("You are offline.", "Ok", {
                duration: 10000		// 10s
            });

            // Check that the current device is small, such as a smartphone 
            if (this.deviceType == "mobile") {
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

        window.addEventListener("online", () => {
            this.snackBar.dismiss();
        });
    }

    ngAfterContentInit() {
        this.firebaseService.initializeCurrentUserRef();

        // Initialize defualt settings
        this.settingsService.initDefaultSettingsValues();
    }


    public doLogout() {
        this.authService.signOut();
    }

    public goBack() {
        // Get the previously visited path and remove it from the array
        const prevPath = this.pathVisited[this.pathVisited.length - 1];
        this.pathVisited.splice(this.pathVisited.length - 1, 1);
        // Then navigate to that path
        this.goToPath(prevPath);

        this.showNewFAB = true;
    }

    public returnToHomePath() {
        this.goToPath("/");

        this.showNewFAB = true;
    }

    public goToNew() {
        this.goToPath("/new");
        this.showNewFAB = false;
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

                let btn = this.sidenavButtons.find(btn => btn.path === path);

                if (btn) {
                    // When user changes path, show the text alongside the back arrow
                    this.toolbarTitle = btn.text;
                }
            }
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
}
