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
import { LoggerService } from '../../services/log.service';
import { AuthService } from '../../services/auth.service';
import { IndexedDBService } from '../../services/indexedDb.service';
import { MockFirebaseService } from '../../mock/MockFirebaseService';
import { MockHttpService } from '../../mock/MockHttpService';
import { MockLoggerService } from '../../mock/MockLoggerService';
import { MockAuthService } from '../../mock/MockAuthService';
import { MockIndexedDBService } from '../../mock/MockIndexedDBService';

import { NewTimeComponent } from "./new-time.component";
import { DebugElement } from '@angular/core';
import { MockData } from '../../mock/data';
import { By } from '@angular/platform-browser';



describe('NewTimeComponent', () => {
    let component: NewTimeComponent;
    let fixture: ComponentFixture<NewTimeComponent>;
    let de: DebugElement;
    let firebaseService: FirebaseService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [NewTimeComponent],
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
                }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NewTimeComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;

        firebaseService = de.injector.get(FirebaseService);
        const mockedFirebase = new MockFirebaseService(de.injector.get(HttpService));

        spyOn(firebaseService, "saveUserLapTime");

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    function testFormInputByFormControlName(testName: string, formControlName: string, expectedValue: any) {
        it(testName, async(() => {
            fixture.whenStable().then(() => {
                const el = de.queryAll(By.css(`[formcontrolname='${formControlName}']`));
                expect(el).toBeTruthy();
                expect(el.length).toBe(1);
                el[0].nativeElement.value = expectedValue;
                expect(el[0].nativeElement.value).toBe(expectedValue);
            });
        }));
    }

    describe("should fill in form", () => {
        const lapTime = MockData.lapTime;
        testFormInputByFormControlName("should select track", "track", lapTime.track.name);
        testFormInputByFormControlName("should set car", "car", lapTime.car.name);
        testFormInputByFormControlName("should set lap time", "lapTime", lapTime.time as any);
        testFormInputByFormControlName("should set lap number", "lapNumber", `${lapTime.lap}`);
    });

    afterEach(() => {
        if (fixture.nativeElement && 'remove' in fixture.nativeElement) {
            (fixture.nativeElement as HTMLElement).remove();
        }
    });
});
