export interface LapTime {
    // minutes:seconds:millisecs
    humanTime?: Time;
    // same time as humanTime but converted to millisecs
    time: Time;
    timestamp: number;
    track: Track;
    car: Car;
    lap: number;
    assists?: LapAssists;
    id?: string;
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

export interface LapAssists {
    autoShifter: boolean;
    autoFriction: boolean;
    autoBlip: boolean;
    idealTrajectory: boolean;
    tractionControl: "0" | "10" | "20" | "30" | "40" | "50" | "60" | "70" | "80" | "90" | "100";
    abs: "On" | "Factory" | "Off";
    stabilityControl: "0" | "10" | "20" | "30" | "40" | "50" | "60" | "70" | "80" | "90" | "100";
    mechanicalDamages: "0" | "10" | "20" | "30" | "40" | "50" | "60" | "70" | "80" | "90" | "100";
    tyresWear: boolean;
    tyresBlankets: boolean;
    fuelConsumption: boolean;
}
