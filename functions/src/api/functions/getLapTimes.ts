import { check } from "express-validator";
import { Request, Response } from "express";
import { auth } from "firebase-admin";

import { validate, FirebaseService, sendOK, sendErr } from "../../../shared/helpers";
import { LapTime, Track, Car } from "../../../../shared/data.model";
import { HttpStatus } from "../../../shared/httpStatus";


export const getLapTimesValidators = [
    check("carName").isString().not().isEmpty().optional(),
    check("trackName").isString().not().isEmpty().optional(),
    check("trackLength").isInt().optional(),
    check("limitTo").isInt().optional()
];

export async function getLapTime(req: Request, res: Response) {

    if (!validate(req, res)) {
        return false;
    }

    const carName: string = req.query.carName;
    const trackName: string = req.query.trackName;
    const trackLength: number = parseInt(req.query.trackLength, 10);
    const limitTo: number = parseInt(req.query.limitTo, 10) || 25;

    // If user passed the trackName but not the length or he passed the length but not the name,
    // respond with an error
    if (trackName && !trackLength || trackLength && !trackName) {
        return sendErr(res, HttpStatus.BadRequest, { done: false, msg: "You have to specify one of carName or (trackName AND trackLength)" });
    }

    // At this point the uid is defined as it's checked by the "validateFirebaseIdToken" 
    //  Express middleware
    const uid = ((req as any).user as auth.DecodedIdToken).uid;


    try {
        let lapTimes: LapTime[] = [];

        // If the carName has been passed, query by car
        if (carName && carName.length > 0) {
            const car: Car = { name: carName };
            lapTimes = await FirebaseService.getLapTimesByCar(uid, car, limitTo);
        } else {
            // if the trackName and trackLength have been passed, query by track
            if (trackName && trackLength) {
                const track: Track = { name: trackName, length: trackLength };
                lapTimes = await FirebaseService.getLapTimesByTrack(uid, track, limitTo);
            } else {
                // Just get some records
                lapTimes = await FirebaseService.getLapTimes(uid, limitTo);
            }
        }

        return sendOK(res, { lapTimes: lapTimes });

    } catch (err) {
        return sendErr(res, HttpStatus.InternalServerError, err);
    }

}


export const getLapTimeByIdValidators = [
    check("id").isString().not().isEmpty()
];

export async function getLapTimeById(req: Request, res: Response) {
    if (!validate(req, res)) {
        return false;
    }

    const uid = ((req as any).user as auth.DecodedIdToken).uid;
    const lapTimeId: string = req.params.id;

    try {
        const lapTime = await FirebaseService.getLapTimeById(uid, lapTimeId);
        return sendOK(res, { success: true, lapTime: lapTime });
    } catch (err) {
        if (err && err.status === HttpStatus.NotFound) {
            return sendErr(res, HttpStatus.NotFound, err);
        }
        return sendErr(res, HttpStatus.InternalServerError, err);
    }
}
