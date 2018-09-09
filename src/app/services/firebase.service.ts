import { Injectable } from "@angular/core";
import * as firebase from "firebase";

import { AuthService } from "./auth.service";
import { LapTime, Time } from "../models/data.model";

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

    constructor(private authService: AuthService) { }

    /**
     * Returns a reference to the path passed as a parameter
     * @param {string} path The path where data are stored
     * @returns {firebase.database.Reference} A reference to the wanted object
     */
    public getRef(path?: string): firebase.database.Reference {
        return firebase.database().ref(path);
    }

    /**
     * Returns the ref to a certain subnode of the passed path
     * @param {string} refPath The path of a certain reference
     * @param {string} path The path of the wanted node
     * @returns {firebase.database.Reference} A reference to the wanted object
     */
    public getChild(refPath: string, path: string): firebase.database.Reference {
        return firebase.database().ref(refPath).child(path);
    }

    /**
     * Returns the reference to the current user node in the Firebase Realtime Database
     * @returns {firebase.database.Reference}
     * @returns {firebase.database.Reference} A reference to the wanted object
     */
    public getUserRef(): firebase.database.Reference {
        const uid = this.authService.getCurrentUser().uid;
        return this.getRef("/users/" + uid);
    }

    /**
     * This method will return the data stored in the passed path
     * @param {string} dataRequest The path where the wanted data are stored
     * @returns {Promise<firebase.database.DataSnapshot>} Returns a promise
     */
    public getData(path: string): Promise<firebase.database.DataSnapshot> {
        return new Promise((resolve, reject) => {
            this.getRef(path)
                .once("value", (val) => {
                    return resolve(val);
                }, (err) => {
                    return reject(err);
                });
        });
    }

    /**
     * Inserts the objected passed as first parameter, unde
     * @param {Object} obj The object to store
     * @param {string} path The path where it has to be stored
     * @returns {Promise<any>} A promise to check if this method has finished its job
     */
    public insertData(obj: Object, path: string): Promise<any> {
        return firebase.database().ref(path).set(obj);
    }

    public pushData(obj: Object, path: string): Promise<any> {
        return new Promise((resolve, reject) => {
            firebase.database().ref(path).push(obj).then(data => {
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
        return this.getUserRef().child(path).update(newValue);
    }

    /**
     * This will initialize the current user ref ONLY if it doesn't already contains some data.
     * @see {userRefInitializer} This object will be used as a template to initialize the referenced object.
     * @returns {Promise<any>} A promise to check if this method has finished its job
     */
    public initializeCurrentUserRef(): Promise<firebase.database.DataSnapshot> {
        // Before inserting stuff into the db, check if there is already an entry
        return this.getUserRef().once("value", (snapshot) => {
            // If not, insert the data
            if (!snapshot.hasChildren()) {
                this.getUserRef().update(userRefInitializer);
            }
        });
    }

    /**
     * Saves a lapTime (only if it's a record).
     * Old records are kept.
     * @param lapTime The new lapTime
     */
    public saveUserLapTime(lapTime: LapTime): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getUserRef().once("value", (snapshot) => {
                this.isABetterLapTime(lapTime).then(isBetter => {

                    if (isBetter) {
                        this.pushData(lapTime, "users/" + snapshot.key + "/lapTimes").then((data) => {
                            return resolve(data);
                        }).catch(err => {
                            return reject(err);
                        });
                    } else {
                        return reject({ isABetterLapTime: false });
                    }

                });
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
    public isABetterLapTime(lapTime: LapTime): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.getUserRef()
                .child("lapTimes")
                .orderByChild("car/name")
                .equalTo(lapTime.car.name)
                .once("value", (data_car) => {
                    // Check if the data filtered by car name has some children
                    if (!data_car.hasChildren()) {
                        // If not, the lapTime was set with a car that has never been used before,
                        // it's a record
                        return resolve(true);
                    } else {
                        data_car.ref
                            .orderByChild("track/name")
                            .equalTo(lapTime.track.name)
                            .once("value", (data_track) => {
                                // Check if the data filtered by track name has some children
                                if (!data_track.hasChildren()) {
                                    // If not, the lapTime was set on a track where user has never driven before
                                    // it's a record
                                    return resolve(true);
                                } else {
                                    data_car.ref
                                        .orderByChild("track/length")
                                        .equalTo(lapTime.track.length)
                                        .once("value", (data_length) => {
                                            // Check also the length.
                                            // Required as the drag tracks have the same name but different lengths
                                            // (hence times and records)
                                            if (!data_length.hasChildren()) {
                                                return resolve(true);
                                            } else {
                                                data_length.ref
                                                    .orderByChild("time/millisecs")
                                                    .endAt(lapTime.time.millisecs)
                                                    .once("value", (data_ms) => {
                                                        // Check based on the time scored, converted to milliseconds
                                                        if (!data_ms.hasChildren()) {
                                                            // If it hasn't children, it's a new record
                                                            return resolve(true);
                                                        } else {
                                                            data_ms.ref
                                                                .orderByChild("lap")
                                                                .endAt(lapTime.lap)
                                                                .once("value", (data_lap) => {
                                                                    // Otherwise check the lap
                                                                    if (!data_lap.hasChildren()) {
                                                                        // If the new lap used as filter doesn't return
                                                                        // any data, it's a new records
                                                                        // (even when someone scores the same time
                                                                        // but a some lap before, it's a new record)
                                                                        return resolve(true);
                                                                    } else {
                                                                        return resolve(false);
                                                                    }
                                                                });
                                                        }
                                                    });
                                            }
                                        });
                                }
                            });
                    }
                });
        });
    }

}
