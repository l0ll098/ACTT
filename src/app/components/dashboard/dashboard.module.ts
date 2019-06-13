import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { MatGridListModule } from '@angular/material/grid-list';
import { AppUIModule } from '../../app.ui.module';

import { DashboardWidgetsDirective } from './dashboard-widgets.directive';

import { DashboardComponent } from './dashboard.component';
import { TimeGraphsComponent } from './widgets/time-graphs/time-graphs.component';
import { DashboardWidgetContainerComponent } from './dashboard-widget-container/dashboard-widget-container.component';

const path: Routes = [
    {
        path: "",
        component: DashboardComponent
    }
];

@NgModule({
    declarations: [
        DashboardComponent,
        TimeGraphsComponent,
        DashboardWidgetContainerComponent,

        DashboardWidgetsDirective
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(path),
        AppUIModule,
        MatGridListModule
    ],
    exports: [
        RouterModule
    ],
    entryComponents: [
        TimeGraphsComponent
    ]
})
export class DashboardModule { }
