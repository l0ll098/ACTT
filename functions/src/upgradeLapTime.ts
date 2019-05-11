import { Request, Response } from "express";
import * as admin from "firebase-admin";
import { check } from "express-validator/check";

import { LapTime } from "../shared/appModels";
import { validate, sendErr, sendOK, upgradeData } from "../shared/helpers";
import { HttpStatus } from "../shared/httpStatus";


export const upgradeLapTimeValidators = [
    check("lapTimeId").isString().not().isEmpty()
];

export async function upgradeLapTime(req: Request, res: Response) {

    if (!validate(req, res)) {
        return false;
    }

    const lapTimeId: string = req.body.lapTimeId;

    // At this point the uid is defined as it's checked by the "validateFirebaseIdToken" 
    //  Express middleware
    const uid = ((req as any).user as admin.auth.DecodedIdToken).uid;

    // Get current LapTime data
    const lapTime: LapTime = (await admin.database()
        .ref("users/" + uid + "/lapTimes/" + lapTimeId + "/")
        .once("value"))
        .val();

    try {
        const upgrade = await upgradeData(uid, lapTime, lapTimeId);
        if (upgrade.done) {
            return sendOK(res, { done: true, lapTime: lapTime });
        }
    } catch (err) {
        return sendErr(res, err.status, err);
    }

}


export async function upgradeAllLapTimes(req: Request, res: Response) {
    if (!validate(req, res)) {
        return false;
    }

    // At this point the uid is defined as it's checked by the "validateFirebaseIdToken" 
    //  Express middleware
    const uid = ((req as any).user as admin.auth.DecodedIdToken).uid;

    // ! NOTE: This has to be separated in two parts as adding the .val() would break it
    // The .endAt(0) is used to filter data in order to get only records where the "version"
    // property is not defined.
    const snap = await admin.database()
        .ref("users/" + uid + "/lapTimes/")
        .orderByChild("version")
        .endAt(0)
        .once("value");
    const rawData = snap.val();

    if (rawData.length === 0) {
        return sendErr(res, HttpStatus.NotModified, { done: false, error: "Records were already updated" });
    }

    // Convert fetched LapTimes from an object to an array and set the "id" property
    const lapTimes: LapTime[] = Object.keys(rawData).map((key) => {
        const lapTime: LapTime = rawData[key];
        lapTime.id = key;
        return lapTime;
    });

    try {
        const upgradedData = await Promise.all(lapTimes.map((lapTime) => {
            return upgradeData(uid, lapTime, lapTime.id as string);
        }));

        return sendOK(res, { done: true, lapTimes: upgradedData });
    } catch (err) {
        return sendErr(res, HttpStatus.InternalServerError, err);
    }

}
