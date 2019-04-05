import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { DataSnapshot } from "@angular/fire/database/interfaces";

import { AuthService } from "./auth.service";
import { LapTime, Track, Car, IsBetterLapTime, LapAssists } from "../models/data.model";

/**
 * @constant userRefInitializer This is used to initialize the user object in the database
 * (even though it's pretty useless if properties aren't specified).
 */
const userRefInitializer = {
    settings: {
        receiveNotifications: false,
        assists: {

        }
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
    public saveUserLapTime(lapTime: LapTime): Promise<IsBetterLapTime> {
        return new Promise((resolve, reject) => {
            this.isABetterLapTime(lapTime).then(isBetterLap => {
                if (isBetterLap.isBetter) {
                    this.pushData(lapTime, "users/" + this.uid + "/lapTimes/" + this.db.createPushId())
                        .then(data => {
                            return resolve(isBetterLap);
                        })
                        .catch(err => {
                            return reject(err);
                        });
                } else {
                    return reject(isBetterLap);
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
                const toRet: IsBetterLapTime = {
                    reason: "First time saved",
                    isBetter: true
                };

                if (data) {
                    data.forEach(_lapTime => {
                        // If the saved time is better, the passed one is worse
                        if (_lapTime.time.millisecs < lapTime.time.millisecs) {
                            toRet.isBetter = false;
                            toRet.reason = "Worse Time";

                            return resolve(toRet);
                        } else {
                            // If the saved and passed laptime have the same time but the saved one has
                            // a better lap, the passed one is worse
                            if (_lapTime.time.millisecs === lapTime.time.millisecs && _lapTime.lap < lapTime.lap) {
                                toRet.isBetter = false;
                                toRet.reason = "Worse LapNumber";

                                return resolve(toRet);
                            } else {
                                // Keep cycling saved times to ensure that the passed laptime is really a better one
                            }
                        }
                    });
                }

                return resolve(toRet);
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
                                            let lapTimes: LapTime[] = [];

                                            if (valLapTimes) {
                                                // Convert it to an array
                                                lapTimes = Object.keys(valLapTimes).map((key) => {
                                                    return valLapTimes[key];
                                                });
                                            }

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

    private getLapTimeKeyByTimestamp(lapTime: LapTime): Promise<string> {
        return new Promise((resolve, reject) => {
            this.getRef("/users/" + this.uid + "/lapTimes/")
                .query
                .orderByChild("timestamp")
                .limitToFirst(1)
                .equalTo(lapTime.timestamp)
                .once("value", (data) => {
                    const savedLapTime = data.val();
                    return resolve(Object.keys(savedLapTime)[0]);
                });
        });
    }

    /**
     * This method will delete a single lapTime.
     * The "deleteLapTimes" method is based on this one.
     * @param lapTime The LapTime that has to be deleted
     */
    private deleteASingleLapTime(lapTime: LapTime): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.getLapTimeKeyByTimestamp(lapTime).then(key => {
                this.getRef("/users/" + this.uid + "/lapTimes/" + key + "/")
                    .remove()
                    .then(done => {
                        return resolve(true);
                    })
                    .catch(err => {
                        return reject(false);
                    });
            });
        });
    }

    /**
     * This method will delete the array of LapTime(s).
     * @param lapTimes The array of LapTimes that has to be deleted.
     */
    public deleteLapTimes(lapTimes: LapTime[]) {
        return Promise.all(
            lapTimes.map(lapTime => this.deleteASingleLapTime(lapTime))
        );
    }


    /**
     * This method will return a Promise of LapAssists.
     * It represents assists used by the current user.
     */
    public getLapAssists(): Promise<LapAssists> {
        return new Promise((resolve, reject) => {
            this.getRef("/users/" + this.uid + "/settings/assists")
                .query
                .once("value")
                .then((data: DataSnapshot) => {
                    return resolve(data.val());
                })
                .catch((err) => {
                    return reject(err);
                });
        });
    }

    /**
     * Saves a LapTime object in Firebase DB
     * @param lapAssists Assists used by current user
     */
    public saveLapAssists(lapAssists: LapAssists) {
        return new Promise((resolve, reject) => {
            this.getRef("/users/" + this.uid + "/settings/assists")
                .set(lapAssists)
                .then((ok) => {
                    return resolve(true);
                })
                .catch((err) => {
                    return reject(err);
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
