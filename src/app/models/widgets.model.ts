import { Type } from '@angular/core';

export class WidgetItem {
    constructor(public component: Type<any>, public tileDetails: TileDetails) { }
}

export interface WidgetComponent {
    details: TileDetails;
}

export interface TileDetails {
    cols: TileDimensions | number;
    rows: TileDimensions | number;
    widgetName: string;
    widgetCategory: string;
}

export interface TileDimensions {
    mobile: number;
    desktop: number;
}
