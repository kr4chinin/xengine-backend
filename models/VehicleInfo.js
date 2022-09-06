import sequelize from '../db.js'
import { DataTypes } from 'sequelize'

export const VehicleInfo = sequelize.define('vehicle_info', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	title: { type: DataTypes.STRING, allowNull: false },
	description: { type: DataTypes.STRING, allowNull: false }
})