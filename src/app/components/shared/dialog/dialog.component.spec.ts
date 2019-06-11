import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material';

import { AppUIModule } from '../../../app.ui.module';
import { SharedComponentsModule } from '../../shared/shared.module';

import { DialogComponent } from "./dialog.component";
import { MockData } from '../../../mock/data';


describe('DialogComponent', () => {
    let component: DialogComponent;
    let fixture: ComponentFixture<DialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                AppUIModule,
                SharedComponentsModule,
                FormsModule,
                ReactiveFormsModule,
                RouterTestingModule,
                NoopAnimationsModule,
                MatDialogModule
            ],
            providers: [
                {
                    provide: MatDialogRef,
                    useValue: {}
                },
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: MockData.dialog
                }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("should perform the confirm action", async(() => {
        const spy = spyOn(component, "onDoClick").and.returnValue(component.onDoClick());

        component.onDoClick();
        fixture.whenStable().then(() => {
            expect(spy).toHaveBeenCalled();
        });
    }));

    it("should perform the cancel action", async(() => {
        const spy = spyOn(component, "onCancelClick").and.returnValue(component.onCancelClick());

        component.onCancelClick();
        fixture.whenStable().then(() => {
            expect(spy).toHaveBeenCalled();
        });
    }));

    afterEach(() => {
        if (fixture.nativeElement && 'remove' in fixture.nativeElement) {
            (fixture.nativeElement as HTMLElement).remove();
        }
    });
});
