import { Rating } from '../models/Rating.js'
import { OK, BAD_REQUEST } from '../utils/Statuses.js'

class RatingController {
	async setRating(req, res) {
		try {
			const { vehicleId, userId, rate } = req.body

			// Check if user has already rated this vehicle
			const ratingExists = await Rating.findOne({
				where: { vehicleId, userId }
			})

			if (ratingExists) {
                // Update exsisting rating
				await ratingExists.update({ rate: Number(rate) })
				return res.status(OK).json(ratingExists)
			}

			// Set rating
			const newRating = await Rating.create({
				vehicleId,
				userId,
				rate: Number(rate)
			})

			return res.status(OK).json(newRating)
		} catch (e) {
			return res.status(BAD_REQUEST).json({ message: 'Failed to set rating' })
		}
	}
}

export default new RatingController()
