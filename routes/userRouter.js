import { Router } from 'express'
import userController from '../controllers/userController.js'
import Auth from '../middleware/Auth.js'

const router = new Router()

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/auth', Auth, userController.checkAuth)

export default router
