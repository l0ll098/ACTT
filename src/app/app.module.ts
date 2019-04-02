import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';

import { environment, firebaseUIConfigs } from '../environments/environment';

import { FirebaseUIModule } from 'firebaseui-angular';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from "@angular/fire/database";

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
	MatSortModule,
	MatSnackBarModule,
	MatDialogModule,
	MatExpansionModule,
	MatSliderModule,
	MatMenuModule
} from '@angular/material';
import { PlatformModule } from "@angular/cdk/platform";

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoginComponent } from './components/login/login.component';
import { SettingsComponent } from './components/settings/settings.component';
import { TimesComponent } from "./components/times/times.component";
import { NewTimeComponent } from "./components/new-time/new-time.component";
import { DialogComponent } from "./components/dialog/dialog.component";
import { LapTimeFormInputComponent } from "./components/lap-time/lap-time.component";
import { LogsComponent } from './components/logs/logs.component';
import { LapAssistsComponent } from "./components/lap-assists/lap-assists.component";
import { SettingsContainerComponent } from './components/settings-container/settings-container.component';
import { SettingsAssistsComponent } from "./components/settings-assists/settings-assists.component";

import { AuthService } from "./services/auth.service";
import { FirebaseService } from "./services/firebase.service";
import { IndexedDBService } from "./services/indexedDb.service";
import { SettingsService } from './services/settings.service';
import { LoggerService } from './services/log.service';

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
				component: SettingsContainerComponent,
				children: [
					{
						path: "",
						component: SettingsComponent
					},
					{
						path: "assists",
						component: SettingsAssistsComponent
					}
				]
			},
			{
				path: "notFound",
				component: NotFoundComponent
			},
		]
	},
	{
		path: "logs",
		component: LogsComponent
	},
	{
		path: "**",
		redirectTo: "/notFound"
	}
];

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		NotFoundComponent,
		LoginComponent,
		SettingsContainerComponent,
		SettingsComponent,
		TimesComponent,
		NewTimeComponent,
		LogsComponent,
		SettingsAssistsComponent,

		DialogComponent,
		LapTimeFormInputComponent,
		LapAssistsComponent,

		LapTimePipe
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		RouterModule.forRoot(
			appRoutes,
			{ enableTracing: (environment.enableAngularRoutingLog ? true : false) }
		),
		ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
		PlatformModule,
		AngularFireAuthModule,
		AngularFireDatabaseModule,
		AngularFireModule.initializeApp(environment.firebase),
		FirebaseUIModule.forRoot(firebaseUIConfigs),
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
		MatSortModule,
		MatSnackBarModule,
		MatDialogModule,
		MatExpansionModule,
		MatSliderModule,
		MatMenuModule
	],
	providers: [
		AuthService,
		FirebaseService,
		IndexedDBService,
		SettingsService,
		LoggerService
	],
	bootstrap: [
		AppComponent
	],
	entryComponents: [
		DialogComponent
	]
})
export class AppModule { }
