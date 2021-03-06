import { Component, OnInit, Input, ViewChild, ComponentFactoryResolver, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { DashboardWidgetsDirective } from '../dashboard-widgets.directive';
import { WidgetItem, WidgetComponent } from '../../../models/widgets.model';

@Component({
    selector: "app-dashboard-widget-container",
    template: `<ng-template appWidget></ng-template>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardWidgetContainerComponent implements OnInit {
    @Input() widget: WidgetItem;
    @ViewChild(DashboardWidgetsDirective, { static: true }) widgetHost: DashboardWidgetsDirective;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private changeDetectorRef: ChangeDetectorRef) { }

    ngOnInit() {
        this.loadComponent();
    }

    loadComponent() {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.widget.component);

        const viewContainerRef = this.widgetHost.viewContainerRef;
        viewContainerRef.clear();

        const componentRef = viewContainerRef.createComponent(componentFactory);
        (<WidgetComponent>componentRef.instance).details = this.widget.tileDetails;

        this.changeDetectorRef.markForCheck();
    }
}
