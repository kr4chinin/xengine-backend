import { Router } from 'express'
import typeController from '../controllers/typeController.js'
import CheckRole from '../middleware/CheckRole.js'
import { check } from 'express-validator'

const router = new Router()

router.post(
	'/',
	CheckRole('ADMIN'),
	[check('name', 'Type must have a name').notEmpty()],
	typeController.create
)
router.get('/', typeController.getAll)
router.get('/:id', typeController.getOneById)

export default router
