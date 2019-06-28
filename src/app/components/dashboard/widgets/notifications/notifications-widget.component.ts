import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { TileDetails, WidgetComponent } from '../../../../models/widgets.model';

@Component({
    selector: "app-notifications-widget",
    templateUrl: "notifications-widget.component.html",
    styleUrls: ["./notifications-widget.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsWidgetComponent implements WidgetComponent {
    @Input() details: TileDetails;

}
