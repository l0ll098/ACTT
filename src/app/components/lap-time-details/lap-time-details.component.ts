import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

import { MatDialog } from '@angular/material';

import { FirebaseService } from '../../services/firebase.service';
import { LoggerService } from '../../services/log.service';
import { LapTime } from '../../models/data.model';
import { DialogComponent } from '../shared/dialog/dialog.component';


@Component({
    selector: "app-lap-time-details",
    styleUrls: ["lap-time-details.component.css"],
    templateUrl: "lap-time-details.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LapTimeDetailsComponent implements OnInit {

    public showLoadingSpinner = true;

    private lapTimeId: string;
    public lapTime: LapTime;

    public FormControls = {
        trackName: new FormControl(),
        trackLength: new FormControl(),
        car: new FormControl(),
        lapTime: new FormControl({ value: null, readonly: true }),
        lapNumber: new FormControl(),
        assists: new FormControl()
    };

    public lapTimeDetailsFG = new FormGroup({
        trackName: this.FormControls.trackName,
        trackLength: this.FormControls.trackLength,
        car: this.FormControls.car,
        lapTime: this.FormControls.lapTime,
        lapNumber: this.FormControls.lapNumber,
        assists: this.FormControls.assists
    });

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private changeDetector: ChangeDetectorRef,
        private firebaseService: FirebaseService,
        private loggerService: LoggerService,
        private dialog: MatDialog) { }

    ngOnInit() {
        this.lapTimeId = this.route.snapshot.paramMap.get("id");

        this.firebaseService.getLapTimeById(this.lapTimeId)
            .then((lapTime) => {
                this.lapTime = lapTime;

                this.setFormGroupValue();

                this.hideLoadingSpinner();
            })
            .catch((err) => {
                this.hideLoadingSpinner();

                if (err.notFound) {
                    this.router.navigate(["/notFound"]);
                } else {
                    this.loggerService.group("Fetching LapTime details");
                    this.loggerService.log("LapTime id: ", this.lapTimeId);
                    this.loggerService.error(err);
                    this.loggerService.groupEnd();

                    this.dialog.open(DialogComponent, {
                        data: {
                            title: "Error",
                            message: "An error occurred. Please try again.",
                            doActionBtn: {
                                text: "Ok"
                            }
                        }
                    });
                }
            });
    }

    private setFormGroupValue() {
        this.FormControls.trackName.setValue(this.lapTime.track.name);
        this.FormControls.trackLength.setValue(this.lapTime.track.length);
        this.FormControls.car.setValue(this.lapTime.car.name);
        this.FormControls.lapTime.setValue(this.lapTime.humanTime);
        this.FormControls.lapNumber.setValue(this.lapTime.lap);
        this.FormControls.assists.setValue(this.lapTime.assists);
    }

    private hideLoadingSpinner() {
        this.showLoadingSpinner = false;
        this.changeDetector.markForCheck();
    }
}
