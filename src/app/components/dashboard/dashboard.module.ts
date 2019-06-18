import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { AppUIModule } from '../../app.ui.module';

import { DashboardWidgetsDirective } from './dashboard-widgets.directive';

import { DashboardComponent } from './dashboard.component';
import { TimeGraphsComponent } from './widgets/time-graphs/time-graphs.component';
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
        TimeGraphsComponent,
        DashboardWidgetContainerComponent,

        DashboardWidgetsDirective
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(path),
        AppUIModule,
        MatGridListModule,
        MatCardModule
    ],
    exports: [
        RouterModule
    ],
    providers: [
        WidgetService
    ],
    entryComponents: [
        TimeGraphsComponent
    ]
})
export class DashboardModule { }
