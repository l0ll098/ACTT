import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';

import { environment, firebaseUIConfigs } from '../environments/environment';

import { AngularFireModule } from "angularfire2";
import { FirebaseUIModule } from "firebaseui-angular";
import { AngularFireAuthModule } from "angularfire2/auth";

import { DeviceDetectorModule } from "ngx-device-detector";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
	MatToolbarModule,
	MatButtonModule,
	MatIconModule,
	MatListModule,
	MatSidenavModule,
	MatCheckboxModule,
	MatSlideToggleModule,
	MatFormFieldModule,
	MatAutocompleteModule,
	MatInputModule,
	MatSelectModule,
	MatTableModule,
	MatPaginatorModule,
	MatSortModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoginComponent } from './components/login/login.component';
import { SettingsComponent } from './components/home/settings/settings.component';
import { TimesComponent } from "./components/times/times.component";
import {NewTimeComponent} from "./components/new-time/new-time.component";

import { AuthService } from "./services/auth.service";
import { FirebaseService } from "./services/firebase.service";
import { IndexedDBService } from "./services/indexedDb.service";
import { SettingsService } from './components/home/settings/settings.service';

import { LapTimePipe } from './pipes/lap-time.pipe';


const appRoutes: Routes = [
	{
		path: "login",
		component: LoginComponent
	},
	{
		path: "",
		component: HomeComponent,
		canActivate: [AuthService],
		children: [
			{
				path: "times",
				component: TimesComponent
			},
			{
				path: "new",
				component: NewTimeComponent
			},
			{
				path: "settings",
				component: SettingsComponent
			}
		]
	},
	{
		path: "**",
		component: NotFoundComponent
	}
];

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		NotFoundComponent,
		LoginComponent,
		SettingsComponent,
		TimesComponent,
		NewTimeComponent,

		LapTimePipe
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		RouterModule.forRoot(
			appRoutes,
			{ enableTracing: (environment.enableAngularRoutingLog ? true : false) }
		),
		AngularFireAuthModule,
		AngularFireModule.initializeApp(environment.firebase),
		FirebaseUIModule.forRoot(firebaseUIConfigs),
		DeviceDetectorModule.forRoot(),
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		// Angular Material modules
		MatToolbarModule,
		MatButtonModule,
		MatIconModule,
		MatListModule,
		MatSidenavModule,
		MatCheckboxModule,
		MatSlideToggleModule,
		MatFormFieldModule,
		MatAutocompleteModule,
		MatInputModule,
		MatSelectModule,
		MatTableModule,
		MatPaginatorModule,
		MatSortModule
	],
	providers: [
		AuthService,
		FirebaseService,
		IndexedDBService,
		SettingsService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
