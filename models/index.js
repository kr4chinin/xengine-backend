import { Brand } from './Brand.js'
import { Vehicle } from './Vehicle.js'
import { Type } from './Type.js'
import { User } from './User.js'
import { Cart } from './Cart.js'
import { CartVehicle } from './CartVehicle.js'
import { Rating } from './Rating.js'
import { VehicleInfo } from './VehicleInfo.js'
import sequelize from '../db.js'
import { DataTypes } from 'sequelize'

// Description of relationships between entities

User.hasOne(Cart)
Cart.belongsTo(User)

User.hasMany(Rating)
Rating.belongsTo(User)

Cart.hasMany(CartVehicle)
CartVehicle.belongsTo(Cart)

Type.hasMany(Vehicle)
Vehicle.belongsTo(Type)

Brand.hasMany(Vehicle)
Vehicle.belongsTo(Brand)

Vehicle.hasMany(Rating)
Rating.belongsTo(Vehicle)

Vehicle.hasMany(CartVehicle)
CartVehicle.belongsTo(Vehicle)

Vehicle.hasMany(VehicleInfo, { as: 'info' })
VehicleInfo.belongsTo(Vehicle)

// Helper table for many-to-many relationship between Brand and Type

export const TypeBrand = sequelize.define('type_brand', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
})

Type.belongsToMany(Brand, { through: TypeBrand })
Brand.belongsToMany(Type, { through: TypeBrand })

export default {
	Brand,
	Vehicle,
	Type,
	User,
	Cart,
	CartVehicle,
	Rating,
	VehicleInfo,
	TypeBrand
}
