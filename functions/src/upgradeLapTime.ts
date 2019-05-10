import { Request, Response } from "express";
import * as admin from "firebase-admin";
import { check } from "express-validator/check";

import { LapTime, LAST_SUPPORTED_LAP_TIME_VERSION } from "../shared/appModels";
import { validate, sendErr, sendOK } from "../shared/helpers";
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

    if (!lapTime) {
        return sendErr(res, HttpStatus.NotFound, { done: false, error: "Lap time not found" });
    }

    // Get version. If lapTime doesn't have it, assume 1
    const version = lapTime.version ? lapTime.version : 1;

    // Get defualt assists
    const assists = (await admin.database()
        .ref("users/" + uid + "/settings/assists")
        .once("value")).val();

    if (version > LAST_SUPPORTED_LAP_TIME_VERSION) {
        // Data are already up to date
        return sendErr(res, HttpStatus.NotModified, { done: false, error: "Data is already updated" });
    }

    // Do something based on the version
    switch (version) {
        case 1:
            // Modify the lapTime object to add assists and set data version
            lapTime.assists = assists;
            lapTime.version = 1;
        // Intentional fall-through
        // break;
        case 2:
        // 
    }

    // Update saved value with the new one
    await admin.database()
        .ref("users/" + uid + "/lapTimes/" + lapTimeId + "/")
        .update(lapTime);

    return sendOK(res, { done: true, lapTime: lapTime });
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
        const done = await Promise.all(lapTimes.map((lapTime) => {
            const moddedReq = req;
            moddedReq.body.lapTimeId = lapTime.id
            return upgradeLapTime(req, res);
        }));

        console.log("done: ", done);
    } catch (err) {
        console.log("err: ", err);
    }

    return;
}
