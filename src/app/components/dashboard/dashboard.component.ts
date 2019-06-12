import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Platform } from '@angular/cdk/platform';

export interface Tile {
    color: string;
    cols: number;
    rows: number;
    text: string;
}

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
        { text: 'One', cols: 3, rows: 1, color: 'lightblue' },
        { text: 'Two', cols: 1, rows: 2, color: 'lightgreen' },
        { text: 'Three', cols: 1, rows: 1, color: 'lightpink' },
        { text: 'Four', cols: 2, rows: 1, color: '#DDBDF1' },
        { text: "Five", cols: 1, rows: 3, color: "blue" },
        { text: "Six", cols: 3, rows: 1, color: "red" },
        { text: "Seven", cols: 3, rows: 2, color: "green" },
        { text: "8", cols: 2, rows: 1, color: "yellow" }
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
