import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppUIModule } from '../../app.ui.module';
import { SharedComponentsModule } from "../shared/shared.module";

import { SettingsContainerComponent } from "./settings-container.component";
import { SettingsAssistsComponent } from "./settings-assists/settings-assists.component";
import { SettingsComponent } from "./settings-component/settings.component";


const routes: Routes = [
    {
        path: "",
        component: SettingsContainerComponent,
        children: [
            {
                path: "",
                component: SettingsComponent
            },
            {
                path: "assists",
                component: SettingsAssistsComponent
            }
        ]
    }
];

@NgModule({
    declarations: [
        SettingsContainerComponent,
        SettingsAssistsComponent,
        SettingsComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule,
        FormsModule,

        SharedComponentsModule,
        AppUIModule
    ],
    exports: [
        RouterModule
    ]
})
export class SettingsModule { }
