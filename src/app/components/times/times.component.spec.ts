import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AppUIModule } from '../../app.ui.module';
import { SharedComponentsModule } from '../shared/shared.module';
import { PipesModule } from '../../pipes/pipes.module';

import { environment } from "../../../environments/environment";

import { FirebaseService } from '../../services/firebase.service';
import { HttpService } from '../../services/http.service';
import { LoggerService } from '../../services/log.service';
import { AuthService } from '../../services/auth.service';
import { IndexedDBService } from '../../services/indexedDb.service';

import { TimesComponent } from "./times.component";

import { SettingsService } from '../../services/settings.service';
import { MockFirebaseService } from '../../mock/MockFirebaseService';
import { MockHttpService } from '../../mock/MockHttpService';
import { MockLoggerService } from '../../mock/MockLoggerService';
import { MockAuthService } from '../../mock/MockAuthService';
import { MockIndexedDBService } from '../../mock/MockIndexedDBService';
import { MockSettingsService } from '../../mock/MockSettingsService';
import { MockData } from '../../mock/data';


describe('TimesComponent', () => {
    let component: TimesComponent;
    let fixture: ComponentFixture<TimesComponent>;
    let de: DebugElement;
    let firebaseService: FirebaseService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TimesComponent],
            imports: [
                AppUIModule,
                PipesModule,
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
        fixture = TestBed.createComponent(TimesComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;

        firebaseService = de.injector.get(FirebaseService);
        const mockedFirebase = new MockFirebaseService(de.injector.get(HttpService), de.injector.get(LoggerService));

        spyOn(firebaseService, "getLapTimes").and.returnValue(mockedFirebase.getLapTimes());

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("should contain a table", () => {
        const dataTable = de.queryAll(By.css(".mat-table"));
        expect(dataTable).toBeTruthy();
        expect(dataTable.length).toBe(1);
    });

    afterEach(() => {
        if (fixture.nativeElement && 'remove' in fixture.nativeElement) {
            (fixture.nativeElement as HTMLElement).remove();
        }
    });
});
