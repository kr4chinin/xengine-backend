import { OK, BAD_REQUEST } from '../utils/Statuses.js'
import { Cart } from '../models/Cart.js'
import { CartVehicle } from '../models/CartVehicle.js'

class CartController {
	async addToCart(req, res) {
		try {
			const { vehicleId, userId } = req.body

			// Find user's cart
			let cart = await Cart.findOne({ where: { userId } })

			if (!cart) {
                return res.status(BAD_REQUEST).json({ message: 'Cart not found', cause: null })
			}

			const cartId = cart.id

			// Add vehicle to cart
			const cartVehicle = await CartVehicle.create({ cartId, vehicleId })

			return res.status(OK).json(cartVehicle)
		} catch (e) {
			return res.status(BAD_REQUEST).json({ message: 'Failed to add to cart', cause: e.message })
		}
	}

	async removeFromCart(req, res) {
		try {
			const { vehicleId, userId } = req.body

			// Get user's cart
			const cart = await Cart.findOne({ where: { userId } })

			if (!cart) {
				return res.status(BAD_REQUEST).json({ message: 'Cart not found', cause: null })
			}

			const cartId = cart.id

			// Remove vehicle from cart
			await CartVehicle.destroy({ where: { cartId, vehicleId } })

			return res.status(OK).json('Vehicle removed from cart')
		} catch (e) {
            return res.status(BAD_REQUEST).json({ message: 'Failed to remove from cart', cause: e.message })
        }
	}

	async getAll(req, res) {
		try {
			const { userId } = req.query

			// Get user's cart
			const cart = await Cart.findOne({ where: { userId } })

			if (!cart) {
				return res.status(BAD_REQUEST).json({ message: 'Cart not found', cause: null })
			}

			const cartId = cart.id

			// Get all vehicles from found cart
			const vehicles = await CartVehicle.findAll({ where: { cartId } })

			return res.status(OK).json(vehicles)
		} catch (e) {
			return res
				.status(BAD_REQUEST)
				.json({ message: 'Failed to get elements from cart', cause: e.message })
		}
	}
}

export default new CartController()
