import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ServiceWorkerModule } from '@angular/service-worker';

import { User } from 'firebase';
import { Observable, of } from 'rxjs';

import { AppUIModule } from '../../app.ui.module';

import { environment } from "../../../environments/environment";

import { AuthService } from '../../services/auth.service';
import { IndexedDBService } from '../../services/indexedDb.service';
import { LoggerService } from '../../services/log.service';
import { SettingsService } from '../../services/settings.service';

import { HomeComponent } from './home.component';
import { By } from '@angular/platform-browser';


class MockAuthService extends AuthService {
	canActivate(): Observable<boolean> { return of(true); }
	getUserData(): Observable<User> {
		const user = {
			displayName: "Just tesing",
			email: "just.testing@example.com",
			photoURL: `${location.protocol}//${location.host}/assets/images/favicon-32x32.png`,
			emailVerified: false
		};
		return of(user as User);
	}
}

class MockLoggerService extends LoggerService { }
class MockIndexedDBService extends IndexedDBService { }
class MockSettingsService extends SettingsService { }

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
