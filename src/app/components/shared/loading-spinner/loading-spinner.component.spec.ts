import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppUIModule } from '../../../app.ui.module';
import { SharedComponentsModule } from '../../shared/shared.module';

import { LoadingSpinnerComponent } from "./loading-spinner.component";


describe('LoadingSpinnerComponent', () => {
    let component: LoadingSpinnerComponent;
    let fixture: ComponentFixture<LoadingSpinnerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                AppUIModule,
                SharedComponentsModule,
                FormsModule,
                ReactiveFormsModule,
                RouterTestingModule,
                NoopAnimationsModule
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoadingSpinnerComponent);
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
