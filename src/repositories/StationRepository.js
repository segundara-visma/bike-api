import {Station} from '../models/Station.js'

import {Trip} from '../models/Trip.js'

import { literal } from 'sequelize'
import moment from 'moment'
import {Exception} from '../helpers/Exception.js'

export class Repository {
    /**
     * Get product by identification number.
     * @param {Number} id
     * @returns {Object|null}
     */
    static async get (id) {
      const options = {
        where: {
          id
        },
        // paranoid: false,
        include: [
          {
            model: Trip,
            as: 'departureTrips'
          },
          {
            model: Trip,
            as: 'returnTrips'
          }
        ]
      }
  
      const station = await Station.findOne(options)
  
      return station
    }

  static async all (search, config) {
    const where = {}

    // Search by Id(s)
    if (Array.isArray(search.id)) {
      if (search.id.length) {
        where.id = search.id
      }
    }

    if (search.keywords) {
        if (search.keywords) {
          // User can search with multiple keywords by separating them with comma.
          const words = search.keywords.split(',').filter((a) => {
            return a.length >= 2
          })
  
          // Columns to include in keyword search.
          const likeColumns = [
            '`stations`.`name`',
            '`stations`.`city`'
          ]

          const likeConditions = []
          for (const i in likeColumns) {
            for (const j in words) {
              likeConditions.push(
                literal(likeColumns[i] + ' LIKE \'%' + words[j] + '%\'')
              )
            }
          }
          // Add conditions to where object.
          where[Op.and] = [{
            [Op.or]: likeConditions
          }]
        }
    }

    let ordering = null
    switch (config.orderBy) {
    case 'name':
      ordering = 'stations.name'
      break
    case 'city':
      ordering = 'stations.city'
      break
    default:
      ordering = 'stations.id'
      break
    }

    const options = {
      where,
      order: [
        [literal(ordering + ' ' + config.orderDirection)]
      ]
    }

    const totalResults = await Station.count(options)

    if (config.pageSize) {
      if (parseInt(config.pageSize) > 0) {
        options.limit = parseInt(config.pageSize)
        options.offset = parseInt(config.pageSize * config.page)
      }
    }

    const items = await Station.findAll(options)

    return {
      resultInfo: {
        totalResults,
        page: config.page,
        pageSize: config.pageSize
      },
      items
    }
  }

  static async create (input, context) {

    const dbPayload = {
        id: input.id,
        name: input.name,
        address: input.address,
        city: input.city,
        operator: input.operator,
        capacity: input.capacity,
        xCoord: input.xCoord,
        yCoord: input.yCoord
    }
    dbPayload.createdAt = moment().format('YYYY-MM-DD HH:mm')

    let newStation

    try {
      newStation = await Station.create(dbPayload)
    } catch (e) {
      console.log('Errors =', e)
      throw Exception.SQLError(e.errors)
    }

    return {
      id: newStation.id
    }
  }

  static async bulkCreate (input) {
    let stations

    try {
      stations = await Station.bulkCreate(input, {raw: true})
    } catch (e) {
      console.log('Errors =', e)
      throw Exception.SQLError(e.errors)
    }

    return {
      stations
    }
  }
}
