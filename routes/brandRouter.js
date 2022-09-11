import { Router } from 'express'
import brandController from '../controllers/brandController.js'
import CheckRole from '../middleware/CheckRole.js'

const router = new Router()

router.post('/', CheckRole('ADMIN'), brandController.create)
router.get('/', brandController.getAll)
router.get('/:id', brandController.getOneById)

export default router
