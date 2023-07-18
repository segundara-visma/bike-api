// Vendors
import moment from 'moment-timezone'
// Helpers & Utilities
import {Exception} from '../../helpers/Exception.js'
import {ProcessHandler} from '../../utilities/ProcessHandler.js'
import {CsvHandler} from '../../utilities/filesystem/handlers/Csv.js'
import { storeFileStream } from '../../utilities/filesystem/NewUpload.js'
// Repositories
import {Repository} from '../../repositories/TripRepository.js'

const TripResolvers = {/**
   * Performs a search which returns products with their publisher, licenses, media, likes and categories.
   * @param {Object} root
   * @param {Object} args
   */
  all: async (root, { config, search }) => {
    return Repository.all(search, config)
  },

  /**
   * @param {Object} root
   * @param {Object} args
   * @param {Object} context
   */
  csvImport: async (root, { file }, context) => {
    const { filename, mimetype, createReadStream } = await file
    console.log('filename =', filename)
    // Check that the file is either csv or excel.
    if (!CsvHandler.isCsv(mimetype)) {
      throw Exception.invalidInput([{ message: context.__('filesystem.invalidFileType', { types: 'csv' }) }])
    }

    const stream = createReadStream()
    // Store the uploaded import file.
    const prefix = moment().format('YYYYMMDD_HHmmss')
    const destDir = process.env.TEMPORARY_DIR + '/imports/trip'
    const uploadedPath = await storeFileStream(stream, filename, destDir, prefix)

    let rows
    if (CsvHandler.isCsv(mimetype)) {
      rows = await CsvHandler.readFile(uploadedPath)
    }

    // Check parsed file
    if (!Array.isArray(rows)) {
      throw Exception.invalidInput([{ message: context.__('import.couldntProcessImportFile') }])
    } else if (rows.length === 0) {
      throw Exception.invalidInput([{ message: context.__('import.thereAreNoDataRowsImportFile') }])
    }

    const headers = [
      'Departure',
      'Return',
      'Departure station id',
      'Departure station name',
      'Return station id',
      'Return station name',
      'Covered distance (m)'
    ]

    const suppliedHeaders = Object.keys(rows[0])
    const missingHeaders = headers.filter((a) => { return suppliedHeaders.indexOf(a) === -1 })
    if (missingHeaders.length) {
      throw Exception.invalidInput([{ message: context.__('import.missingHeadersImportFile', { headers: missingHeaders.join(',') }) }])
    }

    // After resource is inserted or updated.
    const onSaveSuccess = async (process, msgCode, data) => {
      process.messages.push({
        status: 'success',
        body: context.__(msgCode, { data: data.trips.length })
      })
    }

    // If the resource save fails.
    const onSaveError = (process, err) => {
      process.messages.push({
        status: 'error',
        body: JSON.stringify(err.data)
      })
      return true
    }

    const action = async (process, resolve) => {
      let i, tmpData = {}

      process.messages[0] = {
        status: 'info',
        body: context.__('import.started')
      }

      const parsedValues = []

      for (i in rows) {

        if (rows[i]['Covered distance (m)'] < 10 || rows[i]['Duration (sec.)'] < 10) {
        // Update process message with error.
          process.messages.push({
            status: 'error',
            body: context.__('validations.import.rowDistanceOrDurationIsTooSmall', { rowNum: (parseInt(i) + 1) })
          })
          continue
        }

        tmpData = {
          departure: rows[i]['Departure'] ? rows[i]['Departure'] : null,
          return: rows[i]['Return'] ? rows[i]['Return'] : null,
          departureStationId: rows[i]['Departure station id'] ? rows[i]['Departure station id'] : null,
          departureStationName: rows[i]['Departure station name'] ? rows[i]['Departure station name'] : null,
          returnStationId: rows[i]['Return station id'] ? rows[i]['Return station id'] : null,
          returnStationName: rows[i]['Return station name'] ? rows[i]['Return station name'] : null,
          coveredDistance: rows[i]['Covered distance (m)'] ? rows[i]['Covered distance (m)'] : null,
          duration: rows[i]['Duration (sec.)'] ? rows[i]['Duration (sec.)'] : null
        }

        parsedValues.push(tmpData)
      }

      // Update process message with info.
      process.messages.push({
        status: 'info',
        body: context.__(filename + ' Validated. Preparing for import...')
      })

      const chunkSize = 1000
      let successLen = 0

      ProcessHandler.updateProgress(process.pid, 0, parsedValues.length)
      for (let i = 0; i < parsedValues.length; i += chunkSize) {
        const chunk = parsedValues.slice(i, i + chunkSize)
        const currentBatch = successLen + chunk.length
        ProcessHandler.updateProgress(process.pid, currentBatch, parsedValues.length)
        await Repository.bulkCreate(chunk)
          .then((data) => onSaveSuccess(process, 'trips.created', data))
          .catch((err) => onSaveError(process, err))

        successLen += chunk.length
      }

      resolve(process)
    }

    const success = (p) => {
      p.messages.push({
        status: 'info',
        body: context.__('import.completed')
      })
      ProcessHandler.compelete(p.pid)
    }

    const error = (p) => {
      p.messages.push({
        status: 'error',
        body: context.__('import.errorTerminate')
      })
      ProcessHandler.terminate(p.pid)
    }

    const pid = ProcessHandler.start(action, success, error)

    return ProcessHandler.get(pid)
  }
}

export {TripResolvers}
