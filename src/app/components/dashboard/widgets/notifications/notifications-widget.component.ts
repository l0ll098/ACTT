import { Component, ChangeDetectionStrategy, Input, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit } from "@angular/core";
import { TileDetails, WidgetComponent, NotificationItem } from '../../../../models/widgets.model';
import { Router } from '@angular/router';

@Component({
    selector: "app-notifications-widget",
    templateUrl: "notifications-widget.component.html",
    styleUrls: ["./notifications-widget.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsWidgetComponent implements WidgetComponent, AfterViewInit {
    @Input() details: TileDetails;
    @ViewChild("notificationsList", { static: false }) notificationsList: ElementRef;

    notifications: NotificationItem[] = [ ];

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private router: Router) { }

    ngAfterViewInit() {
        this.changeDetectorRef.markForCheck();
    }

    navigate(path) {
        this.router.navigate([path]);
    }
}
