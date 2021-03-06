import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from "@angular/core";

import { IndexedDBService } from "../../services/indexedDb.service";

import { Log } from "../../../../shared/data.model";


@Component({
    selector: 'app-logs',
    templateUrl: "logs.component.html",
    styleUrls: ["./logs.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogsComponent implements OnInit {

    public dataSource: Log[] = null;
    displayedColumns: string[] = ['id', 'timestamp', 'log'];


    constructor(
        private idbService: IndexedDBService,
        private changeDetectorRef: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.idbService
            .getLogs()
            .then(logs => {
                this.dataSource = logs;

                this.changeDetectorRef.markForCheck();
            })
            .catch(err => {
                this.dataSource = [];
            });
    }
}
