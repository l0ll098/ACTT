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
	MatMenuModule,
	MatProgressSpinnerModule
} from '@angular/material';
import { PlatformModule } from "@angular/cdk/platform";

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoginComponent } from './components/login/login.component';
import { TimesComponent } from "./components/times/times.component";
import { NewTimeComponent } from "./components/new-time/new-time.component";
import { DialogComponent } from "./components/shared/dialog/dialog.component";
import { LapTimeFormInputComponent } from "./components/shared/lap-time/lap-time.component";
import { LoadingSpinnerComponent } from "./components/shared/loading-spinner/loading-spinner.component";
import { LogsComponent } from './components/logs/logs.component';
import { LapTimeDetailsComponent } from './components/lap-time-details/lap-time-details.component';
import { LapAssistsComponent } from "./components/shared/lap-assists/lap-assists.component";
import { SettingsContainerComponent } from './components/settings/settings-container.component';
import { SettingsComponent } from './components/settings/settings-component/settings.component';
import { SettingsAssistsComponent } from "./components/settings/settings-assists/settings-assists.component";

import { AuthService } from "./services/auth.service";
import { FirebaseService } from "./services/firebase.service";
import { IndexedDBService } from "./services/indexedDb.service";
import { SettingsService } from './services/settings.service';
import { LoggerService } from './services/log.service';
import { HttpService } from './services/http.service';

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
				path: "times/:id",
				component: LapTimeDetailsComponent
			},
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
		LapTimeDetailsComponent,

		DialogComponent,
		LapTimeFormInputComponent,
		LapAssistsComponent,
		LoadingSpinnerComponent,

		LapTimePipe
	],
	imports: [
		BrowserModule.withServerTransition({ appId: 'serverApp' }),
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
		MatMenuModule,
		MatProgressSpinnerModule
	],
	providers: [
		AuthService,
		FirebaseService,
		IndexedDBService,
		SettingsService,
		LoggerService,
		HttpService
	],
	bootstrap: [
		AppComponent
	],
	entryComponents: [
		DialogComponent
	]
})
export class AppModule { }
