import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

import { AngularFireAuth } from "@angular/fire/auth";
import { User } from "@firebase/auth-types";

import { Observable } from "rxjs";
import { tap, map, take } from "rxjs/operators";



@Injectable()
export class AuthService implements CanActivate {

	constructor(private afAuth: AngularFireAuth, private router: Router) { }

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
	canActivate() {
		return this.afAuth.authState
			.pipe(take(1))
			.pipe(map(authState => !!authState))
			.pipe(tap(authenticated => {
				if (!authenticated) {
					this.router.navigate(["/login"]);
				}
			}));
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
