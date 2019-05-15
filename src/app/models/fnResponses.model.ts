import { LapTime } from './data.model';

export interface GetLapTimeFunction {
    success: boolean;
    data: {
        lapTimes: LapTime[]
    };
}

export interface DeleteLapTime {
    success: boolean;
    data: {
        code: number;
        msg: string;
    };
}
