import { LogsComponent } from "./logs.component";
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import { AppUIModule } from '../../app.ui.module';
import { IndexedDBService } from '../../services/indexedDb.service';
import { MockIndexedDBService } from '../../mock/MockIndexedDBService';
import { MockData } from '../../mock/data';


describe('LogsComponent', () => {
    let component: LogsComponent;
    let fixture: ComponentFixture<LogsComponent>;
    let idbService: IndexedDBService;
    let de: DebugElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LogsComponent],
            imports: [
                AppUIModule,
                RouterTestingModule,
                NoopAnimationsModule
            ],
            providers: [
                {
                    provide: IndexedDBService,
                    useClass: MockIndexedDBService
                }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LogsComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;

        idbService = de.injector.get(IndexedDBService);
        const mockedIdb = new MockIndexedDBService();

        spyOn(idbService, "getLogs").and.returnValue(mockedIdb.getLogs());
        fixture.detectChanges();
    });

    it(`should create`, () => {
        expect(component).toBeTruthy();
    });

    it(`should contain a table with 3 cols`, () => {
        const idTh = de.queryAll(By.css(".mat-header-cell.cdk-column-id.mat-column-id.mat-table-sticky"));
        const tsTh = de.queryAll(By.css(".mat-header-cell.cdk-column-timestamp.mat-column-timestamp.mat-table-sticky"));
        const logTh = de.queryAll(By.css(".mat-header-cell.cdk-column-log mat-column-log.mat-table-sticky"));

        expect(idTh).toBeDefined();
        expect(tsTh).toBeDefined();
        expect(logTh).toBeDefined();
    });

    it(`should show ${MockData.logs.length} logs`, async(() => {
        fixture.whenStable().then(() => {
            expect(component.dataSource).toBeTruthy();
            expect(component.dataSource.length).toBe(MockData.logs.length);
        });
    }));

    afterEach(() => {
        if (fixture.nativeElement && 'remove' in fixture.nativeElement) {
            (fixture.nativeElement as HTMLElement).remove();
        }
    });
});
