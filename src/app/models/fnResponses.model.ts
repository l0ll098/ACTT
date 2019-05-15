import { LapTime } from './data.model';

export interface GetLapTimeFunction {
    success: boolean;
    data: {
        lapTimes: LapTime[]
    };
}
