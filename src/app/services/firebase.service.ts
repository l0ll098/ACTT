import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";

import { AuthService } from "./auth.service";
import { LapTime, Track, Car, IsBetterLapTime } from "../models/data.model";
import { DataSnapshot } from "@angular/fire/database/interfaces";

/**
 * @constant userRefInitializer This is used to initialize the user object in the database
 */
const userRefInitializer = {
    settings: {
        receiveNotifications: false
    },
    notifications: {
        tokens: {

        }
    },
    lapTimes: {

    }
};

@Injectable()
export class FirebaseService {

    private uid;

    constructor(
        private authService: AuthService,
        private db: AngularFireDatabase) {

        this.uid = this.authService.getCurrentUser().uid;
    }

    /**
     * Returns a reference to the path passed as a parameter
     * @param {string} path The path where data are stored
     */
    public getRef(path?: string) {
        return this.db.object(path);
    }

    /**
     * Returns the current user's object stored in the DataBase
     * @returns A reference to the user's object
     */
    public getUserRef() {
        return this.db.object("/users/" + this.uid);
    }

    /**
     * Returns the ref to a certain subnode of the passed path
     * @param {string} refPath The path of a certain reference
     * @param {string} path The path of the wanted node
     */
    public getChild(refPath: string, path: string) {
        return this.db.object(refPath + "/" + path);
    }

