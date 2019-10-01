import { Injectable } from '@angular/core';
import { WidgetItem } from '../models/widgets.model';

import { NotificationsWidgetComponent } from "../components/dashboard/widgets/notifications/notifications-widget.component";

@Injectable()
export class WidgetService {
    getWidgets(): WidgetItem[] {
        return [
            new WidgetItem(NotificationsWidgetComponent, {
                cols: {
                    desktop: 3,
                    mobile: 4
                },
                rows: 2,
                widgetCategory: "Info",
                widgetName: "Notifications",
                widgetIcon: "notification_important"
            })
        ];
    }
}
