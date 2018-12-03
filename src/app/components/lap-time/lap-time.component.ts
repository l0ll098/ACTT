import {
    Component,
    HostBinding,
    Input,
    ElementRef,
    OnDestroy,
    ViewChild,
    Self,
    Optional
} from "@angular/core";
import {
    FormGroup,
    FormControl,
    Validators,
    AbstractControl,
    ControlValueAccessor,
    DefaultValueAccessor,
    NgControl
} from "@angular/forms";

import { Subject } from "rxjs";

import { MatFormFieldControl } from "@angular/material";
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { FocusMonitor } from "@angular/cdk/a11y";

import { Time } from "../../models/data.model";


@Component({
    selector: 'app-laptime-form-input',
    templateUrl: 'lap-time.component.html',
    styleUrls: ['lap-time.component.css'],
    providers: [
        {
            provide: MatFormFieldControl,
            useExisting: LapTimeFormInputComponent
        }
    ]
})
export class LapTimeFormInputComponent
    implements MatFormFieldControl<Time>, ControlValueAccessor, OnDestroy {


    static nextId = 0;

    autofilled = false;
    parts: FormGroup;
    stateChanges = new Subject<void>();
    focused = false;
    errorState: any = false;
    controlType = 'app-laptime-form-input';

    @ViewChild(DefaultValueAccessor) private valueAccessor: DefaultValueAccessor;

    @HostBinding() id = `app-laptime-form-input-${LapTimeFormInputComponent.nextId++}`;
    @HostBinding("attr.aria-describedby") describedBy = "";

    get empty() {
        const { value: { minutes, seconds, millisecs } } = this.parts;

        if (minutes !== null || seconds !== null || millisecs !== null) {
            return false;
        } else {
            return true;
        }
    }

    @HostBinding('class.floating')
    get shouldLabelFloat() {
        return this.focused || !this.empty;
    }

    @Input()
    get placeholder(): string { return this._placeholder; }
    set placeholder(value: string) {
        this._placeholder = value;
        this.stateChanges.next();
    }
    private _placeholder: string;

    @Input()
    get required(): boolean { return this._required; }
    set required(value: boolean) {
        this._required = coerceBooleanProperty(value);
        this.stateChanges.next();
    }
    private _required = false;

    @Input()
    get disabled(): boolean { return this._disabled; }
    set disabled(value: boolean) {
        this._disabled = coerceBooleanProperty(value);
        this.stateChanges.next();
    }
    private _disabled = false;


    @Input()
    get value(): Time | null {
        const { value: { minutes, seconds, millisecs } } = this.parts;
        return {
            minutes: minutes,
            seconds: seconds,
            millisecs: millisecs
        };
    }
    set value(time: Time | null) {
        this.parts.setValue(time);
        // Tell Angular that the value has been updated
        this.valueAccessor.onChange(time);
        this.stateChanges.next();
    }


    public FormControls = {
        minutes: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(59), minutesValidator]),
        seconds: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(59), secondsValidator]),
        millisecs: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(999), millisecsValidator])
    };

    constructor(
        private fm: FocusMonitor,
        private elRef: ElementRef<HTMLElement>,
        @Optional() @Self() public ngControl: NgControl) {

        if (this.ngControl != null) {
            this.ngControl.valueAccessor = this;
        }

        this.parts = new FormGroup({
            minutes: this.FormControls.minutes,
            seconds: this.FormControls.seconds,
            millisecs: this.FormControls.millisecs
        }, {
                // Required in order to validate the form as a unique indivisible thing
                validators: validator("minutes", "seconds", "millisecs")
            }
        );

        fm.monitor(elRef.nativeElement, true).subscribe(origin => {
            this.focused = !!origin;
            this.stateChanges.next();
        });
    }

    ngOnDestroy() {
        this.stateChanges.complete();
        this.fm.stopMonitoring(this.elRef.nativeElement);
    }

    setDescribedByIds(ids: string[]) {
        this.describedBy = ids.join(' ');
    }

    onContainerClick(event: MouseEvent) {
        if ((event.target as Element).tagName.toLowerCase() !== 'input') {
            if (this.elRef.nativeElement) {
                this.elRef.nativeElement.querySelector('input').focus();
            }
        }
    }

    onInput(event) {
        // Check if there is an error
        if (this.parts.errors) {
            // If so, update the errorState. This will highlight the form input of red
            this.errorState = this.parts.errors;
            // Propagate the error. Required in order to show custom error messages
            this.ngControl.control.setErrors(this.errorState);
        } else {
            // If there isn't an error, update the errorState to false so that it will pass in the
            // normal state
            this.errorState = false;
            this.ngControl.control.setErrors(null);

            // Update the stored value
            this.value = {
                minutes: this.FormControls.minutes.value,
                seconds: this.FormControls.seconds.value,
                millisecs: this.FormControls.millisecs.value
            };
        }
    }

    writeValue(time: Time): void {
        this.valueAccessor.writeValue(time);
    }
    registerOnChange(fn: any): void {
        this.valueAccessor.registerOnChange(fn);
    }
    registerOnTouched(fn: any): void {
        this.valueAccessor.registerOnTouched(fn);
    }
    setDisabledState?(isDisabled: boolean): void {
        this.valueAccessor.setDisabledState(isDisabled);
        this.disabled = isDisabled;
    }

}



export function minutesValidator(control: AbstractControl): { [key: string]: any } | null {
    if (control.value < 0) {
        return { minMin: { valid: false, value: control.value } };
    }

    if (control.value > 59) {
        return { maxMin: { valid: false, value: control.value } };
    }

    return null;
}

export function secondsValidator(control: AbstractControl): { [key: string]: any } | null {

    if (control.value < 0) {
        return { minSec: { valid: false, value: control.value } };
    }

    if (control.value > 59) {
        return { maxSec: { valid: false, value: control.value } };
    }

    return null;
}

export function millisecsValidator(control: AbstractControl): { [key: string]: any } | null {

    if (control.value < 0) {
        return { minMillisecs: { valid: false, value: control.value } };
    }

    if (control.value > 999) {
        return { maxMillisecs: { valid: false, value: control.value } };
    }

    return null;
}

function validator(minutesKey, secondsKey, millisecsKey) {
    return (group: FormGroup): { [key: string]: any } => {
        const minutes = group.controls[minutesKey];
        const seconds = group.controls[secondsKey];
        const millisecs = group.controls[millisecsKey];

        // Assemble all the errors eventually returned from the validators into an unique object
        const errors = { ...minutesValidator(minutes), ...secondsValidator(seconds), ...millisecsValidator(millisecs) };

        // Check that there is not an error by checking if errors isn't null and that it isn't empty
        if (errors && !(Object.keys(errors).length === 0 && errors.constructor === Object)) {
            return errors;
        } else {
            return null;
        }
    };
}
