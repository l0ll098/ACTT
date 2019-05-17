import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { DataSnapshot } from "@angular/fire/database/interfaces";

import { AuthService } from "./auth.service";
import { LapTime, Track, Car, IsBetterLapTime, LapAssists, Time } from "../models/data.model";
import { HttpService } from './http.service';

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
        private db: AngularFireDatabase,
        private httpService: HttpService) {

        this.uid = this.authService.getCurrentUser().uid;

        this.upgradeAllLapTimes()
            .then((data) => {
                console.log(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    /**
     * Returns the current user's object stored in the DataBase
     * @returns A reference to the user's object
     */
    public getUserRef() {
        return this.db.object("/users/" + this.uid);
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
     * Saves a lapTime
     * @param lapTime The new lapTime
     */
    public saveUserLapTime(lapTime: LapTime) {
        return this.httpService.saveNewLapTime(lapTime);
    }

    public getLapTimes(limitTo: number = 25): Promise<LapTime[]> {
        return this.httpService.getLapTimes(limitTo);
    }

    public getLapTimesByTrack(track: Track, limitTo: number = 25): Promise<LapTime[]> {
        return this.httpService.getLapTimes(limitTo, { track: track });
    }

    public getLapTimesByCar(car: Car, limitTo: number = 25): Promise<LapTime[]> {
        return this.httpService.getLapTimes(limitTo, { car: car });
    }

    /**
     * Returns details of a LapTime given its ID.
     * In case it doesn't exist, the promise will be rejected.
     * @param id Id of the LapTime to return
     */
    public getLapTimeById(id: string): Promise<LapTime> {
        return this.httpService.getLapTimeById(id);
    }

    /**
     * This method will delete a single lapTime.
     * The "deleteLapTimes" method is based on this one.
     * @param lapTime The LapTime that has to be deleted
     */
    private deleteASingleLapTime(lapTime: LapTime): Promise<boolean> {
        return this.httpService.deleteLapTime(lapTime);
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
        return this.httpService.getPreferredLapAssists();
    }

    /**
     * Saves a LapTime object in Firebase DB
     * @param lapAssists Assists used by current user
     */
    public saveLapAssists(lapAssists: LapAssists) {
        return this.httpService.savePreferredLapAssists(lapAssists);
    }

    /**
     * Upgrades all user's LapTimes
     */
    private upgradeAllLapTimes() {
        return this.httpService.upgradeAllLapTimes();
    }

}
