import { Router } from 'express'
import userController from '../controllers/userController.js'
import Auth from '../middleware/Auth.js'
import { check } from 'express-validator'

const router = new Router()

router.post(
	'/registration',
	[
		check('email', 'Incorrect email').isEmail(),
		check(
			'password',
			'Password must be longer than 5 and shorter than 25 symbols'
		).isLength({ min: 5, max: 25 })
	],
	userController.registration
)
router.post('/login', userController.login)
router.get('/auth', Auth, userController.checkAuth)

export default router
