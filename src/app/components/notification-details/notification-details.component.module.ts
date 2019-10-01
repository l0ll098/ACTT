import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AppUIModule } from '../../app.ui.module';
import { SharedComponentsModule } from '../shared/shared.module';
import { NotificationDetailsComponent } from './notification-details.component';


const routes: Routes = [
    {
        path: "",
        component: NotificationDetailsComponent
    }
];

@NgModule({
    declarations: [
        NotificationDetailsComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),

        AppUIModule,
        SharedComponentsModule
    ],
    exports: [
        RouterModule
    ]
})
export class NotificationDetailsModule {}
