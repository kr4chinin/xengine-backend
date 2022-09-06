import { Router } from 'express'
import vehicleController from '../controllers/vehicleController.js'

const router = new Router()

router.post('/', vehicleController.create)
router.get('/', vehicleController.getAll)
router.get('/:id', vehicleController.getOne)

export default router
