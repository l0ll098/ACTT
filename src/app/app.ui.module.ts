import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    MatDialogModule,
    MatExpansionModule,
    MatSliderModule,
    MatMenuModule,
    MatProgressSpinnerModule
} from '@angular/material';


/**
 * An array of Angular Material Modules to import.
 */
const angularMaterialModules = [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    MatDialogModule,
    MatExpansionModule,
    MatSliderModule,
    MatMenuModule,
    MatProgressSpinnerModule
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        ...angularMaterialModules
    ],
    exports: [
        MatToolbarModule,
        ...angularMaterialModules
    ]
})
export class AppUIModule { }
