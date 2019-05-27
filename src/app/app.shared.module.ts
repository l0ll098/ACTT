import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';

import { environment } from '../environments/environment';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlatformModule } from "@angular/cdk/platform";

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoginComponent } from './components/login/login.component';
// import { NewTimeComponent } from "./components/new-time/new-time.component";
import { LogsComponent } from './components/logs/logs.component';
import { LapTimeDetailsComponent } from './components/lap-time-details/lap-time-details.component';
import { SettingsContainerComponent } from './components/settings/settings-container.component';
import { SettingsComponent } from './components/settings/settings-component/settings.component';
import { SettingsAssistsComponent } from "./components/settings/settings-assists/settings-assists.component";

import { AuthService } from './services/auth.service';
import { FirebaseService } from "./services/firebase.service";
import { IndexedDBService } from "./services/indexedDb.service";
import { SettingsService } from './services/settings.service';
import { LoggerService } from './services/log.service';
import { HttpService } from './services/http.service';

import { AppUIModule } from './app.ui.module';
import { SharedComponentsModule } from './components/shared/shared.module';
import { PipesModule } from './pipes/pipes.module';


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
				loadChildren: "./components/times/times.module#TimesModule"
			},
			{
				path: "new",
				loadChildren: "./components/new-time/new-time.module#NewTimeModule"
				// component: NewTimeComponent
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
		SettingsContainerComponent,
		SettingsComponent,
		// NewTimeComponent,
		LogsComponent,
		SettingsAssistsComponent,
		LapTimeDetailsComponent
	],
	imports: [
		BrowserModule.withServerTransition({ appId: 'serverApp' }),
		BrowserAnimationsModule,
		RouterModule.forRoot(
			appRoutes, { enableTracing: (environment.enableAngularRoutingLog ? true : false) }
		),
		ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
		PlatformModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		// Angular Material modules
		AppUIModule,
		SharedComponentsModule,
		PipesModule
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
	exports: [
		AppComponent
	]
})
export class AppSharedModule { }
