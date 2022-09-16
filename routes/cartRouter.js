import { Router } from 'express'
import cartController from '../controllers/cartController.js'

const router = new Router()

router.post('/', cartController.addToCart)
router.delete('/', cartController.removeFromCart)
router.get('/', cartController.getAll)
router.get('/check', cartController.isInCart)
router.get('/total', cartController.calculateTotalPrice)

export default router
