import { Brand } from '../models/Brand.js'
import { BAD_REQUEST, OK } from '../utils/Statuses.js'
import { validationResult } from 'express-validator'

class BrandController {
	async create(req, res) {
		try {
			// Checking validation result
			const errors = validationResult(req)

			if (!errors.isEmpty()) {
				return res.status(BAD_REQUEST).json({ message: 'Incorrect brand name' })
			}
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

	async getOneById(req, res) {
		try {
			const { id } = req.params
			const brand = await Brand.findOne({ where: { id } })
			return res.status(OK).json(brand)
		} catch (e) {
			return res
				.status(BAD_REQUEST)
				.json({ message: 'Failed to get brand', cause: e.message })
		}
	}
}

export default new BrandController()
