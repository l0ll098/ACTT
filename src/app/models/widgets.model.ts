import { Type } from '@angular/core';

export class WidgetItem {
    constructor(public component: Type<any>, public data: any) {}
}
