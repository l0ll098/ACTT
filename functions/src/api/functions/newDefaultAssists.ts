import { Response, Request } from "express";
import { check } from "express-validator/check";
import { auth } from "firebase-admin";

import { FirebaseService } from "../../../shared/firebaseService";
import { validate, sendErr, sendOK, isValidStringPercentage, isValidAbsValue } from "../../../shared/helpers";
import { HttpStatus } from "../../../shared/httpStatus";
import { LapAssists } from "../../../../shared/data.model";

export const newDefaultAssistsValidators = [
    check("assists.autoShifter").isBoolean(),
    check("assists.autoFriction").isBoolean(),
    check("assists.autoBlip").isBoolean(),
    check("assists.idealTrajectory").isBoolean(),
    check("assists.tractionControl").isString().not().isEmpty(),
    check("assists.abs").isString().not().isEmpty(),
    check("assists.stabilityControl").isString().not().isEmpty(),
    check("assists.mechanicalDamages").isString().not().isEmpty(),
    check("assists.tyresWear").isBoolean(),
    check("assists.tyresBlankets").isBoolean(),
    check("assists.fuelConsumption").isBoolean(),

    check("assists").custom((assists: LapAssists) => {
        const isValid = (
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

export async function newDefaultAssists(req: Request, res: Response) {
    if (!validate(req, res)) {
        return false;
    }

    const uid = ((req as any).user as auth.DecodedIdToken).uid;
    const assists = req.body.assists;

    try {
        await FirebaseService.saveDefaultLapAssists(uid, assists);
        return sendOK(res, assists);
    } catch (err) {
        return sendErr(res, HttpStatus.InternalServerError, err);
    }
}