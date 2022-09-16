import { Type } from '../models/Type.js'
import { BAD_REQUEST, OK } from '../utils/Statuses.js'
import { validationResult } from 'express-validator'

class TypeController {
	async create(req, res) {
		try {
			// Checking validation result
			const errors = validationResult(req)

			if (!errors.isEmpty()) {
				return res.status(BAD_REQUEST).json({ message: 'Incorrect type name' })
			}

			const { name } = req.body
			const type = await Type.create({ name })
			return res.status(OK).json(type)
		} catch (e) {
			return res
				.status(BAD_REQUEST)
				.json({ message: 'Failed to create a new type', cause: e.message })
		}
	}

	async getOneById(req, res) {
		try {
			const { id } = req.params
			const type = await Type.findOne({ where: { id } })
			return res.status(OK).json(type)
		} catch (e) {
			return res

				.status(BAD_REQUEST)
				.json({ message: 'Failed to get type', cause: e.message })
		}
	}

	async getAll(_, res) {
		try {
			const types = await Type.findAll()
			return res.status(OK).json(types)
		} catch (e) {
			return res
				.status(BAD_REQUEST)
				.json({ message: 'Failed to get all types', cause: e.message })
		}
	}
}

export default new TypeController()
