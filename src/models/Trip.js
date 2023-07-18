// Vendors
import { DataTypes } from 'sequelize'
// Sequelize instance
import {sequelize} from '../utilities/Database.js'

const Trip = sequelize.define('trips',
  {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    departure: {
      type: DataTypes.DATE,
      allowNull: true
    },
    return: {
      type: DataTypes.DATE,
      allowNull: true
    },
    departureStationName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    departureStationId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    returnStationName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    returnStationId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    coveredDistance: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    duration: {
      type: DataTypes.INTEGER(11),
      allowNull: true
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
    tableName: 'trips'
  })

export {Trip}
