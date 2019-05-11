import { Response, Request } from "express";
import { validationResult } from "express-validator/check";
import * as admin from "firebase-admin";

import { Status, HttpStatus } from "./httpStatus";
import { ValidAbsValues, LapTime, LAST_SUPPORTED_LAP_TIME_VERSION, LapAssists } from "./appModels";

/**
 * Sends a response to the client
 * @param res The response
 * @param data The data that has to be sent to the client
 * @param success (optional) Defualt true.
 */
export function sendOK(res: Response, data: object, success = true): void {
	res.status(HttpStatus.Ok.code).json({
		success: success,
		data: data
	});
}


/**
 * Sends an error to the client
 * @param res The response object
 * @param error The error thrown by a routine
 * @param data The data that has to be sent to the client
 * @param errMsg (optional) A custom string to specify the error that occurred
 * @param success (optional) Defualt false.
 */
export function sendErr(res: Response, error: Status, data: object, errMsg: string = error.msg, success = false): void {
	res.status(error.code).json({
		success: success,
		message: errMsg,
		error: data
	});
}

export function validate(req: Request, res: Response): boolean {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		sendErr(res, HttpStatus.UnprocessableEntity, errors.array());
		return false;
	}
	return true;
}

export function isValidStringPercentage(perc: string): boolean {
	const nPerc = parseInt(perc, 10);
	if (!isNaN(nPerc) && nPerc >= 0 && nPerc <= 100 && nPerc % 10 === 0) {
		return true;
	} else {
		return false;
	}
}

export function isValidAbsValue(value: string): boolean {
	return (value === ValidAbsValues.On || value === ValidAbsValues.Factory || value === ValidAbsValues.Off);
}


export async function upgradeData(uid: string, lapTime: LapTime, lapTimeId: string, assists?: LapAssists) {
	if (!lapTime) {
		return Promise.reject({ done: false, error: "LapTime not found", status: HttpStatus.NotFound });
	}

	// Get version. If lapTime doesn't have it, assume 1
	const version = lapTime.version ? lapTime.version : 1;

	// Get defualt assists
	if (!assists) {
		// tslint:disable-next-line:no-parameter-reassignment
		assists = (await admin.database()
			.ref("users/" + uid + "/settings/assists")
			.once("value")).val();
	}

	if (version > LAST_SUPPORTED_LAP_TIME_VERSION) {
		// Data are already up to date
		return Promise.reject({ done: false, error: "Data is already updated", status: HttpStatus.NotModified });
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

	// Return the new lapTime
	return Promise.resolve({ done: true, lapTime: lapTime });
}
