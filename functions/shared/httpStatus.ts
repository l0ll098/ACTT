export interface Status {
	code: number;
	msg: string;
}

export class HttpStatus {
	public static Ok: Status = {
		code: 200,
		msg: "Ok"
	};

	public static Created: Status = {
		code: 201,
		msg: "Created"
	};

	public static NoContent: Status = {
		code: 204,
		msg: "No content"
	};

	public static NotModified: Status = {
		code: 304,
		msg: "Not modified"
	};

	public static BadRequest: Status = {
		code: 400,
		msg: "Bad request"
	};

	public static Unauthorized: Status = {
		code: 401,
		msg: "Unauthorized"
	};

	public static Forbidden: Status = {
		code: 403,
		msg: "Forbidden"
	};

	public static NotFound: Status = {
		code: 404,
		msg: "Not found"
	};

	public static Conflict: Status = {
		code: 409,
		msg: "Conflict"
	};

	public static UnprocessableEntity: Status = {
		code: 422,
		msg: "Unprocessable Entity"
	};

	public static InternalServerError: Status = {
		code: 500,
		msg: "Internal server error"
	};
}
