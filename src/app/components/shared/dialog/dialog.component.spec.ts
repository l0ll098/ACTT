import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material';

import { AppUIModule } from '../../../app.ui.module';
import { SharedComponentsModule } from '../../shared/shared.module';
import { DialogData } from '../../../models/dialog.model';

import { DialogComponent } from "./dialog.component";


describe('DialogComponent', () => {
    let component: DialogComponent;
    let fixture: ComponentFixture<DialogComponent>;

    beforeEach(async(() => {
        const dialogData: DialogData = {
            title: "Testing",
            message: "Just testing",
            doActionBtn: {
                text: "Ok"
            },
            cancelBtn: {
                text: "Cancel plz"
            }
        };

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
                    useValue: dialogData
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

    afterEach(() => {
        if (fixture.nativeElement && 'remove' in fixture.nativeElement) {
            (fixture.nativeElement as HTMLElement).remove();
        }
    });
});
