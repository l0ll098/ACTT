import { Component, ChangeDetectionStrategy } from "@angular/core";
import { FormGroup, FormControl } from '@angular/forms';

import { FirebaseService } from '../../services/firebase.service';


@Component({
    selector: "app-settings-assists-component",
    templateUrl: "settings-assists.component.html",
    styleUrls: ["settings-assists.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsAssistsComponent {

    assistsFG: FormGroup;

    constructor(private firebaseService: FirebaseService) {
        this.assistsFG = new FormGroup({
            assists: new FormControl()
        });
    }

    public save() {
        console.log(this.assistsFG.get("assists").value);
    }

    public discard() {
        console.log("discard");
    }
}
