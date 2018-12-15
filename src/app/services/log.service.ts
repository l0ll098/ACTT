import { Injectable } from "@angular/core";

import { environment } from "../../environments/environment";

import { IndexedDBService } from "./indexedDb.service";

// Logs will be written to IDB if the specific variable is set to true of if the app is in production.
const enableIDBLog = environment.enableIDBLog || environment.production;


@Injectable()
export class LoggerService {

    constructor(
        private indexedDBService: IndexedDBService
    ) { }

    get info() {
        if (!enableIDBLog) {
            // tslint:disable-next-line:no-console
            return console.info.bind(console);
        } else {
            return proxyConsole("info", this.indexedDBService);
        }
    }

    get log() {
        if (!enableIDBLog) {
            return console.log.bind(console);
        } else {
            return proxyConsole("log", this.indexedDBService);
        }
    }

    get warn() {
        if (!enableIDBLog) {
            return console.warn.bind(console);
        } else {
            return proxyConsole("warn", this.indexedDBService);
        }
    }

    get error() {
        if (!enableIDBLog) {
            return console.error.bind(console);
        } else {
            return proxyConsole("error", this.indexedDBService);
        }
    }

    get group() {
        if (!enableIDBLog) {
            return console.group.bind(console);
        } else {
            return proxyConsole("group", this.indexedDBService);
        }
    }

    get groupEnd() {
        if (!enableIDBLog) {
            return console.groupEnd.bind(console);
        } else {
            return proxyConsole("groupEnd", this.indexedDBService);
        }
    }

}


function proxyConsole(method: string, indexedDBService: IndexedDBService) {
    // Keep a pointer to the original console
    const original = console[method];
    // Overwrite it
    console[method] = (...args) => {
        indexedDBService.writeLogs(JSON.stringify(args));

        original.apply(this, args);
    };

    // Call the console method using the proxied console
    const log = console[method].bind(console) || Function.prototype.bind.call(console[method], console);

    // Restore the original console
    console[method] = original;

    // Return the proxied console to the calling method
    return log;
}
