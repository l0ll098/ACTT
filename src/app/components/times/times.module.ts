import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { AppUIModule } from "../../app.ui.module";
import { SharedComponentsModule } from '../shared/shared.module';
import { PipesModule } from '../../pipes/pipes.module';

import { TimesComponent } from "./times.component";


const path: Routes = [
  {
    path: "",
    component: TimesComponent
  }
];

@NgModule({
  declarations: [
    TimesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(path),

    AppUIModule,
    SharedComponentsModule,
    PipesModule
  ],
  exports: [
    RouterModule
  ]
})
export class TimesModule { }
