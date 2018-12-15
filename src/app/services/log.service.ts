import { Injectable } from "@angular/core";

import { environment } from "../../environments/environment";

import { IndexedDBService } from "./indexedDb.service";


const isProd = true;//environment.production || false;


@Injectable()
export class LoggerService {

    constructor(
        private indexedDBService: IndexedDBService
    ) { }

    get info() {
        if (!isProd) {
            // tslint:disable-next-line:no-console
            return console.info.bind(console);
        } else {
            return proxyConsole("info", this.indexedDBService);
        }
    }

    get log() {
        if (!isProd) {
            return console.log.bind(console);
        } else {
            return proxyConsole("log", this.indexedDBService);
        }
    }

    get warn() {
        if (!isProd) {
            return console.warn.bind(console);
        } else {
            return proxyConsole("warn", this.indexedDBService);
        }
    }

    get error() {
        if (!isProd) {
            return console.error.bind(console);
        } else {
            return proxyConsole("error", this.indexedDBService);
        }
    }

    get group() {
        if (!isProd) {
            return console.group.bind(console);
        } else {
            return proxyConsole("group", this.indexedDBService);
        }
    }

    get groupEnd() {
        if (!isProd) {
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
