import * as admin from "firebase-admin";

import { LapTime, LapAssists, LAST_SUPPORTED_LAP_TIME_VERSION, Time, Track, Car, Notification, NotificationSource } from "../../shared/data.model";
import { HttpStatus } from "./httpStatus";

// Create an alias for the admin.database.DataSnapshot type 
type DataSnapshot = admin.database.DataSnapshot;

export abstract class FirebaseService {

    /**
     * Upgrades a LapTime from a certain version (data schema) to the latest one.
     * 
     * In case the @param lapTime object is not defined, this function will reject the promise.
     * If data is already updated, the promise will be rejected.
     * 
     * Current data version is determined checking the "version" property in the @param lapTime object.
     * If it's not defined, it will be considered as 1.
     * In case the  @param assists is not defined, it will be assumed that user used his defualt assists.
     * @param uid user id
     * @param lapTime LapTime object to upgrade
     * @param lapTimeId LapTimeId
     * @param assists (Optional). Assists used by user
     */
    public static async upgradeData(uid: string, lapTime: LapTime, lapTimeId: string, assists?: LapAssists) {
        if (!lapTime) {
            return Promise.reject({ done: false, error: "LapTime not found", status: HttpStatus.NotFound });
        }

        // Get version. If lapTime doesn't have it, assume 1
        const version = lapTime.version ? lapTime.version : 1;

        // Get defualt assists
        if (!assists) {
            // tslint:disable-next-line:no-parameter-reassignment
            assists = (await admin.database()
                .ref("users/" + uid + "/settings/assists")
                .once("value")).val();
        }

        if (version > LAST_SUPPORTED_LAP_TIME_VERSION) {
            // Data are already up to date
            return Promise.reject({ done: false, error: "Data is already updated", status: HttpStatus.NotModified });
        }

        // Do something based on the version
        switch (version) {
            case 1:
                // Modify the lapTime object to add assists and set data version
                lapTime.assists = assists;
                lapTime.version = 1;
            // Intentional fall-through
            // break;
            case 2:
            // 
        }

        // Update saved value with the new one
        await admin.database()
            .ref("users/" + uid + "/lapTimes/" + lapTimeId + "/")
            .update(lapTime);

        // Return the new lapTime
        return Promise.resolve({ done: true, lapTime: lapTime });
    }

    public static async getLapTimes(uid: string, limitTo = 25) {
        try {
            const data = await admin.database()
                .ref(`/users/${uid}/lapTimes`)
                .limitToLast(limitTo)
                .once("value");

            return this._formatMultipleLapTimeQueryResults(data);
        } catch (err) {
            throw err;
        }
    }

    public static async getLapTimesByTrack(uid: string, track: Track, limitTo = 25) {
        try {
            // Firstly filter data by track name
            const snap = await admin.database()
                .ref(`/users/${uid}/lapTimes`)
                .orderByChild("track/name")
                .equalTo(track.name)
                .once("value");

            // Then filter the received data by track length
            // ! Note: Firebase doesn't allow multiple orderByChild() on the same object
            // ! to workaround, get some data (the least amount possible) and filter it
            // ! using the second criteria. The remaining data is what you want.
            // .limitToLast() is used here 'cause otherwise it could cut too much data
            // and this second query wouldn't find anything (incorrectly)
            const data = await snap.ref
                .orderByChild("track/length")
                .equalTo(track.length)
                .limitToLast(limitTo)
                .once("value");

            // Finally, format data and return them
            return this._formatMultipleLapTimeQueryResults(data);
        } catch (err) {
            throw err;
        }
    }

    public static async getLapTimesByCar(uid: string, car: Car, limitTo = 25) {
        try {
            // Firstly filter data by track name
            const snap = await admin.database()
                .ref(`/users/${uid}/lapTimes`)
                .orderByChild("car/name")
                .equalTo(car.name)
                .limitToLast(limitTo)
                .once("value");

            // Finally, format data and return them
            return this._formatMultipleLapTimeQueryResults(snap);
        } catch (err) {
            throw err;
        }
    }

