import { Brand } from './Brand'
import { Device } from './Device'
import { Type } from './Type'
import { User } from './User'
import { Basket } from './Basket'
import { BasketDevice } from './BasketDevice'
import { Rating } from './Rating'
import { DeviceInfo } from './DeviceInfo'

// Description of relationships between entities

User.hasOne(Basket)
Basket.belongsTo(User)

User.hasMany(Rating)
Rating.belongsTo(User)

Basket.hasMany(BasketDevice)
BasketDevice.belongsTo(Basket)

Type.hasMany(Device)
Device.belongsTo(Type)

Brand.hasMany(Device)
Device.belongsTo(Brand)

Device.hasMany(Rating)
Rating.belongsTo(Device)

Device.hasMany(BasketDevice)
BasketDevice.belongsTo(Device)

Device.hasMany(DeviceInfo, { as: 'info' })
DeviceInfo.belongsTo(Device)

// Helper table for many-to-many relationship between Brand and Type

export const TypeBrand = sequelize.define('type_brand', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
})

Type.belongsToMany(Brand, { through: TypeBrand })
Brand.belongsToMany(Type, { through: TypeBrand })

export default {
	Brand,
	Device,
	Type,
	User,
	Basket,
	BasketDevice,
	Rating,
	DeviceInfo,
    TypeBrand
}
