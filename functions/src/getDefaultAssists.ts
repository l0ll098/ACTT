import { Response, Request } from "express";
import * as admin from "firebase-admin";

import { FirebaseService } from "../shared/firebaseService";
import { validate, sendErr, sendOK } from "../shared/helpers";
import { HttpStatus } from "../shared/httpStatus";

export async function getDefaultAssists(req: Request, res: Response) {
    if (!validate(req, res)) {
        return false;
    }

    const uid = ((req as any).user as admin.auth.DecodedIdToken).uid;

    try {
        const assists = await FirebaseService.getDefaultLapAssists(uid);
        return sendOK(res, assists);
    } catch (err) {
        return sendErr(res, HttpStatus.InternalServerError, err);
    }
}