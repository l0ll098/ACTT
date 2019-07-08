import { Component, ChangeDetectionStrategy, Input, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit } from "@angular/core";
import { Router } from '@angular/router';

import { HttpService } from '../../../../services/http.service';
import { TileDetails, WidgetComponent, NotificationItem } from '../../../../models/widgets.model';
import { Notification, EClientActions, ClientAction } from '../../../../../../shared/data.model';


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
        this._getNotifications();
    }

    navigate(path: string) {
        if (path) {
            this.router.navigate([path]);
        }
    }

    private _getNotifications() {
        this.httpService
            .getNotifications()
            .then((notifications) => {
                this.notifications = [];
                notifications.forEach((notification) => {
                    this.notifications.push(this._convertNotification(notification));
                });
                this.changeDetectorRef.markForCheck();
            });
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

        const item: NotificationItem = {
            icon: icon,
            name: notification.title,
            description: notification.description
        };

        // If it's an user notification
        if (notification.source === "user") {
            // Set a defualt onClick behavior to dismiss this notification
            item.onClick = (_item) => {
                this._markAsRead(notification.id);
            };

            // If it has some actions
            if (notification.actions) {
                // and one of them is the special "verify" one
                if (this._includesVerifyAccount(notification.actions)) {
                    // Override the onClick function, so that when pressed, user can verify his account
                    item.onClick = (_item) => {
                        console.log("Should verify this account");
                    };
                }
            }
        } else {
            // Otherwise if it's a general one, add the path property so that it can be opened in a special
            // page where more data can be shown.
            item.path = `/notification/${notification.id}`;
        }

        return item;
    }

    private _includesVerifyAccount(actions: any[]) {
        return actions.filter((action) => (action as unknown as ClientAction).name === EClientActions.verify).length > 0;
    }

    private _markAsRead(notificationId: string) {
        this.httpService
            .markNotificationAsRead(notificationId)
            .then((ok) => {
                this._getNotifications();
            })
            .catch((err) => {
                console.log(err);
            });
    }
}
