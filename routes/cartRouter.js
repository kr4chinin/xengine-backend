import { Router } from 'express'
import cartController from '../controllers/cartController.js'

const router = new Router()

router.post('/', cartController.addToCart)
router.delete('/', cartController.removeFromCart)
router.get('/', cartController.getAll)

export default router
