import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AppUIModule } from '../../app.ui.module';

import { LogsComponent } from "./logs.component";

const path: Routes = [
    {
        path: "",
        component: LogsComponent
    }
];

@NgModule({
    declarations: [
        LogsComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(path),
        AppUIModule
    ],
    exports: [
        RouterModule
    ]
})
export class LogsModule { }
