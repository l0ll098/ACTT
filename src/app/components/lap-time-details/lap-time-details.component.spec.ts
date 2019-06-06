import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppUIModule } from '../../app.ui.module';
import { SharedComponentsModule } from '../shared/shared.module';

import { environment } from "../../../environments/environment";

import { FirebaseService } from '../../services/firebase.service';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { LoggerService } from '../../services/log.service';
import { IndexedDBService } from '../../services/indexedDb.service';
import { MockFirebaseService } from '../../mock/MockFirebaseService';
import { MockHttpService } from '../../mock/MockHttpService';
import { MockAuthService } from '../../mock/MockAuthService';
import { MockLoggerService } from '../../mock/MockLoggerService';
import { MockIndexedDBService } from '../../mock/MockIndexedDBService';

import { LapTimeDetailsComponent } from './lap-time-details.component';


describe('LapTimesDetailsComponent', () => {
    let component: LapTimeDetailsComponent;
    let fixture: ComponentFixture<LapTimeDetailsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LapTimeDetailsComponent],
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
                }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LapTimeDetailsComponent);
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
