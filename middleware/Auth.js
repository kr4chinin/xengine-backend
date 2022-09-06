import jwt from 'jsonwebtoken'
import { ApiError } from '../helpers/apiError.js'

export default function (req, res, next) {
	// We are intrested only in GET, POST, PUT and DELETE methods, not in OPTIONS
	if (req.method === 'OPTIONS') {
		next()
	}

	try {
		// If we have authorization header we will try to get a token from it
		if (req.headers.authorization) {
			const token = req.headers.authorization.split(' ')[1] // "Bearer TOKEN"
			if (!token) {
				next(ApiError.unauthorized('Not authorized', 'No token provided'))
			}

			// If we have a token we will try to verify it
			const verifiedToken = jwt.verify(token, process.env.SECRET_KEY)
			req.user = verifiedToken
			next()
		} else {
			next(ApiError.unauthorized('Not authorized', 'No token provided'))
		}
	} catch (e) {
		next(ApiError.unauthorized('Not authorized', e.message))
	}
}
