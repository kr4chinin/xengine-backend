import { Router } from 'express'
import typeController from '../controllers/typeController.js'
import CheckRole from '../middleware/CheckRole.js'

const router = new Router()

router.post('/', CheckRole('ADMIN'), typeController.create)
router.get('/', typeController.getAll)

export default router
