import { Injectable } from "@angular/core";
import { SettingsItem, SettingsSelectItem } from "../models/lists.model";
import { IndexedDBService } from "./indexedDb.service";

export enum SettingsName {
    EnableNotifications = "enableNotifications",
    LapTimesPageSize = "lapTimesPageSize"
}

@Injectable()
export class SettingsService {

    private settings: SettingsItem[] = [
        {
            icon: "notifications",
            text: "Enable notifications",
            secondaryText: "Enable this to get notifications",
            type: "toggle",
            formControlName: SettingsName.EnableNotifications,
            defualtValue: false,
            isDisabled: true,
            onChange: (value) => { }
        },
        {
            isDivider: true
        },
        {
            icon: "show_chart",
            text: "View Times table",
            secondaryText: "How many times to show in view times?",
            type: "select",
            formControlName: SettingsName.LapTimesPageSize,
            values: [
                { value: 5, viewValue: "5" },
                { value: 10, viewValue: "10" },
                { value: 20, viewValue: "20" },
                { value: 50, viewValue: "50" },
                { value: 100, viewValue: "100" },
            ],
            defualtValue: 10,
            onChange: (value) => { }
        },
    ];


    constructor(private idbService: IndexedDBService) { }

    public getAllSettings(): SettingsItem[] {
        return this.settings;
    }

    public initDefaultSettingsValues() {
        this.settings.forEach(setting => {
            if (setting["formControlName"]) {
                this.idbService.insertDefaultSettingValue(setting.formControlName, setting.defualtValue);
            }
        });
    }

    public updateSettingValue(value: any, settingName: string) {
        return this.idbService.updateSettingValue(value, settingName);
    }

    public getSettingValue(settingName: string): Promise<any> {
        return this.idbService.getSettingValue(settingName);
    }

    public getSttingsValues(settingName: string): Promise<SettingsSelectItem[]> {
        return new Promise((resolve, reject) => {
            const matching = this.settings.filter(setting => setting.formControlName === settingName);
            if (matching.length > 0) {
                return resolve(matching[0].values);
            } else {
                return reject(null);
            }
        });
    }
}
