import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
    selector: "app-lap-assists",
    templateUrl: "lap-assists.component.html",
    styleUrls: ["./lap-assists.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LapAssistsComponent {

    @Input() description = "";

    public FormControls = {
        autoShifter: new FormControl(),
        autoFriction: new FormControl(),
        autoBlip: new FormControl(),
        idealTrajectory: new FormControl(),
        tractionControl: new FormControl(),
        abs: new FormControl(),
        stabilityControl: new FormControl(),
        mechanicalDamages: new FormControl(),
        tyresWear: new FormControl(),
        tyresBlankets: new FormControl(),
        fuelConsumption: new FormControl(),
    };

    public lapAssistsFG = new FormGroup({
        autoShifter: this.FormControls.autoShifter,
        autoFriction: this.FormControls.autoFriction,
        autoBlip: this.FormControls.autoBlip,
        idealTrajectory: this.FormControls.idealTrajectory,
        tractionControl: this.FormControls.tractionControl,
        abs: this.FormControls.abs,
        stabilityControl: this.FormControls.stabilityControl,
        mechanicalDamages: this.FormControls.mechanicalDamages,
        tyresWear: this.FormControls.tyresWear,
        tyresBlankets: this.FormControls.tyresBlankets,
        fuelConsumption: this.FormControls.fuelConsumption,
    });

    constructor() { }


    formatLabel(value: number | null) {
        if (!value) {
            return 0;
        }

        return value;
    }
}
