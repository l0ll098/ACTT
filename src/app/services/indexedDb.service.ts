import { Injectable } from "@angular/core";
import idb, { UpgradeDB, DB, ObjectStore } from "idb";
import { Log } from "../../../shared/data.model";

enum ObjectStores {
    "laptimes" = "laptimes",
    "settings" = "settings",
    "logs" = "logs"
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
                        const laptimesStore = upgradeDB.createObjectStore(ObjectStores.laptimes);
                        const settingsStore = upgradeDB.createObjectStore(ObjectStores.settings);
                    case 1:
                        const logsStore = upgradeDB.createObjectStore(ObjectStores.logs, { keyPath: "id", autoIncrement: true });
                    case 2:
                        break;
                }
            });
        } else {
            return new Promise(null);
        }

    }

    /**
     * Reads data from the ObjectStore "laptimes"
     * @param mode This indicates the opening mode of the ObjectStore
     */
    public getResultsObjectStore(mode: "readonly" | "readwrite" = "readonly"): Promise<ObjectStore<any, any>> {
        if (this.isSupported) {
            return this.openACTTDB().then(db => {
                return db.transaction(ObjectStores.laptimes, mode).objectStore(ObjectStores.laptimes);
            });
        } else {
            return new Promise(null);
        }
    }

    public getSettingsObjectStore(mode: "readonly" | "readwrite" = "readonly"): Promise<ObjectStore<any, any>> {
        if (this.isSupported) {
            return this.openACTTDB().then(db => {
                return db.transaction(ObjectStores.settings, mode).objectStore(ObjectStores.settings);
            });
        } else {
            return new Promise(null);
        }
    }

    public getLogsObjectStore(mode: "readonly" | "readwrite" = "readonly"): Promise<ObjectStore<any, any>> {
        if (this.isSupported) {
            return this.openACTTDB().then(db => {
                return db.transaction(ObjectStores.logs, mode).objectStore(ObjectStores.logs);
            });
        } else {
            return new Promise(null);
        }
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
}
