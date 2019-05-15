import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { AuthService } from './auth.service';

import * as fn from '../models/fnResponses.model';
import { Track, Car } from '../models/data.model';


interface KeyVal { [param: string]: string | string[]; }
type Params = HttpParams | KeyVal;
type Headers = HttpHeaders | KeyVal;


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
     * @param params GET parameters that will be used as the query string
     */
    private async _get<T = any>(path: string, headers?: Headers, params?: Params): Promise<T> {
        const observable = this.http
            .get(`${this.baseUrl}/${path}`, { headers: headers, params: params })
            .pipe(retry());
        const response = await observable.toPromise();
        return response as T;
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
        const token = await this.authService.getToken();

        let queryString: string;
        const headers = new HttpHeaders({
            "Authorization": `Bearer ${token}`
        });

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

}