    /**
     * This method will return the data stored in the passed path
     * @param {string} path The path where the wanted data are stored
     */
    public getData(path: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getRef(path)
                .valueChanges()
                .subscribe(
                    (data) => {
                        return resolve(data);
                    },
                    (err) => {
                        return reject(err);
                    }
                );
        });
    }

    /**
     * Inserts the objected passed as first parameter, unde
     * @param {Object} obj The object to store
     * @param {string} path The path where it has to be stored
     * @returns {Promise<any>} A promise to check if this method has finished its job
     */
    public insertData(obj: Object, path: string): Promise<any> {
        return this.getRef(path).set(obj);
    }

    public pushData(obj: Object, path: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getRef(path).update(obj)
                .then(data => {
                    return resolve(data);
                }, (err) => {
                    return reject(err);
                });
        });
    }

    /**
     * Soft update of all the properties of the passed object
     * @param {Object} obj An object containing the new values
     * @param {string} path The path where the object will be stored
     * @returns {Promise<boolean>} This promise will indicate when this function ends its job
     */
    public updateData(obj: Object, path: string): Promise<boolean> {
        const keys = Object.keys(obj);

        keys.forEach(key => {
            // Check the type of the value in that node
            switch (typeof obj[key]) {
                case "boolean":
                case "number":
                case "string":
                    // If it's a primitive value, set it to the node path in the DB
                    this.getRef(path + "/" + key).set(obj[key]);
                    break;
                case "object":
                    // If it's an object, call recursively this function on that object
                    this.updateData(obj[key], path + "/" + key);
                    break;
            }
        });

        return Promise.resolve(true);
    }

    /**
     * This method will update a generic child under the current user ref.
     * The value that has to be set, is passed as second parameter
     * @param {string} path The path where the newValue has to be updated
     * @param {Object} newValue The new value
     * @returns {Promise<any>} A promise to check if this method has finished its job
     */
    public updatePropertyForCurrentUser(path: string, newValue: Object): Promise<any> {
        return this.getRef("/users/" + this.uid + "/" + path).update(newValue);
    }

    /**
     * This will initialize the current user ref ONLY if it doesn't already contains some data.
     * @see {userRefInitializer} This object will be used as a template to initialize the referenced object.
     */
    public initializeCurrentUserRef() {
        return this.getUserRef()
            .valueChanges()
            .subscribe(data => {
                if (!(data)) {
                    this.getUserRef().update(userRefInitializer);
                }
            });
    }

    /**
     * Saves a lapTime (only if it's a record).
     * Old records are kept.
     * @param lapTime The new lapTime
     */
    public saveUserLapTime(lapTime: LapTime) {
        return new Promise((resolve, reject) => {
            this.isABetterLapTime(lapTime).then(isBetter => {
                if (isBetter) {
                    this.pushData(lapTime, "users/" + this.uid + "/lapTimes/" + this.db.createPushId())
                        .then(data => {
                            return resolve(data);
                        })
                        .catch(err => {
                            return reject(err);
                        });
                } else {
                    return reject({ isABetterLapTime: false });
                }
            });
        });
    }

    /**
     * Checks if the passed lapTime is a record.
     * If the car has never been used, it's a record, whatever time user has scored.
     * If user has never driven on the track, it's a record, whatever time he has scored.
     * If user scores a lower lapTime, it's a record.
     * If user scores a lower (or equal) lapTime in a lower lap, it's a record.
     * @param lapTime The new lapTime to check
     */
    public isABetterLapTime(lapTime: LapTime): Promise<IsBetterLapTime> {
        return new Promise((resolve, reject) => {
            this.getLapTimesByCarAndTrack(lapTime.car, lapTime.track).then(data => {
                if (data) {
                    data.forEach(_lapTime => {
                        if (lapTime.time.millisecs < _lapTime.time.millisecs) {
                            console.log("Better time");

                            return resolve({ isBetter: true, reason: "Better time" });
                        } else {
                            if (lapTime.time.millisecs === _lapTime.time.millisecs && _lapTime.lap < lapTime.lap) {
                                console.log("Better lap number");
                                return resolve({ isBetter: true, reason: "Better LapNumber" });
                            } else {
                                console.log("Worse time");
                                return resolve({ isBetter: false, reason: "Worse Time" });
                            }
                        }
                    });
                } else {
                    console.log("Best time as there are not records");
                    return resolve({ isBetter: true, reason: "First time saved" });
                }
            });
        });
    }


    public getLapTimes(limitTo: number = 25): Promise<LapTime[]> {
        return new Promise((resolve, reject) => {
            this.getRef("/users/" + this.uid + "/lapTimes")
                .query
                .limitToLast(limitTo)
                .once("value", (data) => {
                    return resolve(this._formatLapTimeQueryResults(data));
                }, (err) => {
                    return reject(err);
                });
        });
    }

    public getLapTimesByTrack(track: Track, limitTo: number = 25): Promise<LapTime[]> {
        return new Promise((resolve, reject) => {
            this.getRef("/users/" + this.uid + "/lapTimes")
                .query
                .orderByChild("track/name")
                .equalTo(track.name)
                .limitToLast(limitTo)
                .once("value", (data) => {
                    // Convert it to an array
                    const dataArray: LapTime[] = Object.keys(data.val()).map((key) => {
                        return data.val()[key];
                    });
                    // Sort the data
                    return resolve(dataArray.sort((a: LapTime, b: LapTime) => {
                        return a.time.millisecs - b.time.millisecs;
                    }));
                }, (err) => {
                    return reject(err);
                });
        });
    }

    public getLapTimesByCar(car: Car, limitTo: number = 25): Promise<LapTime[]> {
        return new Promise((resolve, reject) => {
            this.getRef("/users/" + this.uid + "/lapTimes")
                .query
                .orderByChild("car/name")
                .equalTo(car.name)
                .limitToLast(limitTo)
                .once("value", (data) => {
                    // Convert it to an array
                    const dataArray: LapTime[] = Object.keys(data.val()).map((key) => {
                        return data.val()[key];
                    });
                    // Sort the data
                    return resolve(dataArray.sort((a: LapTime, b: LapTime) => {
                        return a.time.millisecs - b.time.millisecs;
                    }));
                }, (err) => {
                    return reject(err);
                });
        });
    }

    /**
     * Queris the DB getting data where car and track are the same as the one passed
     * @param car The car used
     * @param track The track where the car has been used
     */
    private getLapTimesByCarAndTrack(car: Car, track: Track): Promise<LapTime[]> {
        return new Promise((resolve, reject) => {
            this.getRef("/users/" + this.uid + "/lapTimes")
                .query
                .orderByChild("car/name")
                .equalTo(car.name)
                .once("value", (data) => {

                    if (data.hasChildren()) {
                        data.ref
                            .orderByChild("track/name")
                            .equalTo(track.name)
                            .once("value", (data_track_name) => {

                                if (data.hasChildren()) {
                                    data_track_name.ref
                                        .orderByChild("track/length")
                                        .equalTo(track.length)
                                        .once("value", (data_track_length) => {
                                            const valLapTimes: LapTime[] = data_track_length.val();

                                            // Convert it to an array
                                            const lapTimes: LapTime[] = Object.keys(valLapTimes).map((key) => {
                                                return valLapTimes[key];
                                            });

                                            return resolve(lapTimes);
                                        });
                                } else {
                                    return resolve(null);
                                }
                            });
                    } else {
                        return resolve(null);
                    }
                });
        });
    }


    private _formatLapTimeQueryResults(rowData: DataSnapshot) {
        if (!rowData.val()) {
            return [];
        }

        // Convert it to an array
        const dataArray: LapTime[] = Object.keys(rowData.val()).map((key) => {
            return rowData.val()[key];
        });
        // Sort the data
        const sorted = dataArray.sort((a: LapTime, b: LapTime) => {
            return a.time.millisecs - b.time.millisecs;
        });

        // Calculate the human time
        sorted.forEach((lapTime: LapTime) => {
            let ms = lapTime.time.millisecs;

            const min = Math.floor(ms / 60000);
            ms = ms - (min * 60000);
            const secs = Math.floor(ms / 1000);
            ms = ms - (secs * 1000);
            lapTime.humanTime = {
                millisecs: ms,
                seconds: secs,
                minutes: min
            };
        });

        return sorted;
    }
}
