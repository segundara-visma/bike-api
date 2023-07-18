import fs from 'fs'
import csvParser from 'fast-csv'

export class CsvHandler {

  _data
  _headers
  _separator

  _filename
  _workingDirectory

  constructor (filename, workingDirectory, separator = ',') {
    this._filename = filename
    this._separator = separator
    this._workingDirectory = workingDirectory
  }

  static isCsv (mimetype) {
    return [
      'text/csv'
    ].indexOf(mimetype) !== -1
  }

  static readFile (path) {
    return new Promise((resolve, reject) => {
      const results = []
      fs.createReadStream(path)
        .pipe(csvParser.parse({ headers: true }))
        .on('error', function (err) {
          reject(err)
        })
        .on('data', (row) => {
          results.push(row)
        })
        .on('end', () => {
          resolve(results)
        })
    })
  }
}
