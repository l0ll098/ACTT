import { Component, OnInit, AfterContentInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { FirebaseService } from "../../services/firebase.service";
import { DeviceDetectorService } from 'ngx-device-detector';

import { SidenavButton } from '../../models/lists.model';
import { SettingsService } from '../../services/settings.service';
import { MatSnackBar } from '@angular/material';


enum toolbarTypes {
	sidenav,
	back
}


@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterContentInit {

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
		private authService: AuthService,
		private firebaseService: FirebaseService,
		private deviceService: DeviceDetectorService,
		private settingsService: SettingsService,
		private snackBar: MatSnackBar) {

		this.authService.getUserData().subscribe(data => {
			console.log(data);
			this.user = data;
		});
	}

	ngOnInit() {
		// Subscribe to path changes
		this.router.events.subscribe((event) => {
			if (event instanceof NavigationStart) {
				// When user changes path, add it to the array
				//this.pathVisited.push(event.url);

				if (this.pathVisited.includes(event.url.split("/")[0])) {
					this.pathVisited.push(event.url);
				} else {
					this.pathVisited = ["/"];
				}
			}
		});

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


		if (!navigator.onLine) {
			// TODO: Move up the new FAB when opening the snackbar and move it back down when the 
			// snackbar is closed
			this.snackBar.open("You are offline.", "Ok", {
				duration: 10000		// 10s
			});
		}
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

}
