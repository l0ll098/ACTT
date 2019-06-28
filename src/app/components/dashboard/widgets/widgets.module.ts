import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppUIModule } from '../../../app.ui.module';

import { TimeGraphsComponent } from './time-graphs/time-graphs.component';
import { NotificationsWidgetComponent } from "./notifications/notifications-widget.component";

const widgets: any[] = [
    TimeGraphsComponent,
    NotificationsWidgetComponent
];

@NgModule({
    declarations: [
        ...widgets
    ],
    imports: [
        CommonModule,
        AppUIModule
    ],
    entryComponents: [
        ...widgets
    ]
})
export class WidgetsModule { }
