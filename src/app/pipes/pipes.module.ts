import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LapTimePipe } from "./lap-time.pipe";

@NgModule({
    declarations: [
        LapTimePipe
    ],
    imports: [
        CommonModule
    ],
    exports: [
        LapTimePipe
    ]
})
export class PipesModule { }
