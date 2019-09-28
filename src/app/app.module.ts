import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { AppSharedModule } from './app.shared.module';

import { environment, firebaseUIConfigs } from '../environments/environment';

import { FirebaseUIModule } from 'firebaseui-angular';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { AngularFirePerformanceModule } from "@angular/fire/performance";

import { AuthService } from "./services/auth.service";

import { AppComponent } from './app.component';
import { LoginComponent } from "./components/login/login.component";


@NgModule({
	declarations: [
		LoginComponent
	],
	imports: [
		CommonModule,
		AngularFireAuthModule,
		AngularFireDatabaseModule,
		AngularFirePerformanceModule,
		AngularFireModule.initializeApp(environment.firebase),
		FirebaseUIModule.forRoot(firebaseUIConfigs),
		AppSharedModule
	],
	providers: [
		AuthService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
