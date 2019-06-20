import { Injectable, PLATFORM_ID, Inject } from "@angular/core";
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";
import { isPlatformBrowser } from '@angular/common';

import { AngularFireAuth } from "@angular/fire/auth";
import { User } from "@firebase/auth-types";

import { Observable, of } from "rxjs";
import { tap, map, filter, switchMap } from "rxjs/operators";



@Injectable()
export class AuthService implements CanActivate {

	constructor(
		private afAuth: AngularFireAuth,
		private router: Router,
		@Inject(PLATFORM_ID) private platformId) { }

	/**
	 * This method returns the user data
	 * @returns {Observable<User>}
	 */
	public getUserData(): Observable<User> {
		return this.afAuth.authState
			.pipe(
				map(userData => {
					return userData;
				})
			);
	}

	/**
	 * This method will say if user can load the main path (and its' children)
	 */
	public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		const isBrowser = isPlatformBrowser(this.platformId);

		return this.afAuth.authState.pipe(
			tap((authState) => {
				if (!isBrowser) {
					console.log(`[AccountGuard] Blocking guard in server: authState is always null`);
				}
			}),
			filter((_) => isBrowser),
			tap((authState) => console.log(`[AccountGuard] Checking authState...`)),
			switchMap(authState => {
				if (authState) {
					// Return true if the authState is defined
					return of(true);
				}

				// Otherwise, redirect user to the login path and return false
				console.log(`No permission to access this page! Redirecting to /login`);
				this.router.navigate(["/login"], { queryParams: { returnUrl: state.url } });
				return of(false);
			})
		);
	}

	/**
	 * Returns the login token
	 */
	public getToken() {
		return this.afAuth.auth.currentUser.getIdToken()
			.then(token => {
				return token;
			});
	}

	/**
	 * Logs user out
	 */
	public signOut() {
		this.afAuth.auth.signOut();
		// After logout, send user to the login page
		this.router.navigate(["/login"]);
	}

	/**
	 * Returns the authState object
	 */
	public getAuthState() {
		return this.afAuth.authState;
	}

	/**
	 * Returns the current user
	 */
	public getCurrentUser(): User {
		return this.afAuth.auth.currentUser;
	}
}
