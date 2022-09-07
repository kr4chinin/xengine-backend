import { Router } from 'express'
import ratingController from '../controllers/ratingController.js'

const router = new Router()

router.post('/', ratingController.setRating)
router.get('/', ratingController.calculateAverageRating)

export default router