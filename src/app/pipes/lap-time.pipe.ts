import { PipeTransform, Pipe } from "@angular/core";
import { Time } from "../models/data.model";

@Pipe({
    name: "lapTime",
    pure: true
 })
export class LapTimePipe implements PipeTransform {

    transform(value: any, ...args: any[]) {
        // Check if it's a number
        if (value !== 0 && !Number(value)) {
            // If not, return the value as it is
            return value;
        }

        const time = this.toHumanTime(value);
        let sTime = "";

        if (time.minutes < 10) {
            sTime += "0";
        }
        sTime += time.minutes + ":";

        if (time.seconds < 10) {
            sTime += "0";
        }
        sTime += time.seconds + ":";

        if (time.millisecs < 10) {
            sTime += "00";
        } else {
            if (time.millisecs < 100) {
                sTime += "0";
            }
        }
        sTime += time.millisecs;

        return sTime;
    }

    private toHumanTime(ms: number): Time {
        // Calculate the human time

        const min = Math.floor(ms / 60000);
        ms = ms - (min * 60000);
        const secs = Math.floor(ms / 1000);
        ms = ms - (secs * 1000);

        return {
            millisecs: ms,
            seconds: secs,
            minutes: min
        };
    }

}
