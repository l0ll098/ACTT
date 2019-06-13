import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: "[appWidget]"
})
export class DashboardWidgetsDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}
