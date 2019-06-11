import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppUIModule } from '../../../app.ui.module';
import { SharedComponentsModule } from '../../shared/shared.module';

import { environment } from "../../../../environments/environment";

import { FirebaseService } from '../../../services/firebase.service';
import { HttpService } from '../../../services/http.service';
import { LoggerService } from '../../../services/log.service';
import { AuthService } from '../../../services/auth.service';
import { IndexedDBService } from '../../../services/indexedDb.service';
import { SettingsService } from '../../../services/settings.service';
import { MockFirebaseService } from '../../../mock/MockFirebaseService';
import { MockHttpService } from '../../../mock/MockHttpService';
import { MockLoggerService } from '../../../mock/MockLoggerService';
import { MockAuthService } from '../../../mock/MockAuthService';
import { MockIndexedDBService } from '../../../mock/MockIndexedDBService';
import { MockSettingsService } from '../../../mock/MockSettingsService';

import { SettingsComponent } from "./settings.component";


describe('SettingsComponent', () => {
    let component: SettingsComponent;
    let fixture: ComponentFixture<SettingsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SettingsComponent],
            imports: [
                AppUIModule,
                SharedComponentsModule,
                FormsModule,
                ReactiveFormsModule,
                RouterTestingModule,
                NoopAnimationsModule,
                HttpClientModule,
                AngularFireModule.initializeApp(environment.firebase),
                AngularFireAuthModule
            ],
            providers: [
                {
                    provide: FirebaseService,
                    useClass: MockFirebaseService
                },
                {
                    provide: HttpService,
                    useClass: MockHttpService
                },
                {
                    provide: LoggerService,
                    useClass: MockLoggerService
                },
                {
                    provide: AuthService,
                    useClass: MockAuthService
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
        fixture = TestBed.createComponent(SettingsComponent);
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
