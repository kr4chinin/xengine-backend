import { ApiError } from '../helpers/apiError.js'

export default function (err, req, res, next) {
	// If we got an error from the controller we will send it to the client
	// with underlying message and status code

	if (err instanceof ApiError) {
		return res.status(err.status).json({ info: err.info, message: err.message })
	}

	// Else we can assume that this is an unknown internal server error
	return res.status(500).json({ message: 'Unknown internal server error' })
}
