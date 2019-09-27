//@ts-check
/// <reference lib="webworker" />
/// <reference path="./app/models/types.model.ts" />


// Import the Angular CLI generated SW to extend it
importScripts('./ngsw-worker.js');

self.addEventListener("sync", (e) => {
    switch (e.tag) {
        case "offlineActionsSync":
            if (navigator.onLine) {
                e.waitUntil(syncOfflineActions());
            }
            break;
    }
});

function syncOfflineActions() {
    return new Promise(async (resolve, reject) => {
        try {
            /** @type {IDBDatabase} */
            const db = await openIDB("ACTT");
            const objStore = db.transaction("offlineActions", "readwrite").objectStore("offlineActions");

            objStore.openCursor().onsuccess = async (e) => {
                let cursor = e.target.result;
                if (cursor) {
                    const response = await replayAction(cursor.value);
                    console.log(response);

                    deleteAction(objStore, cursor.primaryKey);

                    // Cycle to the next stored value
                    cursor.continue();
                } else {
                    console.log("Empty IDB");
                    // Empty IDB, return
                    return Promise.resolve(true);
                }
            }
        } catch (err) {
            return reject(err);
        }
    });
}

/**
 * Opens the IndexedDB with the passed name
 * @param {string} name Name of the IDB
 */
function openIDB(name) {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(name);
        let db;

        req.onerror = (e) => {
            return reject(e);
        }

        req.onsuccess =  /** @param {*} e */(e) => {
            db = e.target.result;
            return resolve(db);
        }
    });
}

/**
 * Removes an Action identified by the passed id from the passed db 
 * @param {IDBObjectStore} objectStore The ObjectStore reference
 * @param {number} id ID of the resource that has to be deleted
 */
function deleteAction(objectStore, id) {
    return new Promise((resolve, reject) => {
        const req = objectStore.delete(id);

        req.onsuccess = (e) => {
            return resolve(e)
        }

        req.onerror = (e) => {
            return reject(e);
        }
    })
}

/**
 * Try to make a new request following the saved and passed OfflineAction
 * @param {import("./app/models/types.model").OfflineAction} action The saved OfflineAction
 */
async function replayAction(action) {
    const options = {
        method: action.method
    };

    if (action.method !== "GET" && action.method !== "HEAD") {
        options.body = action.body;
    }

    if (action.headers) {
        options.headers = action.headers;
    }

    try {
        const response = await fetch(action.url, options);

        return response;
    } catch (err) {
        return Promise.reject(err);
    }
}
