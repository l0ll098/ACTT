import { Injectable } from "@angular/core";

import { LapTime, Track, Car, LapAssists } from "../models/data.model";
import { HttpService } from './http.service';
import { LoggerService } from "./log.service";


@Injectable()
export class FirebaseService {

    constructor(private httpService: HttpService, private loggerService: LoggerService) {

        this.upgradeAllLapTimes()
            .then((data) => {
                if (data && data.length > 0) {
                    this.loggerService.info(`Upgraded ${data.length} LapTimes`);
                } else {
                    this.loggerService.info("No LapTimes to upgrade");
                }
            })
            .catch((err) => {
                this.loggerService.log("An error occured while upgrading some LapTime.");
                this.loggerService.error(err);
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
