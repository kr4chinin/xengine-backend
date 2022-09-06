import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { User } from '../models/User.js'
import { Cart } from '../models/Cart.js'
import { BAD_REQUEST, OK, UNAUTHORIZED } from '../utils/Statuses.js'

function generateJwt(id, email, role) {
	const payload = {
		id,
		email,
		role
	}
	return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' })
}

class UserController {
	async registration(req, res) {
		try {
			const { email, password, role } = req.body

			// Check if such user already exists
			const candidate = await User.findOne({ where: { email } })

			if (candidate) {
				return res
					.status(BAD_REQUEST)
					.json({ message: 'User with this email already exists' })
			}

			// Hashing password
			const hashedPassword = await bcrypt.hash(password, 5)

			// Creating new user
			const user = await User.create({ email, password: hashedPassword, role })

			// Creating user's cart
			const cart = await Cart.create({ userId: user.id })

			// Generating JWT token
			const token = generateJwt(user.id, user.email, user.role)

			return res.status(OK).json({ token })
		} catch (e) {
			return res.status(BAD_REQUEST).json({ message: 'Registration failed' })
		}
	}

	async login(req, res) {
		try {
			const { email, password } = req.body

			// Finding user in the database
			const user = await User.findOne({ where: { email } })

			if (!user) {
				return res
					.status(BAD_REQUEST)
					.json({ message: 'User with this email not found' })
			}

			// Checking password
			const isPasswordValid = bcrypt.compareSync(password, user.password)

			if (!isPasswordValid) {
				return res.status(BAD_REQUEST).json({ message: 'Invalid password' })
			}

			// Generating JWT token
			const token = generateJwt(user.id, user.email, user.role)

			return res.status(OK).json({ token })
		} catch (e) {
			return res.status(BAD_REQUEST).json({ message: 'Login failed' })
		}
	}

	async checkAuth(req, res) {
		try {
			const token = generateJwt(req.user.id, req.user.email, req.user.role)
			return res.status(OK).json({ token })
		} catch (e) {
			return res.status(UNAUTHORIZED).json({ message: 'Unauthorized' })
		}
	}
}

export default new UserController()
