import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppUIModule } from '../../app.ui.module';

import { environment } from "../../../environments/environment";

import { AuthService } from '../../services/auth.service';
import { IndexedDBService } from '../../services/indexedDb.service';
import { LoggerService } from '../../services/log.service';
import { SettingsService } from '../../services/settings.service';
import { MockAuthService } from '../../mock/MockAuthService';
import { MockLoggerService } from '../../mock/MockLoggerService';
import { MockIndexedDBService } from '../../mock/MockIndexedDBService';
import { MockSettingsService } from '../../mock/MockSettingsService';

import { HomeComponent } from './home.component';
import { By } from '@angular/platform-browser';


describe('HomeComponent', () => {
	let component: HomeComponent;
	let fixture: ComponentFixture<HomeComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [HomeComponent],
			imports: [
				AppUIModule,
				RouterTestingModule,
				NoopAnimationsModule,
				ServiceWorkerModule.register("", { enabled: false }),
				AngularFireModule.initializeApp(environment.firebase),
				AngularFireAuthModule
			],
			providers: [
				{
					provide: AuthService,
					useClass: MockAuthService
				},
				{
					provide: LoggerService,
					useClass: MockLoggerService
				},
				{
					provide: IndexedDBService,
					useClass: MockIndexedDBService
				},
				{
					provide: SettingsService,
					useClass: MockSettingsService
				}
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(HomeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it("should load user profile image", () => {
		expect(By.css("#userPhoto")).toBeTruthy();
	});

	it("should display user data", () => {
		expect(By.css("#displayNameRow")).toBeTruthy();
		expect(By.css("#emailRow")).toBeTruthy();
	});

	afterEach(() => {
		if (fixture.nativeElement && 'remove' in fixture.nativeElement) {
			(fixture.nativeElement as HTMLElement).remove();
		}
	});
});
