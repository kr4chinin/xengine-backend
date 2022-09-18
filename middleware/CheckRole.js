import jwt from 'jsonwebtoken'
import { FORBIDDEN, UNAUTHORIZED } from '../utils/Statuses.js'

export default function (role) {
	return function (req, res, next) {
		// We are intrested only in GET, POST, PUT and DELETE methods, not in OPTIONS
		if (req.method === 'OPTIONS') {
			next()
		}

		try {
			// Get a token from authorization header
			if (req.headers.authorization) {
				const token = req.headers.authorization.split(' ')[1]

				if (!token) {
					return res
						.status(UNAUTHORIZED)
						.json({ message: 'Not authorized', cause: null })
				}

				// Verify a token
				const decoded = jwt.verify(token, process.env.SECRET_KEY)

				// If a user has a role that is not equal to the role that we are checking, then return an error
				if (decoded.role !== role) {
					return res
						.status(FORBIDDEN)
						.json({ message: 'Access denied', cause: null })
				}

				// Add decoded data to the request
				req.user = decoded

				next()
			} else {
				return res
					.status(UNAUTHORIZED)
					.json({ message: 'No authorization header', cause: null })
			}
		} catch (e) {
			return res
				.status(UNAUTHORIZED)
				.json({ message: 'Not authorized', cause: e.message })
		}
	}
}
