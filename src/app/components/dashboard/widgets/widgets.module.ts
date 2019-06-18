import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppUIModule } from '../../../app.ui.module';

import { TimeGraphsComponent } from './time-graphs/time-graphs.component';

@NgModule({
    declarations: [
        TimeGraphsComponent
    ],
    imports: [
        CommonModule,
        AppUIModule
    ],
    entryComponents: [
        TimeGraphsComponent
    ]
})
export class WidgetsModule { }
