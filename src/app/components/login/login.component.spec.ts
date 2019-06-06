import { LoginComponent } from "./login.component";
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FirebaseUIModule } from 'firebaseui-angular';
import { User } from 'firebase';

import { Observable, of } from 'rxjs';

import { AppUIModule } from '../../app.ui.module';
import { firebaseUIConfigs, environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';


class MockAuthService extends AuthService {
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

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LoginComponent],
            imports: [
                AppUIModule,
                RouterTestingModule,
                NoopAnimationsModule,
                AngularFireModule.initializeApp(environment.firebase),
                AngularFireAuthModule,
                FirebaseUIModule.forRoot(firebaseUIConfigs),
            ],
            providers: [
                {
                    provide: AuthService,
                    useClass: MockAuthService
                }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    afterEach(() => {
        if (fixture.nativeElement && 'remove' in fixture.nativeElement) {
            (fixture.nativeElement as HTMLElement).remove();
        }
    });
});
