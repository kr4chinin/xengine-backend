import { Router } from 'express'
import typeController from '../controllers/typeController.js'
import CheckRole from '../middleware/CheckRole.js'

const router = new Router()

router.post('/', CheckRole('ADMIN'), typeController.create)
router.get('/', typeController.getAll)
router.get('/:id', typeController.getOneById)

export default router
