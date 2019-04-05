import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormControl } from '@angular/forms';

import { FirebaseService } from '../../services/firebase.service';
import { LapAssists } from '../../models/data.model';
import { LoggerService } from '../../services/log.service';


@Component({
    selector: "app-settings-assists-component",
    templateUrl: "settings-assists.component.html",
    styleUrls: ["settings-assists.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsAssistsComponent {

    assistsFG: FormGroup;

    constructor(
        private firebaseService: FirebaseService,
        private loggerService: LoggerService,
        private changeDetectorRef: ChangeDetectorRef) {

        this.assistsFG = new FormGroup({
            assists: new FormControl()
        });

        this.loggerService.group("assists settings");

        this.firebaseService.getLapAssists()
            .then((lapAssists: LapAssists) => {
                this.loggerService.log("fetched previously saved assists");
                this.loggerService.groupEnd();

                this.assistsFG.controls["assists"].setValue(lapAssists);
                this.changeDetectorRef.markForCheck();
            })
            .catch(err => {
                this.loggerService.error("failed fetching previously saved assists. Error: ", err);
                this.loggerService.groupEnd();
            });
    }

    public save() {
        this.loggerService.group("assists settings");
        this.loggerService.log("Saving new assists...");

        this.firebaseService
            .saveLapAssists(this.assistsFG.get("assists").value)
            .then((ok) => {
                this.loggerService.log("Done");
                this.loggerService.groupEnd();
            })
            .catch((err) => {
                this.loggerService.error("failed with error: ", err);
                this.loggerService.groupEnd();
            });

    }

    public discard() {
        this.loggerService.group("assists settings");
        this.loggerService.log("discarding unsaved changes...");
        this.loggerService.groupEnd();
    }
}
