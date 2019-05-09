import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";

import { newLapTimeValidators, newLapTime } from './newLapTime';
import { upgradeLapTimeValidators, upgradeLapTime } from './upgradeLapTime';

admin.initializeApp();
const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));


async function validateFirebaseIdToken(req: express.Request, res: express.Response, next: Function) {

    if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
        !(req.cookies && req.cookies.__session)) {
        res.status(403).send('Unauthorized');
        return;
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
        res.status(403).send('Unauthorized');
        return;
    }

    try {
        const decodedIdToken = await admin.auth().verifyIdToken(idToken);
        // Add the user object to the request so that can be used later on 
        (req as any).user = decodedIdToken;
        next();
        return;
    } catch (error) {
        res.status(403).send('Unauthorized');
        return;
    }
};



// local base path: http://localhost:5001/assettocorsatimetracker/us-central1/api/<path>
app.post('/lapTimes/new', validateFirebaseIdToken, ...newLapTimeValidators, newLapTime);
app.post("/lapTimes/upgrade", validateFirebaseIdToken, ...upgradeLapTimeValidators, upgradeLapTime);

// Expose Express API as a single Cloud Function:
exports.api = functions.https.onRequest(app);
