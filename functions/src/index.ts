import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";

import { HttpStatus } from '../shared/httpStatus';
import { sendErr } from '../shared/helpers';

import { newLapTimeValidators, newLapTime } from './newLapTime';
import { upgradeLapTimeValidators, upgradeLapTime, upgradeAllLapTimes } from './upgradeLapTime';
import { getLapTimesValidators, getLapTime } from './getLapTimes';
import { deleteLapTimeValidators, deleteLapTime } from './deleteLapTime';
import { getDefaultAssists } from './getDefaultAssists';
import { newDefaultAssistsValidators, newDefaultAssists } from './newDefaultAssists';


admin.initializeApp();
const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));


async function validateFirebaseIdToken(req: express.Request, res: express.Response, next: Function) {

    if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
        !(req.cookies && req.cookies.__session)) {
        return sendErr(res, HttpStatus.Unauthorized, { error: "You have to be authenticated" });
    }

    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        // Read the ID Token from the Authorization header.
        idToken = req.headers.authorization.split('Bearer ')[1];
    } else if (req.cookies) {
        // Read the ID Token from cookie.
        idToken = req.cookies.__session;
    } else {
        // No cookie
        return sendErr(res, HttpStatus.Unauthorized, { error: "You have to be authenticated" });
    }

    try {
        const decodedIdToken = await admin.auth().verifyIdToken(idToken);
        // Add the user object to the request so that can be used later on 
        (req as any).user = decodedIdToken;
        next();
        return;
    } catch (error) {
        return sendErr(res, HttpStatus.Unauthorized, { error: "You have to be authenticated" });
    }
}


// local base path: http://localhost:5001/assettocorsatimetracker/us-central1/api/<path>
try {
    // Create an alias, it will be reachable with and without the /new piece
    app.post(["/lapTimes", "/lapTimes/new"], validateFirebaseIdToken, ...newLapTimeValidators, newLapTime);
    app.post("/lapTimes/upgrade", validateFirebaseIdToken, ...upgradeLapTimeValidators, upgradeLapTime);
    app.post("/lapTimes/upgradeAll", validateFirebaseIdToken, upgradeAllLapTimes);
    app.get("/lapTimes", validateFirebaseIdToken, ...getLapTimesValidators, getLapTime);
    app.delete("/lapTimes/:id?", validateFirebaseIdToken, ...deleteLapTimeValidators, deleteLapTime);
    app.get("/settings/assists", validateFirebaseIdToken, getDefaultAssists);
    app.post("/settings/assists", validateFirebaseIdToken, ...newDefaultAssistsValidators, newDefaultAssists);
} catch (err) {
    console.log(err);
}

// Expose Express API as a single Cloud Function:
export const api = functions.https.onRequest(app);
