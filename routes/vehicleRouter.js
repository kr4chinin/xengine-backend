import { Router } from 'express'
import vehicleController from '../controllers/vehicleController.js'
import CheckRole from '../middleware/CheckRole.js'

const router = new Router()

router.post('/', CheckRole('ADMIN'), vehicleController.create)
router.get('/', vehicleController.getAll)
router.get('/popular', vehicleController.getThreeMostPopular)
router.get('/:id', vehicleController.getOne)
router.delete('/', CheckRole('ADMIN'), vehicleController.deleteVehicle)

export default router
