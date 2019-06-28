import { Injectable } from '@angular/core';
import { WidgetItem } from '../models/widgets.model';

import { TimeGraphsComponent } from '../components/dashboard/widgets/time-graphs/time-graphs.component';
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
            }),
            new WidgetItem(TimeGraphsComponent, {
                cols: {
                    desktop: 2,
                    mobile: 4
                },
                rows: 2,
                widgetCategory: "Times",
                widgetName: "Times trend",
                widgetIcon: "timeline"
            })
        ];
    }
}
