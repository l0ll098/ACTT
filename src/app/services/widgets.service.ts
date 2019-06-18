import { Injectable } from '@angular/core';
import { WidgetItem } from '../models/widgets.model';
import { TimeGraphsComponent } from '../components/dashboard/widgets/time-graphs/time-graphs.component';

@Injectable()
export class WidgetService {
    getWidgets(): WidgetItem[] {
        return [
            new WidgetItem(TimeGraphsComponent, {
                cols: {
                    desktop: 2,
                    mobile: 4
                },
                rows: 2,
                widgetCategory: "Times",
                widgetName: "Times trend"
            })
        ];
    }
}
