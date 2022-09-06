export class ApiError extends Error {
	constructor(status, info, message) {
		super()
		this.status = status
		this.info = info
		this.message = message
	}

	static badRequest(info, message) {
		return new ApiError(400, info, message)
	}

	static unauthorized(info, message) {
		return new ApiError(401, info, message)
	}

	static forbidden(info, message) {
		return new ApiError(403, info, message)
	}

	static notFound(info, message) {
		return new ApiError(404, info, message)
	}

	static internal(info, message) {
		return new ApiError(500, info, message)
	}
}
