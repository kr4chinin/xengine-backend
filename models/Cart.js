import sequelize from '../db.js'
import { DataTypes } from 'sequelize'

export const Cart = sequelize.define('cart', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
})
