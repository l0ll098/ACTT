import { Component, Input, AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { WidgetComponent, TileDetails } from '../../../../models/widgets.model';

@Component({
    templateUrl: "time-graphs.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeGraphsWidgetComponent implements WidgetComponent, AfterViewInit {
    @Input() details: TileDetails;

    constructor(private changeDetectorRef: ChangeDetectorRef) { }

    ngAfterViewInit() {
        console.log(this.details);
    }
}
