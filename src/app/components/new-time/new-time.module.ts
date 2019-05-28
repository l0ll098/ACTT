import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SharedComponentsModule } from '../shared/shared.module';
import { AppUIModule } from '../../app.ui.module';

import { NewTimeComponent } from "./new-time.component";

const path: Routes = [
    {
        path: "",
        component: NewTimeComponent
    }
];

@NgModule({
    declarations: [
        NewTimeComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule.forChild(path),

        SharedComponentsModule,
        AppUIModule
    ],
    exports: [
        RouterModule
    ]
})
export class NewTimeModule { }
