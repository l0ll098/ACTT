import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormControl } from '@angular/forms';

import { FirebaseService } from '../../services/firebase.service';
import { LapAssists } from '../../models/data.model';


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
        private changeDetectorRef: ChangeDetectorRef) {

        this.assistsFG = new FormGroup({
            assists: new FormControl()
        });

        this.firebaseService.getLapAssists()
            .then((lapAssists: LapAssists) => {
                console.log(lapAssists);
                this.assistsFG.controls["assists"].setValue(lapAssists);
                this.changeDetectorRef.markForCheck();
            })
            .catch(err => {
                console.log(err);
            });
    }

    public save() {
        this.firebaseService
            .saveLapAssists(this.assistsFG.get("assists").value)
            .then((ok) => {
                console.log("Done");
            })
            .catch((err) => {
                console.log("err: ", err);
            });
    }

    public discard() {
        console.log("discard");
    }
}
