import { OK, BAD_REQUEST } from '../utils/Statuses.js'
import { Cart } from '../models/Cart.js'
import { CartVehicle } from '../models/CartVehicle.js'

class CartController {
	async addToCart(req, res) {
		try {
			const { vehicleId, userId } = req.body

			// Check if user already has a cart
			let cart = await Cart.findOne({ where: { userId } })

			if (!cart) {
				// If not, create a new cart
				cart = await Cart.create({ userId })
			}

			const cartId = cart.id

			// Add vehicle to cart
			const cartVehicle = await CartVehicle.create({ cartId, vehicleId })

			return res.status(OK).json(cartVehicle)
		} catch (e) {
			return res.status(BAD_REQUEST).json({ message: 'Failed to add to cart' })
		}
	}
}

export default new CartController()
