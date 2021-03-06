import { Injectable } from "@angular/core";
import { Router } from '@angular/router';

import { SettingsItem, SettingsSelectItem } from "../models/lists.model";
import { IndexedDBService } from "./indexedDb.service";

export enum SettingsName {
    EnableNotifications = "enableNotifications",
    LapTimesPageSize = "lapTimesPageSize",
    EnableLogButton = "enableLogButton",
    ChangeUsedAssists = "changeUsedAssists"
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
        {
            icon: "gamepad",
            text: "Change used assists",
            secondaryText: "Change what assists you use",
            formControlName: SettingsName.ChangeUsedAssists,
            onClick: () => this.changeUsedAssists()
        },
        {
            isDivider: true
        },
        {
            isSubheader: true,
            text: "Advanced features"
        },
        {
            icon: "developer_mode",
            text: "Show log button",
            secondaryText: "Adds a button in the menu to see the log",
            type: "toggle",
            formControlName: SettingsName.EnableLogButton,
            defualtValue: false,
            onChange: (val) => { }
        }
    ];


    constructor(private idbService: IndexedDBService, private router: Router) { }

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

    public getPossibleSettingsValues(settingName: string): Promise<SettingsSelectItem[]> {
        return new Promise((resolve, reject) => {
            const matching = this.settings.filter(setting => setting.formControlName === settingName);
            if (matching.length > 0) {
                return resolve(matching[0].values);
            } else {
                return reject(null);
            }
        });
    }

    private changeUsedAssists() {
        // Change path
        this.router.navigate(["settings/assists"]);
    }
}
