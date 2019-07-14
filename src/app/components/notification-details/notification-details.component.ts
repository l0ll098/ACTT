import { Component, ChangeDetectionStrategy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { HttpService } from '../../services/http.service';
import { Notification } from '../../../../shared/data.model';

@Component({
    selector: "app-notification-details",
    styleUrls: ["notification-details.component.css"],
    templateUrl: "notification-details.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationDetailsComponent implements AfterViewInit {
    public showLoadingSpinner = true;
    public notification: Notification;
    public icon: string;

    constructor(
        private route: ActivatedRoute,
        private changeDetector: ChangeDetectorRef,
        private httpService: HttpService) { }

    ngAfterViewInit() {
        const id = this.route.snapshot.paramMap.get("id");

        this.httpService
            .getNotificationById(id)
            .then((notification) => {
                this.notification = notification;
                this.icon = "info";
                this.showLoadingSpinner = false;
                this.changeDetector.detectChanges();
            })
            .catch((err) => {
                console.log(err);
            });
    }
}
