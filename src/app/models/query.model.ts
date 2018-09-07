// Objects used by the "Query system"
export interface DataRequest {
    seasonId: number;
    driverId?: string;
    circuitId?: number;
    dataSources?: DataSources;
}

export interface DataSources {
    apiPath: string;
    dbPath: string;
}
