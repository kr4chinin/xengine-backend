import sequelize from '../db.js'
import { DataTypes } from 'sequelize'

export const Brand = sequelize.define('brand', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	name: { type: DataTypes.STRING, unique: true, allowNull: false }
})
