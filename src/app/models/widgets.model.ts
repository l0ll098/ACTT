import { Type } from '@angular/core';

export class WidgetItem {
    constructor(public component: Type<any>, public data: any) {}
}

export interface Tile {
    cols: number;
    rows: number;
    widget: WidgetItem;
    widgetName: string;
    widgetCategory: string;
}
