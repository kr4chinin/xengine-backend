import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { User } from '../models/User.js'
import { Cart } from '../models/Cart.js'
import { ApiError } from '../helpers/ApiError.js'

function generateJwt(id, email, role) {
	const payload = {
		id,
		email,
		role
	}
	return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' })
}

class UserController {
	async registration(req, res, next) {
		try {
			const { email, password, role } = req.body

			// Check if such user already exists
			const candidate = await User.findOne({ where: { email } })

			if (candidate) {
				next(
					ApiError.badRequest(
						'User with this email already exists',
						'This email is already taken'
					)
				)
			}

			// Hashing password
			const hashedPassword = await bcrypt.hash(password, 5)

			// Creating new user
			const user = await User.create({ email, password: hashedPassword, role })

			// Creating user's cart
			const cart = await Cart.create({ userId: user.id })

			// Generating JWT token
			const token = generateJwt(user.id, user.email, user.role)

			return res.status(200).json({ token })
		} catch (e) {
			next(ApiError.badRequest('Registration failed', e.message))
		}
	}

	async login(req, res, next) {
		try {
			const { email, password } = req.body

			// Finding user in the database
			const user = await User.findOne({ where: { email } })

			if (!user) {
				next(
					ApiError.badRequest(
						'User with this email does not exist',
						'User not found'
					)
				)
			}

			// Checking password
			const isPasswordValid = bcrypt.compareSync(password, user.password)

			if (!isPasswordValid) {
				next(ApiError.badRequest('Invalid password', 'Password comparison failed'))
			}

			// Generating JWT token
			const token = generateJwt(user.id, user.email, user.role)

			return res.status(200).json({ token })
		} catch (e) {
			next(ApiError.badRequest('Login failed', e.message))
		}
	}

    async checkAuth(req, res, next) {
        try {
            const token = generateJwt(req.user.id, req.user.email, req.user.role)
            return res.status(200).json({token})
        } catch (e) {
            next(ApiError.unauthorized('Auth check failed', e.message))
        }
    }
}

export default new UserController()
