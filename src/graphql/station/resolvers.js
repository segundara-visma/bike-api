// Vendors
import moment from 'moment-timezone'
// Models
import {Station} from '../../models/Station.js'

// Helpers & Utilities
import {Exception} from '../../helpers/Exception.js'
import {ProcessHandler} from '../../utilities/ProcessHandler.js'
import {CsvHandler} from '../../utilities/filesystem/handlers/Csv.js'
import { storeFileStream } from '../../utilities/filesystem/NewUpload.js'
// Repositories
import {Repository} from '../../repositories/StationRepository.js'

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const StationResolvers = {
  /**
   * Performs a search which returns products with their publisher, licenses, media, likes and categories.
   * @param {Object} root
   * @param {Object} args
   * @param {Object} context
   */
  get: async (root, { id }, context) => {
    return Repository.get(id)
  },

  /**
   * Performs a search which returns products with their publisher, licenses, media, likes and categories.
   * @param {Object} root
   * @param {Object} args
   * @param {Object} context
   */
  all: async (root, { config, search }, context) => {
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
    const destDir = __dirname + '/../../' + process.env.TEMPORARY_DIR + '/imports/station'
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
      'FID',
      'ID',
      'Nimi',
      'Namn',
      'Name',
      'Osoite',
      'Adress',
      'Kaupunki',
      'Stad',
      'Operaattor',
      'Kapasiteet',
      'x',
      'y'
    ]

    const suppliedHeaders = Object.keys(rows[0])
    const missingHeaders = headers.filter((a) => { return suppliedHeaders.indexOf(a) === -1 })
    if (missingHeaders.length) {
      throw Exception.invalidInput([{ message: context.__('import.missingHeadersImportFile', { headers: missingHeaders.join(',') }) }])
    }

    // After resource is inserted or updated.
    const onSaveSuccess = async (process, msgCode, data) => {
      const item = await Station.findOne({ where: { id: data.id }, attributes: [  'id'  ] })

      process.messages.push({
        status: 'success',
        body: context.__(msgCode, { id: item.id })
      })
    }

    // If the resource save fails.
    const onSaveError = (process, err, rowNo) => {
      err.rowNumber = rowNo
      process.messages.push({
        status: 'error',
        body: context.__('import.onRow', { row: rowNo }) + ': ' + JSON.stringify(err.data)
        // body: JSON.stringify(err.data)
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

        tmpData = {
          id: rows[i]['ID'] ? rows[i]['ID'] : null,
          name: rows[i]['Nimi'] ? rows[i]['Nimi'] : null,
          address: rows[i]['Osoite'] ? rows[i]['Osoite'] : null,
          city: rows[i]['Kaupunki'] ? rows[i]['Kaupunki'] : null,
          operator: rows[i]['Operaattor'] ? rows[i]['Operaattor'] : null,
          capacity: rows[i]['Kapasiteet'] ? rows[i]['Kapasiteet'] : null,
          xCoord: rows[i]['x'] ? rows[i]['x'] : null,
          yCoord: rows[i]['y'] ? rows[i]['y'] : null
        }

        parsedValues.push(tmpData)
      }
      console.log('parsedValues[0] =', parsedValues[0])

      // Update process message with info.
      process.messages.push({
        status: 'info',
        body: context.__(filename + ' Validated. Preparing for import...')
      })
      console.log('rows =', rows.length)
      console.log('parsedValues =', parsedValues.length)

      let row
      let currentRow
      let input
      let item
      ProcessHandler.updateProgress(process.pid, 0, parsedValues.length)
      for (row in parsedValues) {
        input = parsedValues[row]
        item = await Repository.get(input.id)
        currentRow = (parseInt(row) + 1)
        ProcessHandler.updateProgress(process.pid, currentRow, parsedValues.length)
        if (!item) {
          await Repository.create(input, context)
            .then((data) => onSaveSuccess(process, 'stations.created', data))
            .catch((err) => onSaveError(process, err, currentRow))
        }
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

export {StationResolvers}
