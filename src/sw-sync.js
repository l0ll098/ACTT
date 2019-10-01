//@ts-check
/// <reference lib="webworker" />
/// <reference path="./app/models/types.model.ts" />

importScripts("./ngsw-worker.js");

var token = "";

self.addEventListener("message", (event) => {
    try {
        const data = JSON.parse(event.data);

        if (data.token) {
            token = data.token;
        }
    } catch (err) {

    }
});

self.addEventListener("sync", (event) => {
    if (event.tag === "offlineActionsSync") {
        event.waitUntil(processOfflineActions());
    }
});

/**
 * Fetches stored Actions from the IDB and make those requests another time
 */
function processOfflineActions() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open("ACTT");
        let db;

        req.onerror = (e) => {
            return reject(e);
        }

        req.onsuccess = (e) => {
            // @ts-ignore
            db = e.target.result;

            const objectStore = db.transaction("offlineActions", "readwrite")
                .objectStore("offlineActions");

            // Open a cursor so we can cycle every stored Action
            objectStore.openCursor().onsuccess = (e) => {
                let cursor = e.target.result;
                if (cursor) {

                    // Repeat that request
                    replayAction(cursor.value)
                        .then((response) => {
                            console.log(response);
                        }).catch((err) => {
                            console.log(`${cursor.value.method} ${cursor.value.url} returned an error: `, err);
                        });

                    // Delete it from the IDB
                    objectStore.delete(cursor.primaryKey);

                    // Cycle to the next stored value
                    cursor.continue();
                } else {
                    // Empty IDB, return
                    return resolve(true);
                }
            }
        }
    });
}

/**
 * Makes a request, following what the Action specifies
 * @param {import("./app/models/types.model").OfflineAction} action An Action representing a request that has to be remade  
 */
function replayAction(action) {
    const options = {
        method: action.method
    };

    if (action.method !== "GET" && action.method !== "HEAD") {
        options.body = JSON.stringify(action.body);
    }

    if (action.headers) {
        options.headers = action.headers;

        if (options.headers["Authentication"]) {
            options.headers["Authentication"] = "Bearer " + token;
        }

        // Set JSON encoding
        options.headers["Content-Type"] = "application/json";
    }

    try {
        return fetch(action.url, options);
    } catch (err) {
        return Promise.reject(err);
    }
}
