import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-not-found',
	templateUrl: './not-found.component.html',
	styleUrls: ['./not-found.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundComponent {

	constructor(private router: Router) { }

	public goToHome() {
		this.router.navigate(["/"]);
	}
}
