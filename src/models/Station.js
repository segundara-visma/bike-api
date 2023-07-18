// Vendors
import { DataTypes } from 'sequelize'
// Sequelize instance
import {sequelize} from '../utilities/Database.js'
// Models
import {Trip} from './Trip.js'

const Station = sequelize.define('stations',
  {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255)
    },
    address: {
      type: DataTypes.STRING(255)
    },
    city: {
      type: DataTypes.STRING(255)
    },
    operator: {
      type: DataTypes.STRING(255)
    },
    capacity: {
      type: DataTypes.INTEGER(11)
    },
    xCoord: {
      type: DataTypes.DOUBLE
    },
    yCoord: {
      type: DataTypes.DOUBLE
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    modifiedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    underscored: true,
    paranoid: true,           // Soft delete.
    timestamps: true,         // Must be true if there is soft delete (paranoid).
    createdAt: 'created_at',  // Custom names for timestamp fields.
    updatedAt: 'modified_at',
    deletedAt: 'deleted_at',
    tableName: 'stations'
  })

Station.hasMany(Trip, {
  as: 'departureTrips',
  foreignKey: 'departure_station_id'
})
Trip.belongsTo(Station, { foreignKey: 'departure_station_id', as: 'departureTrips', onDelete: 'CASCADE' })

Station.hasMany(Trip, {
  as: 'returnTrips',
  foreignKey: 'return_station_id'
})
Trip.belongsTo(Station, { foreignKey: 'return_station_id', as: 'returnTrips', onDelete: 'CASCADE' })

export {Station}
