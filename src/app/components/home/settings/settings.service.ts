import { Injectable } from "@angular/core";
import { SettingsItem } from "../../../models/lists.model";
import { IndexedDBService } from "../../../services/indexedDb.service";

@Injectable()
export class SettingsService {

    private settings: SettingsItem[] = [
        {
            icon: "notifications",
            text: "Enable notifications",
            secondaryText: "Enable this to get notifications",
            type: "toggle",
            formControlName: "enableNotifications",
            defualtValue: false,
            onChange: (value) => { }
        },
        {
            icon: "play",
            text: "test",
            type: "checkbox",
            formControlName: "test",
            defualtValue: true,
            onChange: (value) => { }
        }
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
}
