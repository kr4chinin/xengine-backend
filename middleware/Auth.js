import jwt from 'jsonwebtoken'
import { UNAUTHORIZED } from '../utils/Statuses.js'

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
				return res
					.status(UNAUTHORIZED)
					.json({
						message: 'Failed to authorize, no token provided',
						cause: null
					})
			}

			// If we have a token we will try to verify it
			const verifiedToken = jwt.verify(token, process.env.SECRET_KEY)
			req.user = verifiedToken
			next()
		} else {
			return res
				.status(UNAUTHORIZED)
				.json({
					message: 'Failed to authorize, no authorization header',
					cause: null
				})
		}
	} catch (e) {
		return res
			.status(UNAUTHORIZED)
			.json({ message: 'Failed to authorize', cause: e.message })
	}
}
