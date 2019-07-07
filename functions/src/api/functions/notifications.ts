import { Request, Response } from "express";
import { check } from "express-validator/check";

import { Notification } from "../../../../shared/data.model";
import { sendOK, sendErr, FirebaseService, getUid, validate } from "../../../shared/helpers";
import { HttpStatus } from "../../../shared/httpStatus";


export async function getNotifications(req: Request, res: Response) {
    // At this point the uid is defined as it's checked by the "validateFirebaseIdToken" 
    //  Express middleware
    const uid = getUid(req);

    try {
        const notifications: Notification[] = [];
        const general = await FirebaseService.getGeneralNotifications();
        const user = await FirebaseService.getUserSpecificNotifications(uid);

        if (general && general.length > 0) {
            notifications.push(...general);
        }
        if (user && user.length > 0) {
            notifications.push(...user);
        }

        return sendOK(res, { notifications: notifications });
    } catch (err) {
        return sendErr(res, HttpStatus.InternalServerError, err);
    }

}

export const markNotificationAsReadValidators = [
    check("id").isString().not().isEmpty()
];

export async function markNotificationAsRead(req: Request, res: Response) {

    if (!validate(req, res)) {
        return false;
    }

    const uid = getUid(req);
    const notificationId = req.params.id;

    try {
        const success = await FirebaseService.markNotificationAsRead(uid, notificationId);

        if (success) {
            return sendOK(res, { done: true });
        } else {
            return sendErr(res, HttpStatus.NotModified, { done: false });
        }

    } catch (err) {
        if (err.status === HttpStatus.NotFound) {
            return sendErr(res, err.status, { done: false, msg: "Notification not found" });
        }

        if (err.status === HttpStatus.NotModified) {
            return sendErr(res, err.status, { done: false, msg: "Already read" });
        }

        return sendErr(res, HttpStatus.InternalServerError, err);
    }
}
