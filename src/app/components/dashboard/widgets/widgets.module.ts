import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppUIModule } from '../../../app.ui.module';

import { NotificationsWidgetComponent } from "./notifications/notifications-widget.component";

const widgets: any[] = [
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
