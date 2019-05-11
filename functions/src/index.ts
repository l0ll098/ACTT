import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";

import { newLapTimeValidators, newLapTime } from './newLapTime';
import { upgradeLapTimeValidators, upgradeLapTime, upgradeAllLapTimes } from './upgradeLapTime';
import { HttpStatus } from '../shared/httpStatus';
import { sendErr } from '../shared/helpers';

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
};


// local base path: http://localhost:5001/assettocorsatimetracker/us-central1/api/<path>
app.post("/lapTimes/new", validateFirebaseIdToken, ...newLapTimeValidators, newLapTime);
app.post("/lapTimes/upgrade", validateFirebaseIdToken, ...upgradeLapTimeValidators, upgradeLapTime);
app.post("/lapTimes/upgradeAll", validateFirebaseIdToken, upgradeAllLapTimes);

// Expose Express API as a single Cloud Function:
exports.api = functions.https.onRequest(app);
