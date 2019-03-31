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

    public ABS_VALUE: string[] = ["0", "50", "100"];

    public TRACTION_CONTROL_VALUES: string[] = [
        "0", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100"
    ];
    public STABILITY_CONTROL_VALUES: string[] = [
        "0", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100"
    ];
    public MECHANICAL_DAMAGES_VALUES: string[] = [
        "0", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100"
    ];

    public FormControls = {
        autoShifter: new FormControl(),
        autoFriction: new FormControl(),
        autoBlip: new FormControl(),
        idealTrajectory: new FormControl(),
        tractionControl: new FormControl([0]),
        abs: new FormControl([0]),
        stabilityControl: new FormControl([0]),
        mechanicalDamages: new FormControl([0]),
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

}
