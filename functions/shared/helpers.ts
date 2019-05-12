import { Response, Request } from "express";
import { validationResult } from "express-validator/check";

import { Status, HttpStatus } from "./httpStatus";
import { ValidAbsValues } from "./appModels";

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

/**
 * Checks if the validation went well. In that case it returns true, false otherwise
 * @param req The request
 * @param res Http response
 */
export function validate(req: Request, res: Response): boolean {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		sendErr(res, HttpStatus.UnprocessableEntity, errors.array());
		return false;
	}
	return true;
}

/**
 * Returns if the parameter is valid
 * @param perc The percentage to check
 */
export function isValidStringPercentage(perc: string): boolean {
	const nPerc = parseInt(perc, 10);
	if (!isNaN(nPerc) && nPerc >= 0 && nPerc <= 100 && nPerc % 10 === 0) {
		return true;
	} else {
		return false;
	}
}

/**
 * Returns if it's a valid value
 * @param value Value to check
 */
export function isValidAbsValue(value: string): boolean {
	return (value === ValidAbsValues.On || value === ValidAbsValues.Factory || value === ValidAbsValues.Off);
}


export * from "./firebaseService";
