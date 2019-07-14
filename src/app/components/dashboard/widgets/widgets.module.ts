import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppUIModule } from '../../../app.ui.module';

import { TimeGraphsWidgetComponent } from './time-graphs/time-graphs.component';
import { NotificationsWidgetComponent } from "./notifications/notifications-widget.component";

const widgets: any[] = [
    TimeGraphsWidgetComponent,
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
