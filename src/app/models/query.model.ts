// Objects used by the "Query system"
export interface DataRequest {
    dataSources?: DataSources;
}

export interface DataSources {
    cachePath: string;
    dbPath: string;
}
