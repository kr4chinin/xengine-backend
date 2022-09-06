import * as uuid from 'uuid'
import { Vehicle } from '../models/Vehicle.js'
import { VehicleInfo } from '../models/VehicleInfo.js'
import { ApiError } from '../helpers/apiError.js'
import path from 'path'
import { __dirname } from '../helpers/dirname.js'
import fs from 'fs'

class VehicleController {
	async create(req, res, next) {
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

				next(ApiError.badRequest('Failed to create a vehicle', e.message))
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

			if (vehicle) return res.status(200).json(vehicle)
		} catch (e) {
			next(ApiError.badRequest('Failed to create a vehicle', e.message))
		}
	}

	async getAll(req, res, next) {
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

			return res.status(200).json(vehicles)
		} catch (e) {
			next(ApiError.badRequest('Failed to get vehicles', e.message))
		}
	}

	async getOne(req, res, next) {
		try {
			const { id } = req.params

			const vehicle = await Vehicle.findOne({
				where: { id },
                // including info objects for vehicle (if any) to get them in response
				include: [{ model: VehicleInfo, as: 'info' }]
			})

			return res.status(200).json(vehicle)
		} catch (e) {
			next(ApiError.badRequest('Failed to get vehicle by id', e.message))
		}
	}
}

export default new VehicleController()
