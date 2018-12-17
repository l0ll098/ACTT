import { Component, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MatDialog, } from "@angular/material";

import { Track, Car, LapTime, Time } from "../../models/data.model";
import { tracks } from "../../models/tracks";
import { cars } from "../../models/cars";

import { FirebaseService } from "../../services/firebase.service";
import { LoggerService } from "../../services/log.service";

import { DialogComponent } from "../dialog/dialog.component";


@Component({
    selector: 'app-new-time',
    templateUrl: './new-time.component.html',
    styleUrls: ['./new-time.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewTimeComponent implements AfterViewInit {

    private NUMBER_OF_TRACKS_TO_SHOW_INITIALLY = 9;
    private NUMBER_OF_CARS_TO_SHOW_INITIALLY = 9;

    public FormControls = {
        track: new FormControl(),
        car: new FormControl(),
        lapTime: new FormControl(null, [Validators.required]),
        lapNumber: new FormControl(null, [Validators.min(1), Validators.max(999)])
    };

    public newLapTimeFG = new FormGroup({
        track: this.FormControls.track,
        car: this.FormControls.car,
        lapTime: this.FormControls.lapTime,
        lapNumber: this.FormControls.lapNumber
    });

    public tracks: Track[] = tracks;
    public filteredTracks = this.tracks.slice(0, this.NUMBER_OF_TRACKS_TO_SHOW_INITIALLY);
    public cars: Car[] = cars;
    public filteredCars = this.cars.slice(0, this.NUMBER_OF_CARS_TO_SHOW_INITIALLY);
    public disableSaveButton = false;

    constructor(
        private firebaseService: FirebaseService,
        private loggerService: LoggerService,
        private router: Router,
        private changeDetectorRef: ChangeDetectorRef,
        private dialog: MatDialog) { }

    ngAfterViewInit(): void {
        this.FormControls.track.valueChanges.subscribe(track => {
            this.filterTrack(track);
        });

        this.FormControls.car.valueChanges.subscribe(car => {
            this.filterCar(car);
        });
    }

    private filterTrack(track: Track) {
        let toFilter = "";
        // If user has already selected a result this if should be true
        if (track) {
            if (track instanceof Object) {
                // If it is of type Object pick it's name
                toFilter = track.name;
            } else {
                // Else it was a string and so just use it
                toFilter = track;
            }
        } else {
            // Otherwise use an empty string. This will return some data
            toFilter = "";
        }

        if (toFilter === "") {
            this.filteredTracks = this.tracks.slice(0, this.NUMBER_OF_TRACKS_TO_SHOW_INITIALLY);
        } else {
            // The filtered array will contain only the elements that includes the search term
            this.filteredTracks = this.tracks.filter(_track =>
                _track.name.toLocaleLowerCase().includes(toFilter.toLocaleLowerCase())
            );
        }
    }

    private filterCar(car: Car) {
        let toFilter = "";
        // If user has already selected a result this if should be true
        if (car) {
            if (car instanceof Object) {
                // If it is of type Object pick it's name
                toFilter = car.name;
            } else {
                // Else it was a string and so just use it
                toFilter = car;
            }
        } else {
            // Otherwise use an empty string. This will return some data
            toFilter = "";
        }

        if (toFilter === "") {
            this.filteredCars = this.cars.slice(0, this.NUMBER_OF_CARS_TO_SHOW_INITIALLY);
        } else {
            // The filtered array will contain only the elements that includes the search term
            this.filteredCars = this.cars.filter(_car =>
                _car.name.toLocaleLowerCase().includes(toFilter.toLocaleLowerCase())
            );
        }
    }

	/**
	* This method is used by Angular when it has to show the result
	* @param trackOrCar The result to show in the input
	*/
    showResult(trackOrCar: Track | Car) {
        if (trackOrCar) {
            return trackOrCar.name;
        }
    }

    public save() {
        this.disableSaveButton = true;

        const humanTime: Time = this.FormControls.lapTime.value;

        const lapTime: LapTime = {
            car: this.FormControls.car.value,
            lap: this.FormControls.lapNumber.value,
            timestamp: Date.now(),
            track: this.FormControls.track.value,
            time: {
                millisecs: 0
            }
        };

        // Update time
        lapTime.time.millisecs = this.convertTimeToMS(humanTime);

        this.firebaseService.saveUserLapTime(lapTime)
            .then((data) => {
                this.loggerService.log(data);

                if (data.isBetter) {
                    this.router.navigate(["/times"]);
                } else {
                    this.dialog.open(DialogComponent, {
                        data: {
                            title: "Error",
                            message: "You have already saved a better lap time using this car on this track.",
                            doActionBtn: {
                                text: "Ok"
                            }
                        }
                    });

                    this.disableSaveButton = false;
                    // Force view update
                    this.changeDetectorRef.markForCheck();
                }
            })
            .catch(err => {
                this.loggerService.log(err);

                this.dialog.open(DialogComponent, {
                    data: {
                        title: "Error",
                        message: "An error occured while saving data. Please retry",
                        doActionBtn: {
                            text: "Ok"
                        }
                    }
                });
            });
    }


    private convertTimeToMS(time: Time): number {
        return ((time.minutes * 60) + time.seconds) * 1000 + time.millisecs;
    }

    trackByTracksFn(index, item) {
        return index;
    }

    trackByCarsFn(index, item) {
        return index;
    }
}
