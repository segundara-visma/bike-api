// Vendors
import { DataTypes, Sequelize, Op } from 'sequelize'
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

Station.prototype.departuresFromThisStation = async function (date) {
  const where = {
    departureStationId: this.id
  }
  if(date){
    where.departure = {
      [Op.startsWith]: date
    }
  }
  const tripsStartingFromThisStation = Trip.findAll({
    where: where,
    group: ['returnStationId', 'returnStationName'],
    attributes: ['returnStationId', 'returnStationName',
      [sequelize.fn('COUNT', sequelize.col('return_station_name')), 'count'],
      [sequelize.fn('sum', sequelize.col('covered_distance')), 'total']
    ],
    order: [
      [Sequelize.literal('count'), 'DESC']
    ],
    raw: true
  })

  const alltrips = await tripsStartingFromThisStation

  return {
    mostReturnStations: alltrips.slice(0, 5),
    departureCount: alltrips.reduce((acc, cur) => acc + cur.count, 0),
    departureDistanceSum: alltrips.reduce((acc, cur) => acc + cur.total, 0)
  }
}

Station.prototype.returnsToThisStation = async function (date) {
  const where = {
    returnStationId: this.id
  }
  if(date){
    where.return = {
      [Op.startsWith]: date
    }
  }
  const tripsEndingAtThisStation = Trip.findAll({
    where: where,
    group: ['departureStationId', 'departureStationName'],
    attributes: ['departureStationId', 'departureStationName',
      [sequelize.fn('COUNT', sequelize.col('departure_station_name')), 'count'],
      [sequelize.fn('sum', sequelize.col('covered_distance')), 'total']
    ],
    order: [
      [Sequelize.literal('count'), 'DESC']
    ],
    raw: true
  })

  const alltrips = await tripsEndingAtThisStation

  return {
    mostDepartureStations: alltrips.slice(0, 5),
    returnCount: alltrips.reduce((acc, cur) => acc + cur.count, 0),
    returnDistanceSum: alltrips.reduce((acc, cur) => acc + cur.total, 0)
  }
}

export {Station}
