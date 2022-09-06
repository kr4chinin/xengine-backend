import { Router } from 'express'
import userController from '../controllers/userController.js'

const router = new Router()

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/auth', userController.checkAuth)

export default router
