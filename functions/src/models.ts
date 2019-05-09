export const LAST_SUPPORTED_LAP_TIME_VERSION = 1;

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
    version?: number;
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
    tractionControl: ValidStringPercentages;
    abs: ValidAbsValues;
    stabilityControl: ValidStringPercentages;
    mechanicalDamages: ValidStringPercentages;
    tyresWear: boolean;
    tyresBlankets: boolean;
    fuelConsumption: boolean;
}

export type ValidStringPercentages = "0" | "10" | "20" | "30" | "40" | "50" | "60" | "70" | "80" | "90" | "100";
export enum ValidAbsValues {
    On = "On",
    Factory = "Factory",
    Off = "Off"
}

export function isValidStringPercentage(perc: string): boolean {
    const nPerc = parseInt(perc, 10);
    if (!isNaN(nPerc) && nPerc >= 0 && nPerc <= 100 && nPerc % 10 === 0) {
        return true;
    } else {
        return false;
    }
}

export function isValidAbsValue(value: string): boolean {
    return (value === ValidAbsValues.On || value === ValidAbsValues.Factory || value === ValidAbsValues.Off);
}
