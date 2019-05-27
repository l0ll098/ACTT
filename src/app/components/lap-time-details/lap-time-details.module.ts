import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppUIModule } from '../../app.ui.module';
import { SharedComponentsModule } from '../shared/shared.module';

import { LapTimeDetailsComponent } from "./lap-time-details.component";


const routes: Routes = [
    {
        path: "",
        component: LapTimeDetailsComponent
    }
];

@NgModule({
    declarations: [
        LapTimeDetailsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),

        AppUIModule,
        SharedComponentsModule
    ],
    exports: [
        RouterModule
    ]
})
export class LapTimeDetailsModule { }
