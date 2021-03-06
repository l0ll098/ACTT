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

import { NotFoundComponent } from "./not-found.component";
import { By } from '@angular/platform-browser';



describe('NotFoundComponent', () => {
    let component: NotFoundComponent;
    let fixture: ComponentFixture<NotFoundComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [NotFoundComponent],
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
        fixture = TestBed.createComponent(NotFoundComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("should contain some links", () => {
        const links = fixture.debugElement.queryAll(By.css("a"));
        expect(links).toBeTruthy();
        expect(links.length).toBeGreaterThanOrEqual(1);
    });

    it("should contain a link to return to home page", () => {
        const links = fixture.debugElement.queryAll(By.css("#returnToHome"));

        expect(links).toBeTruthy();
        expect(links.length).toBe(1);
        expect(links[0]).toBeTruthy();
    });

    afterEach(() => {
        if (fixture.nativeElement && 'remove' in fixture.nativeElement) {
            (fixture.nativeElement as HTMLElement).remove();
        }
    });
});
