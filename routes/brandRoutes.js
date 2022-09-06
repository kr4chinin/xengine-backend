import { Router } from 'express'
import brandController from '../controllers/brandController.js'

const router = new Router()

router.get('/', brandController.getAll)
router.post('/', brandController.create)

export default router
