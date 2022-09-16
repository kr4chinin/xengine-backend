import { Router } from 'express'
import brandController from '../controllers/brandController.js'
import CheckRole from '../middleware/CheckRole.js'
import { check } from 'express-validator'

const router = new Router()

router.post(
	'/',
	CheckRole('ADMIN'),
	[check('name', 'Brand must have a name').notEmpty()],
	brandController.create
)
router.get('/', brandController.getAll)
router.get('/:id', brandController.getOneById)

export default router
