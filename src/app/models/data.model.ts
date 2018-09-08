export interface LapTime {
    time: number;
    timestamp: number;
    track: Track;
    car: Car;
}

export interface Track {
    name: string;
    length: number;
}

export interface Car {
    name: string;
}
