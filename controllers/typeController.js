import {Type} from '../models/Type.js'
import {ApiError} from '../helpers/ApiError.js'

class TypeController {
    async create(req, res, next) {
		try {
			const { name } = req.body
			const type = await Type.create({ name })
			return res.status(200).json(type)
		} catch (e) {
			return next(ApiError.badRequest('Failed to create new type', e.message))
		}
	}

	async getAll(req, res) {
		try {
			const types = await Type.findAll()
			return res.status(200).json(types)
		} catch (e) {
			next(ApiError.badRequest('Failed to get all types', e.message))
		}
	}
}

export default new TypeController()