    /**
     * Returns a LapTime given its id
     * @param uid User ID
     * @param lapTimeId LapTime id
     */
    public static async getLapTimeById(uid: string, lapTimeId: string): Promise<LapTime> {
        try {
            const snap = await admin.database()
                .ref(`/users/${uid}/lapTimes/${lapTimeId}`)
                .once("value");

            if (snap.hasChildren()) {
                return this._formatSingleLapTimeQueryResult(snap) as LapTime;
            } else {
                return Promise.reject({ done: false, error: "LapTime not found", status: HttpStatus.NotFound });
            }
        } catch (err) {
            throw err;
        }
    }

    public static async getLapTimesByVersion(uid: string, version: number): Promise<LapTime[]> {
        try {
            const snap = await admin.database()
                .ref(`/users/${uid}/lapTimes`)
                .orderByChild("version")
                .endAt(version)
                .once("value");

            return this._formatMultipleLapTimeQueryResults(snap) as LapTime[];
        } catch (err) {
            throw err;
        }
    }

    /**
     * Returns a list of LapTimes given their IDs
     * @param uid User Id
     * @param lapTimeIds The array of LapTime IDs
     */
    public static async getLapTimesByIds(uid: string, lapTimeIds: string[]) {
        return Promise.all(lapTimeIds.map((lapTimeId: string) => this.getLapTimeById(uid, lapTimeId)));
    }

