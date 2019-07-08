import { LapTime, LapAssists, Notification } from '../../../shared/data.model';

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

export interface GetLapAssists {
    success: boolean;
    data: LapAssists;
}

export interface GetLapTimeById {
    success: boolean;
    data: {
        lapTime: LapTime
    };
}

export interface PostLapAssists {
    success: boolean;
    data: {
        lapAssists: LapAssists
    };
}

export interface PostNewLapTime {
    success: boolean;
    data: {
        lapTime: LapTime;
    };
}

export interface UpgradeLapTimes {
    success: boolean;
    data: {
        lapTimes: LapTime[];
    };
}

export interface GetNotifications {
    success: boolean;
    data: {
        notifications: Notification[];
    };
}

export interface MarkNotificationAsRead {
    success: boolean;
    data: {
        done: boolean;
    };
}
