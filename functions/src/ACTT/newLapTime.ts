import { auth } from "firebase-admin";
import { Request, Response } from "express";
import { check } from "express-validator/check";

import { LapTime, LapAssists, LAST_SUPPORTED_LAP_TIME_VERSION } from "../../../shared/data.model";
import { isValidStringPercentage, isValidAbsValue, validate, sendOK, sendErr, FirebaseService } from "../../shared/helpers";
import { HttpStatus } from "../../shared/httpStatus";

export const newLapTimeValidators = [
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


/**
 * This will create a new LapTime for the current user.
 * Default LapTime version = LAST_SUPPORTED_LAP_TIME_VERSION
 * @param req The request object
 * @param res Http response
 */
export async function newLapTime(req: Request, res: Response) {

    if (!validate(req, res)) {
        return false;
    }

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
        assists: req.body.assists,
        version: LAST_SUPPORTED_LAP_TIME_VERSION
    }

    // At this point the uid is defined as it's checked by the "validateFirebaseIdToken" 
    //  Express middleware
    const uid = ((req as any).user as auth.DecodedIdToken).uid;

    // If assists are not provided, assume default
    if (!lapTime.assists) {
        lapTime.assists = await FirebaseService.getDefaultLapAssists(uid);
    }

    try {
        const snapshot = await FirebaseService.saveLapTime(uid, lapTime);

        lapTime.id = snapshot.key || undefined;
        return sendOK(res, { laptime: lapTime });

    } catch (err) {
        return sendErr(res, HttpStatus.InternalServerError, err, "An error occourred saving data");
    }
}
