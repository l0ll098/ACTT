import { Injectable } from "@angular/core";
import idb, { UpgradeDB, DB, ObjectStore } from "idb";
import { Log } from "../../../shared/data.model";
import { OfflineAction } from '../models/types.model';

type IDBAccessMode = "readonly" | "readwrite";

enum ObjectStores {
    /**
     * @deprecated
     */
    laptimes = "laptimes",
    settings = "settings",
    logs = "logs",
    offlineActions = "offlineActions"
}
const ACTT_IDB_VERSION = 2;

@Injectable()
export class IndexedDBService {

    private isSupported = true;
    private maximumNumberOfDataToKeep = 60;

    constructor() {
        if (!('indexedDB' in window)) {
            this.isSupported = false;
        }
    }

    /**
     * Opens a DB
     * @param name DB name
     * @param version The version of the DB
     * @param upgradeCallback The function that has to be called if an upgrade is necessary
     */
    private open(name: string, version?: number, upgradeCallback?: (db: UpgradeDB) => void): Promise<DB> {
        if (this.isSupported) {
            return idb.open(name, version, upgradeCallback);
        } else {
            return new Promise(null);
        }
    }

    /**
     * Deletes a database
     * @param name DB name
     */
    private delete(name: string): Promise<void> {
        if (this.isSupported) {
            return idb.delete(name);
        } else {
            return new Promise(null);
        }
    }

    /**
     * This method will delete the oldest data inserted in the db
     * @param objStore The ObjectStore where data are stored
     */
    private deleteOldestData(objStore: ObjectStore<any, any>): Promise<any> {
        return objStore.openCursor(null, "prev").then(cursor => {

            if (cursor) {
                if (this.maximumNumberOfDataToKeep - 1 > 0) {
                    return cursor.advance(this.maximumNumberOfDataToKeep - 1);
                } else {
                    return cursor.advance(this.maximumNumberOfDataToKeep);
                }
            }

        }).then(function deleteRest(cursor) {
            if (!cursor) {
                return;
            }
            cursor.delete();
            return cursor.continue().then(deleteRest);
        });
    }


    /**
     * Opens the results DB
     * @param version The version of the DB
     */
    public openACTTDB(version: number = ACTT_IDB_VERSION): Promise<DB> {
        if (this.isSupported) {
            return this.open("ACTT", version, (upgradeDB) => {
                switch (upgradeDB.oldVersion) {
                    case 0:
                        const settingsStore = upgradeDB.createObjectStore(ObjectStores.settings);
                    case 1:
                        const logsStore = upgradeDB.createObjectStore(ObjectStores.logs, { keyPath: "id", autoIncrement: true });
                    case 2:
                        if (upgradeDB.objectStoreNames.contains(ObjectStores.laptimes)) {
                            upgradeDB.deleteObjectStore(ObjectStores.laptimes);
                        }
                        upgradeDB.createObjectStore(ObjectStores.offlineActions, { keyPath: "id", autoIncrement: true });
                        break;
                }
            });
        } else {
            return new Promise(null);
        }

    }

    public async getObjectStore(name: ObjectStores, mode: IDBAccessMode = "readonly"): Promise<ObjectStore<any, any>> {
        if (!this.isSupported) {
            return null;
        }

        const db = await this.openACTTDB();
        return db.transaction(name, mode).objectStore(name);
    }

    public getSettingsObjectStore(mode: IDBAccessMode = "readonly"): Promise<ObjectStore<any, any>> {
        return this.getObjectStore(ObjectStores.settings, mode);
    }

    public getLogsObjectStore(mode: IDBAccessMode = "readonly"): Promise<ObjectStore<any, any>> {
        return this.getObjectStore(ObjectStores.logs, mode);
    }

    public getOfflineActionsObjectStore(mode: IDBAccessMode = "readonly") {
        return this.getObjectStore(ObjectStores.offlineActions, mode);
    }

    public updateSettingValue(value: any, settingName: string): Promise<IDBValidKey> {
        if (this.isSupported) {
            return this.getSettingsObjectStore("readwrite").then(objStore => {
                return objStore.get(settingName).then(data => {
                    // Check if a value for that key was already present
                    if (data !== undefined) {
                        // If so delete it and add the new one
                        return objStore.delete(settingName).then(() => {
                            return objStore.add(value, settingName);
                        });
                    }
                });
            });
        } else {
            return new Promise(null);
        }
    }

    public getSettingValue(settingName: string): Promise<any> {
        if (this.isSupported) {
            return this.getSettingsObjectStore("readonly").then(objStore => {
                return objStore.get(settingName);
            });
        } else {
            return new Promise(null);
        }
    }

    public insertDefaultSettingValue(settingName: string, defValue: any): Promise<IDBValidKey> {
        if (this.isSupported) {
            return this.getSettingsObjectStore("readwrite").then(objStore => {
                return objStore.get(settingName).then(value => {
                    if (defValue !== undefined && value === undefined) {
                        return objStore.add(defValue, settingName);
                    }
                });
            });
        } else {
            return new Promise(null);
        }
    }

    public async getLogs(): Promise<any> {
        if (this.isSupported) {
            const objStore = await this.getLogsObjectStore("readonly");
            return objStore.getAll();
        } else {
            return new Promise(null);
        }
    }

    public async writeLogs(msg: string): Promise<IDBValidKey> {
        if (!this.isSupported) {
            return null;
        }

        const objStore = await this.getLogsObjectStore("readwrite");
        // Before saving new lines of log, delete (if necessary) the oldest ones.
        await this.deleteOldestData(objStore);

        const log: Log = {
            log: msg,
            timestamp: (new Date).getTime()
        };

        return objStore.add(log);
    }

    public async addNewOfflineAction(action: OfflineAction) {
        if (!this.isSupported) {
            return null;
        }

        const objStore = await this.getOfflineActionsObjectStore("readwrite");
        objStore.add(action);
    }

    public async getAllOfflineActions(): Promise<OfflineAction[]> {
        if (!this.isSupported) {
            return null;
        }

        const objStore = await this.getOfflineActionsObjectStore("readwrite");
        return objStore.getAll();
    }

    public async removeOfflineAction(id: string) {
        if (!this.isSupported) {
            return null;
        }

        const objStore = await this.getOfflineActionsObjectStore("readwrite");
        return objStore.deleteIndex(id);
    }
}
