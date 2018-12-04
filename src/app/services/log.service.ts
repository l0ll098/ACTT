import { Injectable } from "@angular/core";

import { environment } from "../../environments/environment";

import { IndexedDBService } from "./indexedDb.service";



const isProd = environment.production || false;
const noop = (): any => undefined;

// TODO: Save in idb a log of all the stuff logged by this service. Those data will be show on a certain path

@Injectable()
export class LoggerService {

    constructor(
        private indexedDBService: IndexedDBService
    ) { }

    get info() {
        // tslint:disable-next-line:no-console
        return console.info.bind(console);
    }

    get log() {
        // tslint:disable-next-line:no-console
        return console.log.bind(console);
    }

    get warn() {
        // tslint:disable-next-line:no-console
        return console.warn.bind(console);
    }

    get error() {
        // tslint:disable-next-line:no-console
        return console.error.bind(console);
    }

    get group() {
        // tslint:disable-next-line:no-console
        return console.group.bind(console);
    }

    get groupEnd() {
        // tslint:disable-next-line:no-console
        return console.groupEnd.bind(console);
    }

}
