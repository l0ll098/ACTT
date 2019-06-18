import { Component, Input, AfterViewInit } from '@angular/core';
import { WidgetComponent, TileDetails, TileDimensions } from '../../../../models/widgets.model';

@Component({
    template: `
    <div>
        <h4>Time Graphs</h4>
    </div>
    `
})
export class TimeGraphsComponent implements WidgetComponent, AfterViewInit {
    @Input() details: TileDetails;

    ngAfterViewInit() {
        console.log(this.details);
    }
}
