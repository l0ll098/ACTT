import {
    Component, Input, ViewChild, ElementRef, OnDestroy,
    ChangeDetectorRef, forwardRef, ChangeDetectionStrategy
} from '@angular/core';
import { FormControl, FormGroup, ControlValueAccessor, DefaultValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LapAssists } from '../../../models/data.model';
import { Subject } from 'rxjs';


@Component({
    selector: "app-lap-assists",
    templateUrl: "lap-assists.component.html",
    styleUrls: ["./lap-assists.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => LapAssistsComponent),
            multi: true
        }
    ]
})
export class LapAssistsComponent implements ControlValueAccessor, OnDestroy {

    public ABS_VALUE: string[] = ["Off", "Factory", "On"];
    public TRACTION_CONTROL_VALUES: string[] = [
        "0", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100"
    ];
    public STABILITY_CONTROL_VALUES: string[] = [
        "0", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100"
    ];
    public MECHANICAL_DAMAGES_VALUES: string[] = [
        "0", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100"
    ];

    @ViewChild(DefaultValueAccessor, { static: false })
    private valueAccessor: DefaultValueAccessor;
    stateChanges = new Subject<void>();


    @Input()
    get value(): LapAssists | null {
        return this._value;
    }
    set value(lapAssists: LapAssists | null) {
        this._value = lapAssists;
        this.propagateChange(lapAssists);

        if (lapAssists) {
            this.lapAssistsFG.setValue(lapAssists);
        }

        this.changeDetectorRef.markForCheck();
    }
    private _value: LapAssists = null;

    @Input()
    get readonly(): boolean {
        return this._readonly;
    }
    set readonly(readonly: boolean) {
        this._readonly = readonly;

        if (this._readonly) {
            this.lapAssistsFG.disable();
        } else {
            this.lapAssistsFG.enable();
        }

        this.changeDetectorRef.markForCheck();
    }
    private _readonly: boolean;

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
        fuelConsumption: new FormControl()
    };

    public lapAssistsFG: FormGroup;

    constructor(
        private elRef: ElementRef<HTMLElement>,
        private changeDetectorRef: ChangeDetectorRef) {

        this.lapAssistsFG = new FormGroup({
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
            fuelConsumption: this.FormControls.fuelConsumption
        });

    }

    ngOnDestroy() {
        this.stateChanges.complete();
    }

    onInput() {
        this.value = {
            autoShifter: this.FormControls.autoShifter.value || false,
            autoFriction: this.FormControls.autoFriction.value || false,
            autoBlip: this.FormControls.autoBlip.value || false,
            idealTrajectory: this.FormControls.idealTrajectory.value || false,
            tractionControl: this.FormControls.tractionControl.value,
            abs: this.FormControls.abs.value,
            stabilityControl: this.FormControls.stabilityControl.value,
            mechanicalDamages: this.FormControls.mechanicalDamages.value,
            tyresWear: this.FormControls.tyresWear.value || false,
            tyresBlankets: this.FormControls.tyresBlankets.value || false,
            fuelConsumption: this.FormControls.fuelConsumption.value || false,
        };
    }

    propagateChange = (_: any) => { };

    writeValue(val: LapAssists) {
        // Do not set directly the private value (_value).
        // use instead the setter method so that view can reflect the new value
        this.value = val;
    }
    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }
    registerOnTouched(fn: any): void { }

}
