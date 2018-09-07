export interface QualifyingResult extends Results {
    Q1: string;
    Q2?: string;
    Q3?: string;
    position: string;
}

export interface RaceResult extends Results {
    race: RaceDetails;
}

export interface Results {
    driverId: string;
    constructorId: string;
}

export interface RaceDetails {
    number: string;
    position: string;
    points: string;
    grid: string;
    laps: string;
    status: string;
    Time?: Time;
    FastestLap?: FastestLap;
}

export interface Race {
    season: string;
    round: string;
    url: string;
    raceName: string;
    Circuit: Circuit;
    date: string;
    time: string;
    QualifyingResults?: QualifyingResult[];
    Results?: RaceDetails[];
}


export interface Driver {
    driverId: string;
    permanentNumber: string;
    code: string;
    url: string;
    givenName: string;
    familyName: string;
    dateOfBirth: string;
    nationality: string;
}

export interface Constructor {
    constructorId: string;
    url: string;
    name: string;
    nationality: string;
}

export interface Circuit {
    circuitId: string;
    circuitName: string;
    url: string;
    Location: Location;
}

export interface Location {
    country: string;
    lat: string;
    locality: string;
    long: string;
}

export interface Time {
    millis?: string;
    time: string;
}

export interface FastestLap {
    rank: string;
    lap: string;
    time: Time;
    averageSpeed: AverageSpeed;
}

export interface AverageSpeed {
    units: string;
    speed: string;
}
