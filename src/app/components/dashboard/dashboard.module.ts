import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { MatGridListModule } from '@angular/material/grid-list';
import { AppUIModule } from '../../app.ui.module';

import { DashboardComponent } from './dashboard.component';

const path: Routes = [
    {
        path: "",
        component: DashboardComponent
    }
];

@NgModule({
    declarations: [
        DashboardComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(path),
        AppUIModule,
        MatGridListModule
    ],
    exports: [
        RouterModule
    ]
})
export class DashboardModule { }
