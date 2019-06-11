import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { AuthService } from './auth.service';

import * as fn from '../models/fnResponses.model';
import { Track, Car, LapTime, LapAssists } from '../../../shared/data.model';


type Headers = HttpHeaders | { [param: string]: string | string[]; };

const MAX_RETRY = 3;

@Injectable()
export class HttpService {

    private baseUrl: string;

    constructor(private http: HttpClient, private authService: AuthService) {
        this.baseUrl = environment.firebase.functionsUrl;
    }

    /**
     * Wrapper for the get method.
     * This function takes a relative path (to the /api/ path).
     * @param path The function path
     * @param headers Headers to use when calling the function
     */
    private async _get<T = any>(path: string, headers?: Headers): Promise<T> {
        const observable = this.http
            .get(`${this.baseUrl}/${path}`, { headers: headers })
            .pipe(retry(MAX_RETRY));
        const response = await observable.toPromise();
        return response as T;
    }

    private async _delete<T = any>(path: string, headers?: Headers): Promise<T> {
        const observable = this.http
            .delete(`${this.baseUrl}/${path}`, { headers: headers })
            .pipe(retry(MAX_RETRY));
        const response = await observable.toPromise();
        return response as T;
    }

    private async _post<T = any>(path: string, headers?: Headers, params?: Object): Promise<T> {
        const observable = this.http
            .post(`${this.baseUrl}/${path}`, params, { headers: headers })
            .pipe(retry(MAX_RETRY));
        const response = await observable.toPromise();
        return response as T;
    }

    /**
     * An helper function to set headers required to call Firebase Functions
     */
    private async setFunctionsHeaders() {
        const token = await this.authService.getToken();

        const headers = new HttpHeaders({
            "Authorization": `Bearer ${token}`
        });

        return headers;
    }

    /**
     * Used to fetch saved LapTimes.
     * If no optional parameter is passed, it would be unfiltered.
     * If a Car is passed, this function would return LapTimes filtered by car
     * If a Track is passed, same as above but with a Track.
     * @param limitTo Maximim number of record to fetch
     * @param params An optional parameter. It could be a Car or a Track
     */
    public async getLapTimes(limitTo: number, params?: { track?: Track; car?: Car }) {
        const headers = await this.setFunctionsHeaders();

        let queryString = "";

        // Check if the optional paramters have been passed
        if (params) {
            // If yes, check if it contains the track attribute
            if (params.track) {
                // In that case build the queryString that will be used to call the API
                queryString = `trackName=${params.track.name}&trackLength=${params.track.length}`;
            } else {
                // Otherwise do the same thing with the car
                queryString = `carName=${params.car.name}`;
            }
        }

        // Add the limitTo parameter
        queryString += `limitTo=${limitTo}`;

        // Send the request and wait for a response
        const response = await this._get<fn.GetLapTimeFunction>(`lapTimes?${queryString}`, headers);

        return Promise.resolve(response.data.lapTimes);
    }


    public async deleteLapTime(lapTime: LapTime) {
        const headers = await this.setFunctionsHeaders();
        const response = await this._delete<fn.DeleteLapTime>(`lapTimes/${lapTime.id}`, headers);

        if (response.success) {
            return Promise.resolve(true);
        } else {
            return Promise.reject(false);
        }
    }

    public async getPreferredLapAssists() {
        const headers = await this.setFunctionsHeaders();
        const response = await this._get<fn.GetLapAssists>(`settings/assists`, headers);

        return Promise.resolve(response.data);
    }

    public async getLapTimeById(id: string) {
        const headers = await this.setFunctionsHeaders();
        const response = await this._get<fn.GetLapTimeById>(`lapTimes/${id}`, headers);

        return Promise.resolve(response.data.lapTime);
    }

    public async savePreferredLapAssists(lapAssists: LapAssists) {
        const headers = await this.setFunctionsHeaders();
        const response = await this._post<fn.PostLapAssists>(`settings/assists`, headers, { assists: lapAssists });

        return Promise.resolve(response.data.lapAssists);
    }

    public async saveNewLapTime(lapTime: LapTime) {
        const headers = await this.setFunctionsHeaders();
        const response = await this._post<fn.PostNewLapTime>(`lapTimes`, headers, lapTime);

        return Promise.resolve(response.data.lapTime);
    }

    public async upgradeAllLapTimes() {
        const headers = await this.setFunctionsHeaders();

        try {
            const response = await this._post<fn.UpgradeLapTimes>(`lapTimes/upgradeAll`, headers);
            return Promise.resolve(response.data.lapTimes);
        } catch (err) {
            // Check if the response was 304. In that case, don't treat it like a real error
            if ((err as HttpErrorResponse).status === 304) {
                return Promise.resolve(null);
            }

            // Otherwise propagate the error
            return Promise.reject(err);
        }
    }

}
