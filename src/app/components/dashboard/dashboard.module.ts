import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { AppUIModule } from '../../app.ui.module';
import { WidgetsModule } from './widgets/widgets.module';

import { DashboardWidgetsDirective } from './dashboard-widgets.directive';

import { DashboardComponent } from './dashboard.component';
import { DashboardWidgetContainerComponent } from './dashboard-widget-container/dashboard-widget-container.component';

import { WidgetService } from '../../services/widgets.service';


const path: Routes = [
    {
        path: "",
        component: DashboardComponent
    }
];

@NgModule({
    declarations: [
        DashboardComponent,
        DashboardWidgetContainerComponent,

        DashboardWidgetsDirective
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(path),
        AppUIModule,

        WidgetsModule
    ],
    exports: [
        RouterModule
    ],
    providers: [
        WidgetService
    ]
})
export class DashboardModule { }
