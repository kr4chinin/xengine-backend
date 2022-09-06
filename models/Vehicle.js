import sequelize from '../db.js'
import { DataTypes } from 'sequelize'

export const Vehicle = sequelize.define('vehicle', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	name: { type: DataTypes.STRING, unique: true, allowNull: false },
	price: { type: DataTypes.INTEGER, allowNull: false },
	rating: { type: DataTypes.INTEGER, defaultValue: 0 },
    description: { type: DataTypes.STRING, allowNull: false },
	img: { type: DataTypes.STRING, allowNull: false }
})