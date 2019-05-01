import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatSpinner } from '@angular/material';

@Component({
    selector: "app-loading-spinner",
    styleUrls: ["loading-spinner.component.css"],
    templateUrl: "loading-spinner.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingSpinnerComponent extends MatSpinner {

}
