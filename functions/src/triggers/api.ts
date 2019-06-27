import { https } from 'firebase-functions';
import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";

import { lapTimesRouter } from "../api/lapTimes";
import { settingsRouter } from "../api/settings";

try {
    admin.initializeApp();
} catch (err) { }

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));


// local base path: http://localhost:5001/assettocorsatimetracker/us-central1/api/<path>
try {
    app.use(lapTimesRouter);
    app.use(settingsRouter);
} catch (err) {
    console.log("[Error Reporter] -> Try/Catch router: ", err);
}

// Expose Express API as a single Cloud Function:
export const api = https.onRequest(app);
