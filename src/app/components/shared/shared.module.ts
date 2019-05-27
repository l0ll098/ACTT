import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppUIModule } from "../../app.ui.module";

import { DialogComponent } from "./dialog/dialog.component";
import { LapAssistsComponent } from "./lap-assists/lap-assists.component";
import { LapTimeFormInputComponent } from "./lap-time/lap-time.component";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        DialogComponent,
        LapAssistsComponent,
        LapTimeFormInputComponent,
        LoadingSpinnerComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AppUIModule
    ],
    exports: [
        DialogComponent,
        LapAssistsComponent,
        LapTimeFormInputComponent,
        LoadingSpinnerComponent
    ]
})
export class SharedComponentsModule { }
