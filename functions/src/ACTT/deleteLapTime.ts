import { Response, Request } from "express";
import { check } from "express-validator/check";
import * as admin from "firebase-admin";

import { FirebaseService } from "../../shared/firebaseService";
import { validate, sendErr, sendOK } from "../../shared/helpers";
import { HttpStatus } from "../../shared/httpStatus";

export const deleteLapTimeValidators = [
    check("id").isString().not().isEmpty().optional(),

    check("lapTimeIds").isArray().not().isEmpty().optional()
];

export async function deleteLapTime(req: Request, res: Response) {
    if (!validate(req, res)) {
        return false;
    }

    const lapTimeId: string = req.params.id;
    let lapTimeIds: string[] = req.body.lapTimeIds || [];

    if (!lapTimeId && !lapTimeIds) {
        return sendErr(res, HttpStatus.BadRequest, { done: false, msg: "You have to pass a lapTimeId or an array of lapTimeIds" });
    }

    const uid = ((req as any).user as admin.auth.DecodedIdToken).uid;

    try {

        if (lapTimeId) {
            lapTimeIds = [lapTimeId];
        }

        const lapTimes = await FirebaseService.getLapTimesByIds(uid, lapTimeIds);

        if (!lapTimes || lapTimes.indexOf(null as any) >= 0) {
            return sendErr(res, HttpStatus.NotFound, { done: false, msg: "LapTime(s) not found" });
        }

        await FirebaseService.deleteLapTimes(uid, lapTimeIds);
        return sendOK(res, HttpStatus.Ok);
    } catch (err) {
        return sendErr(res, HttpStatus.InternalServerError, err);
    }
}
