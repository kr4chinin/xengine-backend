import { Router } from 'express'
import userRouter from './userRouter.js'
import vehicleRouter from './vehicleRouter.js'
import typeRouter from './typeRouter.js'
import brandRouter from './brandRouter.js'
import cartRouter from './cartRouter.js'

const router = new Router()

router.use('/user', userRouter)
router.use('/type', typeRouter)
router.use('/brand', brandRouter)
router.use('/vehicle', vehicleRouter)
router.use('/cart', cartRouter)

export default router
