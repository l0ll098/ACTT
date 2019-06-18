import { Component, Input, AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { WidgetComponent, TileDetails } from '../../../../models/widgets.model';

@Component({
    template: `
    <div>
        <h4>Time Graphs</h4>
    </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeGraphsComponent implements WidgetComponent, AfterViewInit {
    @Input() details: TileDetails;

    constructor(private changeDetectorRef: ChangeDetectorRef) { }

    ngAfterViewInit() {
        console.log(this.details);
    }
}
