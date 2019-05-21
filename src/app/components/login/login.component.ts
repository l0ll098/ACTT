import { Component, OnInit, ChangeDetectionStrategy, Inject, PLATFORM_ID } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { isPlatformBrowser } from '@angular/common';

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {

	public isBrowser = isPlatformBrowser(this.platformId);

	constructor(
		private authService: AuthService,
		private router: Router,
		@Inject(PLATFORM_ID) private platformId: any) { }

	ngOnInit() {
		this.authService.getAuthState().subscribe(auth => {
			this.router.navigate(["/"]);
		});
	}

}
