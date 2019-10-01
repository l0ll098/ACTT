import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Platform } from '@angular/cdk/platform';

import { WidgetItem } from '../../models/widgets.model';
import { WidgetService } from '../../services/widgets.service';


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
    tiles: WidgetItem[];

    constructor(
        private platform: Platform,
        private widgetService: WidgetService) {

        if (this.platform.ANDROID || this.platform.IOS) {
            this.isDesktop = false;
        } else {
            this.isDesktop = true;
        }

        this.tiles = this.widgetService.getWidgets();
    }

    calcGridCols() {
        return this.isDesktop ? this.COLS_ON_DESKTOP : this.COLS_ON_MOBILE;
    }

    calcGridRowHeight() {
        return this.isDesktop ? this.ROWS_HEIGHT_DESKTOP : this.ROWS_HEIGHT_MOBILE;
    }

    getRows(widget: WidgetItem) {
        if (typeof widget.tileDetails.rows === "number") {
            return widget.tileDetails.rows;
        }
        return this.isDesktop ? widget.tileDetails.rows.desktop : widget.tileDetails.rows.mobile;
    }

    getCols(widget: WidgetItem) {
        if (typeof widget.tileDetails.cols === "number") {
            return widget.tileDetails.cols;
        }
        return this.isDesktop ? widget.tileDetails.cols.desktop : widget.tileDetails.cols.mobile;
    }

}
