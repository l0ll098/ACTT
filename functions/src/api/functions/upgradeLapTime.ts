import { Request, Response } from "express";
import { auth } from "firebase-admin";
import { check } from "express-validator";

import { LapTime } from "../../../../shared/data.model";
import { validate, sendErr, sendOK, FirebaseService } from "../../../shared/helpers";
import { HttpStatus } from "../../../shared/httpStatus";


export const upgradeLapTimeValidators = [
    check("lapTimeId").isString().not().isEmpty()
];

/**
 * This function will upgrade a single LapTime for the current user
 * @param req The request object
 * @param res Http response
 */
export async function upgradeLapTime(req: Request, res: Response) {

    if (!validate(req, res)) {
        return false;
    }

    const lapTimeId: string = req.body.lapTimeId;

    // At this point the uid is defined as it's checked by the "validateFirebaseIdToken" 
    //  Express middleware
    const uid = ((req as any).user as auth.DecodedIdToken).uid;

    // Get current LapTime data
    const lapTime: LapTime = await FirebaseService.getLapTimeById(uid, lapTimeId);

    try {
        const upgrade = await FirebaseService.upgradeData(uid, lapTime, lapTimeId);
        if (upgrade.done) {
            return sendOK(res, { done: true, lapTime: lapTime });
        }
    } catch (err) {
        return sendErr(res, err.status, err);
    }

}

/**
 * This function will upgrade all LapTimes for the current user
 * @param req The request object
 * @param res Http response
 */
export async function upgradeAllLapTimes(req: Request, res: Response) {
    if (!validate(req, res)) {
        return false;
    }

    // At this point the uid is defined as it's checked by the "validateFirebaseIdToken" 
    //  Express middleware
    const uid = ((req as any).user as auth.DecodedIdToken).uid;

    // ! NOTE: This has to be separated in two parts as adding the .val() would break it
    // The value 0 is used to filter data in order to get only records where the "version"
    // property is not defined.
    const lapTimes = await FirebaseService.getLapTimesByVersion(uid, 0);

    // If query didn't returned anything, send user a 304 message
    if (!lapTimes || lapTimes.length === 0) {
        return sendErr(res, HttpStatus.NotModified, { done: false, error: "Records were already updated" });
    }


    try {
        const upgradedData = await Promise.all(lapTimes.map((lapTime) => {
            return FirebaseService.upgradeData(uid, lapTime, lapTime.id as string);
        }));

        return sendOK(res, { done: true, lapTimes: upgradedData });
    } catch (err) {
        return sendErr(res, HttpStatus.InternalServerError, err);
    }

}
