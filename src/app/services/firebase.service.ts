import { Injectable } from "@angular/core";
import * as firebase from "firebase";

import { AuthService } from "./auth.service";

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
            this.getRef(path).once("value", (val) => {
                resolve(val);
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
}
