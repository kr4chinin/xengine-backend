import sequelize from '../db.js'
import { DataTypes } from 'sequelize'

export const Rating = sequelize.define('rating', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	rate: { type: DataTypes.INTEGER, allowNull: false }
})
