import { Component, OnInit, ChangeDetectionStrategy, Inject, PLATFORM_ID } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { Router, ActivatedRoute } from "@angular/router";
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
		private route: ActivatedRoute,
		private router: Router,
		@Inject(PLATFORM_ID) private platformId: any) { }

	ngOnInit() {
		this.authService
		.getAuthState()
		.subscribe(auth => {
			// If the returnUrl query param is present, use that. Otherwise fallback to the home path
			const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
			this.router.navigateByUrl(returnUrl);
		});
	}

}
