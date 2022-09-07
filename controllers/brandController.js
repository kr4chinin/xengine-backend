import { Brand } from '../models/Brand.js'
import { BAD_REQUEST, OK } from '../utils/Statuses.js'

class BrandController {
	async create(req, res) {
		try {
			const { name } = req.body
			const brand = await Brand.create({ name })
			return res.status(OK).json(brand)
		} catch (e) {
			return res
				.status(BAD_REQUEST)
				.json({ message: 'Failed to create a new brand', cause: e.message })
		}
	}

	async getAll(_, res) {
		try {
			const brands = await Brand.findAll()
			return res.status(OK).json(brands)
		} catch (e) {
			return res
				.status(BAD_REQUEST)
				.json({ message: 'Failed to get all brands', cause: e.message })
		}
	}
}

export default new BrandController()
