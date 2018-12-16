export interface LapTime {
    // minutes:seconds:millisecs
    humanTime?: Time;
    // same time as humanTime but converted to millisecs
    time: Time;
    timestamp: number;
    track: Track;
    car: Car;
    lap: number;
}

export interface Track {
    name: string;
    length: number;
}

export interface Car {
    name: string;
}

export interface Time {
    minutes?: number;
    seconds?: number;
    millisecs: number;
}


export interface IsBetterLapTime {
    isBetter: boolean;
    reason: "Better time" | "Better LapNumber" | "First time saved" | "Worse Time" | "Worse LapNumber";
}

export interface Log {
    id?: number;
    timestamp?: number;
    log: string | number;
}
