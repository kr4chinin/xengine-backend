import sequelize from '../db.js'
import { DataTypes } from 'sequelize'

export const CartVehicle = sequelize.define('cart_vehicle', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
})