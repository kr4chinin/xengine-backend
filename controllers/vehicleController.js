import * as uuid from 'uuid'
import { Vehicle } from '../models/Vehicle.js'
import { VehicleInfo } from '../models/VehicleInfo.js'
import path from 'path'
import { __dirname } from '../helpers/dirname.js'
import fs from 'fs'
import { BAD_REQUEST, OK } from '../utils/Statuses.js'

class VehicleController {
	async create(req, res) {
		try {
			let { name, price, description, brandId, typeId, info } = req.body

			// Getting image from request using express-fileupload
			const { img } = req.files

			// Generating random name for image
			const fileName = uuid.v4() + '.jpg'

			// Saving image to static folder (move to -> ../static/images)
			img.mv(path.resolve(__dirname, '..', 'static', 'images', fileName))

			let vehicle

			try {
				// Creating new vehicle
				vehicle = await Vehicle.create({
					name,
					price,
					description,
					brandId,
					typeId,
					info,
					img: fileName // Saving image name to database, not the exact one
				})
			} catch (e) {
				// Delete image from static folder if error occured while creating vehicle
				// to avoid duplicates
				fs.unlinkSync(
					path.resolve(__dirname, '..', 'static', 'images', fileName)
				)

				return res
					.status(BAD_REQUEST)
					.json({ message: 'Failed to create a new vehicle' })
			}

			// Creating information objects for every vehicle (if info was provided)
			if (info) {
				info = JSON.parse(info)

				// Creating new instance in db for every info object
				info.forEach(i =>
					VehicleInfo.create({
						title: i.title,
						description: i.description,
						vehicleId: vehicle.id
					})
				)
			}

			if (vehicle) return res.status(OK).json(vehicle)
		} catch (e) {
			return res
				.status(BAD_REQUEST)
				.json({ message: 'Failed to create a new vehicle' })
		}
	}

	async getAll(req, res) {
		try {
			const { brandId, typeId, limit = 1, page = 1 } = req.query

			// Calculating offset for pagination
			let offset = page * limit - limit

			let vehicles

			// If brandId and typeId are provided, get vehicles by brandId and typeId
			if (brandId && typeId) {
				// findAndCountAll used for pagination, returns -> {count: number, rows: [data]}
				vehicles = await Vehicle.findAndCountAll({
					where: { brandId, typeId },
					limit,
					offset
				})
			}

			// If only brandId is provided, get vehicles by brandId
			if (brandId && !typeId) {
				vehicles = await Vehicle.findAndCountAll({
					where: { brandId },
					limit,
					offset
				})
			}

			// If only typeId is provided, get vehicles by typeId
			if (!brandId && typeId) {
				vehicles = await Vehicle.findAndCountAll({
					where: { typeId },
					limit,
					offset
				})
			}

			// If neither brandId nor typeId are provided, get all vehicles
			if (!brandId && !typeId) {
				vehicles = await Vehicle.findAndCountAll({ limit, offset })
			}

			return res.status(OK).json(vehicles)
		} catch (e) {
			return res.status(BAD_REQUEST).json({ message: 'Failed to get vehicles' })
		}
	}

	async getOne(req, res) {
		try {
			const { id } = req.params

			const vehicle = await Vehicle.findOne({
				where: { id },
				// including info objects for vehicle (if any) to get them in response
				include: [{ model: VehicleInfo, as: 'info' }]
			})

			return res.status(OK).json(vehicle)
		} catch (e) {
			return res
				.status(BAD_REQUEST)
				.json({ message: 'Failed to get vehicle by id' })
		}
	}
}

export default new VehicleController()
