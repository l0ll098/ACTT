import { Type } from '@angular/core';

/**
 * Abstraction of a widget.
 * This is used to instantiate a new widget on the dashboard.
 */
export class WidgetItem {
    /**
     * @param component Name of the component class to instantiate.
     * @param tileDetails Details such as dimensions and name
     */
    constructor(public component: Type<any>, public tileDetails: TileDetails) { }
}

/**
 * Each widget has to implement this interface.
 * Properties specified here will be available to the widget components.
 * Every property should have an @Input() decorator.
 */
export interface WidgetComponent {
    details: TileDetails;
}

/**
 * This interface is used to specify the Tile details such as name, category, width and height
 */
export interface TileDetails {
    /**
     * This could be a TileDimensions or a number. In case it's a number, the same dimension is applied
     * on desktops and mobile
     */
    cols: TileDimensions | number;
    rows: TileDimensions | number;
    widgetName: string;
    widgetCategory: string;
    widgetIcon: string;
}

export interface TileDimensions {
    mobile: number;
    desktop: number;
}
