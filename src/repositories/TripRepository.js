import {Trip} from '../models/Trip.js'

import { Op, literal } from 'sequelize'
import moment from 'moment'
import {Exception} from '../helpers/Exception.js'

export class Repository {
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
          '`trips`.`departure_station_name`',
          '`trips`.`return_station_name`'
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
    case 'departureStationName':
      ordering = 'trips.departure_station_name'
      break
    case 'returnStationName':
      ordering = 'trips.return_station_name'
      break
    default:
      ordering = 'trips.id'
      break
    }

    const options = {
      where,
      order: [
        [literal(ordering + ' ' + config.orderDirection)]
      ]
    }

    const totalResults = await Trip.count(options)

    if (config.pageSize) {
      if (parseInt(config.pageSize) > 0) {
        options.limit = parseInt(config.pageSize)
        options.offset = parseInt(config.pageSize * config.page)
      }
    }

    const items = await Trip.findAll(options)

    return {
      resultInfo: {
        totalResults,
        page: config.page,
        pageSize: config.pageSize
      },
      items
    }
  }

  static async create (input) {

    const dbPayload = {
      departure: input.departure,
      return: input.return,
      departureStationId: input.departureStationId,
      departureStationName: input.departureStationName,
      returnStationId: input.returnStationId,
      returnStationName: input.returnStationName,
      coveredDistance: input.coveredDistance,
      duration: input.duration
    }
    dbPayload.createdAt = moment().format('YYYY-MM-DD HH:mm')

    let newTrip

    try {
      newTrip = await Trip.create(dbPayload)
    } catch (e) {
      console.log('Errors =', e)
      throw Exception.SQLError(e.errors)
    }

    return {
      id: newTrip.id
    }
  }

  static async bulkCreate (input) {
    let trips

    try {
      trips = await Trip.bulkCreate(input, {raw: true})
    } catch (e) {
      console.log('Errors =', e)
      throw Exception.SQLError(e.errors)
    }

    return {
      trips
    }
  }
}
