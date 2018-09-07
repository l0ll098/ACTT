import { Component, OnInit, AfterContentInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { FirebaseService } from "../../services/firebase.service";
import { DeviceDetectorService } from 'ngx-device-detector';

import { SidenavButton } from '../../models/lists.model';
import { SettingsService } from './settings/settings.service';


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

	public sidenavButtons: SidenavButton[] = [
		{
			text: "Leadboards",
			icon: "show_chart",
			path: "/leadboards"
		},
		{
			text: "Upcoming and past events",
			icon: "events",
			path: "/events"
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
			path: "/account/favorite"
		},
		{
			text: "Settings",
			icon: "settings",
			path: "/settings"
		}
	];

	public user;
	public deviceType: "desktop" | "mobile";

	private pathVisited: string[] = ["/"];

	constructor(
		private router: Router,
		private authService: AuthService,
		private firebaseService: FirebaseService,
		private deviceService: DeviceDetectorService,
		private settingsService: SettingsService) {

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
				this.pathVisited.push(event.url);
			}
		});

		// When the page is reloaded, navigate to the main path
		if (this.router.url.length > 1) {
			this.goToPath("/");
		}

		/* Check if it's a mobile device.
		   This is used to show the toolbar with the back icon on mobile and
		   the toolbar with the sidenav icon on desktop
		*/
		if (this.deviceService.isDesktop()) {
			this.deviceType = "desktop";
		} else {
			this.deviceType = "mobile";
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
		const prevPath = this.pathVisited[this.pathVisited.length - 2];
		this.pathVisited.splice(this.pathVisited.length - 2, 1);

		// Then navigate to that path
		this.goToPath(prevPath);
	}

	public returnToHomePath() {
		this.goToPath("/");
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
			} else {
				this.toolbarToShow = toolbarTypes.back;
			}
			this.router.navigate([path]);
		}
	}

}
