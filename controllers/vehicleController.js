import * as uuid from 'uuid'
import { Vehicle } from '../models/Vehicle.js'
import { VehicleInfo } from '../models/VehicleInfo.js'
import { Rating } from '../models/Rating.js'
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
					.json({ message: 'Failed to create a new vehicle', cause: e.message })
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
				.json({ message: 'Failed to create a new vehicle', cause: e.message })
		}
	}

	async getAll(req, res) {
		try {
			const { brandId, typeId, limit = 1, page = 1, sort = '' } = req.query

			// Calculating offset for pagination
			let offset = page * limit - limit

			let vehicles

			// If brandId and typeId are provided, get vehicles by brandId and typeId
			if (brandId && typeId) {
				// findAndCountAll used for pagination, returns -> {count: number, rows: [data]}
				vehicles = await Vehicle.findAndCountAll({
					where: { brandId, typeId },
					limit,
					offset,
					// sort parameter is used to sort vehicles, sort -> price_DESC, name_ASC etc.
					order: sort ? [[sort.split('_')[0], sort.split('_')[1]]] : []
				})
			}

			// If only brandId is provided, get vehicles by brandId
			if (brandId && !typeId) {
				vehicles = await Vehicle.findAndCountAll({
					where: { brandId },
					limit,
					offset,
					order: sort ? [[sort.split('_')[0], sort.split('_')[1]]] : []
				})
			}

			// If only typeId is provided, get vehicles by typeId
			if (!brandId && typeId) {
				vehicles = await Vehicle.findAndCountAll({
					where: { typeId },
					limit,
					offset,
					order: sort ? [[sort.split('_')[0], sort.split('_')[1]]] : []
				})
			}

			// If neither brandId nor typeId are provided, get all vehicles
			if (!brandId && !typeId) {
				vehicles = await Vehicle.findAndCountAll({
					limit,
					offset,
					order: sort ? [[sort.split('_')[0], sort.split('_')[1]]] : []
				})
			}

			return res.status(OK).json(vehicles)
		} catch (e) {
			return res
				.status(BAD_REQUEST)
				.json({ message: 'Failed to get vehicles', cause: e.message })
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
				.json({ message: 'Failed to get vehicle by id', cause: e.message })
		}
	}

	async getThreeMostPopular(_, res) {
		try {
			const vehicles = await Vehicle.findAll()

			// Sorting vehicles by rating
			let vehiclesRatings = new Map()

			for (let i = 0; i < vehicles.length; i++) {
				let vehicleId = vehicles[i].id

				// Get all ratings from vehicle
				let ratings = await Rating.findAll({ where: { vehicleId } })

				// If vehicle currently has no rates -> set default rate value to 0
				if (ratings.length === 0) {
					ratings = [{ rate: 0 }]
				}

				// Calculate average rating
				const averageRating = Math.round(
					ratings.reduce((acc, rating) => acc + rating.rate, 0) / ratings.length
				)

				vehiclesRatings.set(vehicleId, averageRating)
			}

			// Get 3 most popular vehicles from vehiclesRatings map where key
			// is vehicleId and value is average rating
			const mostPopularVehicles = [...vehiclesRatings.entries()]
				.sort((a, b) => b[1] - a[1])
				.slice(0, 3)

			// Get vehicles by id
			const popularVehiclesById = await Vehicle.findAll({
				where: {
					id: mostPopularVehicles.map(v => v[0])
				}
			})

			return res.status(OK).json(popularVehiclesById)
		} catch (e) {
			return res.status(BAD_REQUEST).json({
				message: 'Failed to get three most popular vehicles',
				cause: e.message
			})
		}
	}

	async deleteVehicle(req, res) {
		try {
			const { vehicleId } = req.body

			// Deleting vehicle by id
			await Vehicle.destroy({ where: { vehicleId } })

			return res.status(OK).json({ message: 'Vehicle deleted successfully' })
		} catch (e) {
			return res
				.status(BAD_REQUEST)
				.json({ message: 'Failed to delete vehicle', cause: e.message })
		}
	}
}

export default new VehicleController()
