import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Platform } from '@angular/cdk/platform';

import { TimeGraphsComponent } from './widgets/time-graphs/time-graphs.component';
import { WidgetItem, Tile } from '../../models/widgets.model';


@Component({
    selector: "app-dashboard",
    styleUrls: ["dashboard.component.css"],
    templateUrl: "dashboard.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
    private isDesktop: boolean;

    private COLS_ON_DESKTOP = 8;
    private COLS_ON_MOBILE = 4;
    private ROWS_HEIGHT_DESKTOP = "192px";
    private ROWS_HEIGHT_MOBILE = "128px";
    tiles: Tile[] = [
        {
            cols: 4,
            rows: 2,
            widgetName: "Times trend",
            widgetCategory: "Times",
            widget: new WidgetItem(TimeGraphsComponent, null),
        }
    ];

    constructor(private platform: Platform) {
        if (this.platform.ANDROID || this.platform.IOS) {
            this.isDesktop = false;
        } else {
            this.isDesktop = true;
        }
    }

    calcGridCols() {
        return this.isDesktop ? this.COLS_ON_DESKTOP : this.COLS_ON_MOBILE;
    }

    calcGridRowHeight() {
        return this.isDesktop ? this.ROWS_HEIGHT_DESKTOP : this.ROWS_HEIGHT_MOBILE;
    }
}
