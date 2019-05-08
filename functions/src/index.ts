import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";
import { check, validationResult } from "express-validator/check";

import { LapTime, isValidStringPercentage, LapAssists, isValidAbsValue } from './models';

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

const validators = [
    check("lap").isInt(),
    check("car.name").isString(),
    check("time.millisecs").isInt(),
    check("track.name").isString(),
    check("track.length").isInt(),
    check("assists").custom((assists: LapAssists) => {

        // If the assists object is undefined, skip the rest and consider the passed data as correct 
        if (assists === undefined || assists === null) {
            return true;
        }

        // If the object is empty, consider it as correct (defualt assists will be used)
        if (Object.keys(assists).length === 0) {
            return true;
        }

        // Validate each property.
        // If ALL of them are correct, proceed
        const isValid = (
            typeof assists.abs === "string" &&
            typeof assists.autoBlip === "boolean" &&
            typeof assists.autoFriction === "boolean" &&
            typeof assists.autoShifter === "boolean" &&
            typeof assists.fuelConsumption === "boolean" &&
            typeof assists.idealTrajectory === "boolean" &&
            typeof assists.mechanicalDamages === "string" &&
            typeof assists.stabilityControl === "string" &&
            typeof assists.tractionControl === "string" &&
            typeof assists.tyresBlankets === "boolean" &&
            typeof assists.tyresWear === "boolean" && 
            isValidStringPercentage(assists.tractionControl) && 
            isValidStringPercentage(assists.stabilityControl) &&
            isValidStringPercentage(assists.mechanicalDamages) && 
            isValidAbsValue(assists.abs)
        );

        // If all the properties of the assists object are correct, return
        if (isValid) {
            return true;
        } else {
            // Otherwise throw an error. Validation will fail and data won't be saved
            throw new Error("Invalid assists object");
        }
    })
];

// path: http://localhost:5001/assettocorsatimetracker/us-central1/api/lapTimes/new
app.post('/lapTimes/new', validateFirebaseIdToken, ...validators, async (req: express.Request, res: express.Response) => {
    const lapTime: LapTime = {
        lap: req.body.lap,
        car: {
            name: req.body.car.name
        },
        time: {
            millisecs: req.body.time.millisecs
        },
        timestamp: new Date().getTime(),
        track: {
            name: req.body.track.name,
            length: req.body.track.length
        },
        assists: req.body.assists
    }

    // Validate parameters. If an error is found, end execution and return a 422 "Unprocessable Entity"
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }

    // At this point the uid is defined as it's checked by the "validateFirebaseIdToken" 
    //  Express middleware
    const uid = ((req as any).user as admin.auth.DecodedIdToken).uid;

    // If assists are not provided, assume default
    if (!lapTime.assists) {
        const assists = await admin.database()
            .ref("users/" + uid + "/settings/assists")
            .once("value");
        lapTime.assists = assists.val();
    }

    // Push data
    admin.database()
        .ref("users/" + uid + "/lapTimes")
        .push(lapTime)
        .then((snapshot) => {
            lapTime.id = snapshot.key || undefined;
            res.json(lapTime);
            return;
        }, (err) => {
            res.status(500);
            res.json({ error: true, msg: "An error occourred.", err: err });
            return;
        });

});

// Expose Express API as a single Cloud Function:
exports.api = functions.https.onRequest(app);
