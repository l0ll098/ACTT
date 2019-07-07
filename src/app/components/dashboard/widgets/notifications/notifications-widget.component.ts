import { Component, ChangeDetectionStrategy, Input, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit } from "@angular/core";
import { Router } from '@angular/router';

import { HttpService } from '../../../../services/http.service';
import { TileDetails, WidgetComponent, NotificationItem } from '../../../../models/widgets.model';
import { Notification } from '../../../../../../shared/data.model';


@Component({
    selector: "app-notifications-widget",
    templateUrl: "notifications-widget.component.html",
    styleUrls: ["./notifications-widget.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsWidgetComponent implements WidgetComponent, AfterViewInit {
    @Input() details: TileDetails;
    @ViewChild("notificationsList", { static: false }) notificationsList: ElementRef;

    notifications: NotificationItem[] = [];

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private httpService: HttpService,
        private router: Router) { }

    ngAfterViewInit() {
        this.httpService
            .getNotifications()
            .then((notifications) => {
                notifications.forEach((notification) => {
                    this.notifications.push(this._convertNotification(notification));
                });
                this.changeDetectorRef.markForCheck();
            });
    }

    navigate(path: string) {
        if (path) {
            this.router.navigate([path]);
        }
    }

    private _convertNotification(notification: Notification): NotificationItem {
        let icon = "";

        switch (notification.category) {
            case "info":
            case "general":
                icon = "info";
                break;
            case "error":
                icon = "error";
                break;
            case "warning":
                icon = "warning";
                break;
        }

        return {
            icon: icon,
            name: notification.title,
            description: notification.description
        };
    }
}
