import { Brand } from '../models/Brand'

class BrandController {
	async create(req, res) {
		const { name } = req.body
		const brand = await Brand.create({ name })
		return res.status(200).json(brand)
	}

	async getAll(req, res) {
		const brands = await Brand.findAll()
		return res.status(200).json(brands)
	}
}

export default new BrandController()
