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
import { LapTimeDetailsComponent } from './components/lap-time-details/lap-time-details.component';

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
			},
			{
				path: "settings",
				loadChildren: "./components/settings/settings.module#SettingsModule"
			},
			{
				path: "notFound",
				component: NotFoundComponent
			},
		]
	},
	{
		path: "logs",
		loadChildren: "./components/logs/logs.module#LogsModule"
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
