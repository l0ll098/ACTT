import { Race, QualifyingResult, Results, Circuit, Constructor, Driver, FastestLap, Time, RaceResult } from "./data.model";

// Qualifying
export interface ApiQualifyingResults {
    RaceTable: {
        round: string,
        season: string,
        Races: [
            {
                season: string;
                round: string;
                url: string;
                raceName: string;
                Circuit: Circuit;
                date: string;
                time: string;
                QualifyingResults: [
                    {
                        Q1: string;
                        Q2?: string;
                        Q3?: string;
                        position: string;
                        number: string;
                        Driver: Driver;
                        Constructor: Constructor;
                    }
                ]
            }
        ]
    };
}

export interface FirebaseQualifyingResults {
    season: string;
    circuit: string;
    results: {
        circuit: string,
        results: {
            [driverId: string]: QualifyingResult;
        }
    };
}

export interface QualifyingResults extends FirebaseQualifyingResults { }


export interface ApiRaceResults {
    RaceTable: {
        round: string,
        season: string,
        Races: [
            {
                season: string;
                round: string;
                url: string;
                raceName: string;
                Circuit: Circuit;
                date: string;
                time: string;
                Results: [
                    {
                        position: string;
                        number: string;
                        points: string;
                        grid: string;
                        laps: string;
                        status: string;
                        Driver: Driver;
                        Constructor: Constructor;
                        Time: Time;
                        FastestLap: FastestLap;
                    }
                ]
            }
        ]
    };
}

export interface FirebaseRaceResults {
    season: string;
    circuit: string;
    results: {
        circuit: string,
        results: {
            [driverId: string]: RaceResult;
        }
    };
}
export interface RaceResults extends FirebaseRaceResults { }
