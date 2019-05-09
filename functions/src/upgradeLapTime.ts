import { Request, Response } from "express";
import * as admin from "firebase-admin";
import { validationResult, check } from "express-validator/check";

import { LapTime, LAST_SUPPORTED_LAP_TIME_VERSION } from "./models";


export const upgradeLapTimeValidators = [
    check("lapTimeId").isString().not().isEmpty()
];

export async function upgradeLapTime(req: Request, res: Response) {
    const lapTimeId: string = req.body.lapTimeId;

    // Validate parameters. If an error is found, end execution and return a 422 "Unprocessable Entity"
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }

    // At this point the uid is defined as it's checked by the "validateFirebaseIdToken" 
    //  Express middleware
    const uid = ((req as any).user as admin.auth.DecodedIdToken).uid;

    // Get current LapTime data
    const lapTime: LapTime = (await admin.database()
        .ref("users/" + uid + "/lapTimes/" + lapTimeId + "/")
        .once("value"))
        .val();

    if (!lapTime) {
        return res.status(404).json({ done: false, error: "Lap time not found" });
    }

    // Get version. If lapTime doesn't have it, assume 1
    const version = lapTime.version ? lapTime.version : 1;

    // Get defualt assists
    const assists = (await admin.database()
        .ref("users/" + uid + "/settings/assists")
        .once("value")).val();

    if (version > LAST_SUPPORTED_LAP_TIME_VERSION) {
        // Data are already up to date
        return res.status(304).json({ done: false, error: "Data is already updated" });
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
    const snap = await admin.database()
        .ref("users/" + uid + "/lapTimes/" + lapTimeId + "/")
        .update(lapTime);

    return res.json({ done: true, lapTime: lapTime });
}
