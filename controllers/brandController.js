import { Brand } from '../models/Brand.js'
import { ApiError } from '../helpers/apiError.js'

class BrandController {
	async create(req, res, next) {
		try {
			const { name } = req.body
			const brand = await Brand.create({ name })
			return res.status(200).json(brand)
		} catch (e) {
			return next(ApiError.badRequest('Failed to create brand'))
		}
	}

	async getAll(req, res) {
		try {
			const brands = await Brand.findAll()
			return res.status(200).json(brands)
		} catch (e) {
			next(ApiError.badRequest('Failed to get all brands'))
		}
	}
}

export default new BrandController()