    /**
    * This method will delete a single lapTime.
    * The "deleteLapTimes" method is based on this one.
    * @param uid User ID
    * @param lapTimeId The id of the LapTime to delete
    */
    public static async deleteASingleLapTime(uid: string, lapTimeId: string): Promise<boolean> {
        try {
            await admin.database()
                .ref(`/users/${uid}/lapTimes/${lapTimeId}/`)
                .remove();

            return Promise.resolve(true);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    /**
     * This method will delete the array of LapTime(s).
     * @param uid User ID
     * @param lapTimeIds The array of LapTimes IDs that has to be deleted.
     */
    public static deleteLapTimes(uid: string, lapTimeIds: string[]) {
        return Promise.all(
            lapTimeIds.map(lapTimeId => FirebaseService.deleteASingleLapTime(uid, lapTimeId))
        );
    }

    /**
     * Returns the defualt assists for the current user
     * @param uid User ID
     */
    public static async getDefaultLapAssists(uid: string): Promise<LapAssists> {
        try {
            const snap = await admin.database()
                .ref(`/users/${uid}/settings/assists`)
                .once("value");

            return Promise.resolve(snap.val());
        } catch (err) {
            return Promise.reject(err);
        }
    }

    /**
     * Sets default assists for the current user
     * @param uid User ID
     * @param assists An LapAssists object
     */
    public static async saveDefaultLapAssists(uid: string, assists: LapAssists) {
        try {
            await admin.database()
                .ref(`/users/${uid}/settings/assists`)
                .set(assists);
            return Promise.resolve(true);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    /**
     * Saves a new LapTime for the current user
     * @param uid User ID
     * @param assists An LapTime object
     */
    public static async saveLapTime(uid: string, lapTime: LapTime) {
        try {
            const snap = await admin.database()
                .ref(`/users/${uid}/lapTimes`)
                .push(lapTime);
            return Promise.resolve(snap);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    /**
     * Changes the property "alreadyRead" of a user notification given its id
     * @param uid User ID
     * @param notificationId ID of the notification to update 
     */
    public static async markNotificationAsRead(uid: string, notificationId: string): Promise<boolean> {
        try {
            const path = `/users/${uid}/notifications/${notificationId}/`;

            // Get the saved notification
            const snap = await admin.database()
                .ref(path)
                .once("value");

            const notification: Notification = snap.val() || null;
            // Check if it was present
            if (notification) {
                // If it has been found but it's already read, reject
                if (notification.alreadyRead) {
                    return Promise.reject({ done: false, error: "Already read", status: HttpStatus.NotModified });
                }

                // Otherwise set the alreadyRead property to true 
                notification.alreadyRead = true;

                // And save the new value 
                await admin.database()
                    .ref(path)
                    .set(notification);
                return Promise.resolve(true);
            } else {
                // If the notification was not found, reject
                return Promise.reject({ done: false, error: "Notification not found", status: HttpStatus.NotFound });
            }

        } catch (err) {
            return Promise.reject(err);
        }
    }

    /**
     * Returns only notifications of the current user (private)
     * @param uid User ID
     */
    public static async getUserSpecificNotifications(uid: string) {
        try {
            const notifications = await this._getNotifications(`/users/${uid}/notifications`, "user");
            return Promise.resolve(notifications);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    /**
     * Returns only public notifications
     * @description Those notifications are the one that are shared between users, such as changelogs
     */
    public static async getGeneralNotifications() {
        try {
            const notifications = await this._getNotifications(`/notifications`, "general");
            return Promise.resolve(notifications);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    /**
     * Returns a list of notifications from db given its path
     * @param dbPath Search path
     */
    private static async _getNotifications(dbPath: string, source: NotificationSource): Promise<Notification[]> {
        try {
            let snap;

            if (source !== "user") {
                snap = await admin.database()
                    .ref(`${dbPath}`)
                    .once("value");
            } else {
                snap = await admin.database()
                    .ref(`${dbPath}`)
                    .orderByChild("alreadyRead")
                    .equalTo(false)
                    .once("value");
            }

            return Promise.resolve(this._formatNotificationsQueryResult(snap, source));
        } catch (err) {
            return Promise.reject(err);
        }
    }

    /**
     * Transforms the notifications query result into an array
     * @param rawData DataSnapshot returned from Firebase DB
     */
    private static _formatNotificationsQueryResult(rawData: DataSnapshot, source: NotificationSource): Notification[] {
        const data = rawData.val();
        if (!data) {
            return [];
        }

        // Convert it to an array and format data
        const dataArray: Notification[] = Object.keys(data).map((key) => {
            const notification: Notification = rawData.child(key).val();

            // Add calculable fields
            notification.id = key;
            notification.source = source;

            return notification;
        });

        return dataArray;
    }

    /**
     * Formats a single LapTime data
     * @param rawData DataSnapshot returned from Firebase DB
     */
    private static _formatSingleLapTimeQueryResult(rawData: DataSnapshot) {
        const lapTime: LapTime = rawData.val();
        if (!lapTime) {
            return null;
        }

        lapTime.id = rawData.key as string;
        lapTime.humanTime = this._msToHumanTime(lapTime.time.millisecs);

        return lapTime;
    }

    /**
     * Formats multiple LapTime data.
     * @param rawData DataSnapshot returned from Firebase DB
     */
    private static _formatMultipleLapTimeQueryResults(rawData: DataSnapshot) {
        const data = rawData.val();
        if (!data) {
            return [];
        }

        // Convert it to an array and format data
        const dataArray: LapTime[] = Object.keys(data).map((key) => {
            return this._formatSingleLapTimeQueryResult(rawData.child(key)) as LapTime;
        });

        // Sort the data
        const sorted = dataArray.sort((a: LapTime, b: LapTime) => {
            return a.time.millisecs - b.time.millisecs;
        });

        return sorted;
    }

    /**
     * Converts milliseconds in "human time" (minutes:seconds:milliseconds)
     * @param ms LapTime time in milliseconds (lapTime.time.millisecs)
     */
    private static _msToHumanTime(_ms: number): Time {
        const min = Math.floor(_ms / 60000);
        let ms = _ms - (min * 60000);
        const secs = Math.floor(ms / 1000);
        ms = ms - (secs * 1000);
        return {
            millisecs: ms,
            seconds: secs,
            minutes: min
        };
    }
}