import * as admin from "firebase-admin";
import { Request, Response } from "express";

import { LapTime, isValidStringPercentage, isValidAbsValue, LapAssists } from "./models";
import { validationResult, check } from "express-validator/check";


export const validators = [
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


export async function newLapTime(req: Request, res: Response) {
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
}
