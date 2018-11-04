import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { SettingsItem } from "../../models/lists.model";
import { FormGroup, FormControl } from "@angular/forms";
import { SettingsService } from "../../services/settings.service";

@Component({
    selector: "app-settings",
    templateUrl: "./settings.component.html",
    styleUrls: ["./settings.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit {

    public settingsFG: FormGroup;
    public settings: SettingsItem[];

    constructor(private settingsService: SettingsService) {
        this.settingsFG = new FormGroup({});

        // Get all the settings from the service
        this.settings = settingsService.getAllSettings();

        settingsService.initDefaultSettingsValues();
    }

    ngOnInit() {
        // Initialize the FormGroup
        this.settings.forEach((setting: SettingsItem) => {
            if (setting.formControlName) {
                this.settingsFG.addControl(setting.formControlName, new FormControl({ value: null, disabled: setting.isDisabled }));

                // When the form control changes its state, call the function onChange()
                this.settingsFG.get(setting.formControlName).valueChanges.subscribe((e) => {
                    if (setting["onChange"]) {
                        if (setting["formControlName"]) {
                            // Update the stored value for the current setting
                            this.settingsService.updateSettingValue(e, setting.formControlName);
                        }
                        // If defined invoke the callback
                        if (setting["onChange"]) {
                            setting.onChange(e);
                        }
                    }
                });

                // Get the previously saved value and set it to the correspondent formControl
                this.settingsService.getSettingValue(setting.formControlName).then(value => {
                    this.settingsFG.get(setting.formControlName).setValue(value);
                });
            }
        });
    }


}
