import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {

	constructor(
		private authService: AuthService,
		private router: Router) { }

	ngOnInit() {
		this.authService.getAuthState().subscribe(auth => {
			this.router.navigate(["/"]);
		});
	}

}
