import { exec } from 'child_process'
import { graphql } from 'graphql'
import { sequelize } from '../../src/utilities/Database.js'
import { schema } from '../../src/graphql/schema.js'

import Upload from "graphql-upload/Upload.mjs"

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Test helpers
import {
  buildContext, parseGraphQLErrors
} from '../TestHelpers.js'

describe('StationResolver - CSV IMPORT - Test suite.', () => {
  beforeAll((done) => {
    exec('npm run seed-for-test', (err, stdout, stderr) => {
      if (err) {
        console.log(err)
      }
      done()
    })
  }, 60000)

  // After all tests have finished, close the database connection.
  afterAll(() => {
    sequelize.close()
  })

  test('csvImport: It should return error if the uploaded file has some missing headers on the data.', async () => {

    const context = buildContext()
    const file = fs.createReadStream(path.resolve(__dirname, "../files/stationsWithMissingHeaders.csv"))

    const upload = new Upload();
    const fileUpload = {
      filename: 'stationsWithMissingHeaders.csv',
      mimetype: 'text/csv',
      encoding: "test",
      createReadStream: () => file,
    };
    upload.promise = new Promise((r) => r(fileUpload));
    upload.file = fileUpload;

    const query = `mutation CSVImport($file: Upload!) {
      csvImportStations(file: $file) {
        messages {
          body
          status
        }
        pid
        progress {
          current
          percentage
          total
        }
        status
      }
    }`

    const result = await graphql({
      schema,
      source: query,
      variableValues: {
        file: upload,
      },
      contextValue: context,
    })

    const errors = parseGraphQLErrors(result)

    expect(errors[0].message).toBe('import.missingHeadersImportFile')
  })

  test('csvImport: It should return error if the uploaded file has no data.', async () => {

    const context = buildContext()
    const file = fs.createReadStream(path.resolve(__dirname, "../files/stationsWithEmptyRows.csv"))

    const upload = new Upload();
    const fileUpload = {
      filename: 'stationsWithEmptyRows.csv',
      mimetype: 'text/csv',
      encoding: "test",
      createReadStream: () => file,
    };
    upload.promise = new Promise((r) => r(fileUpload));
    upload.file = fileUpload;

    const query = `mutation CSVImport($file: Upload!) {
      csvImportStations(file: $file) {
        messages {
          body
          status
        }
        pid
        progress {
          current
          percentage
          total
        }
        status
      }
    }`

    const result = await graphql({
      schema,
      source: query,
      variableValues: {
        file: upload,
      },
      contextValue: context,
    })

    const errors = parseGraphQLErrors(result)

    expect(errors[0].message).toBe('import.thereAreNoDataRowsImportFile')
  })

  test('csvImport: It should return error if wrong file type is uploaded.', async () => {

    const context = buildContext()
    const file = fs.createReadStream(path.resolve(__dirname, "../files/pin.jpg"))

    const upload = new Upload();
    const fileUpload = {
      filename: 'pin.jpg',
      mimetype: 'application/jpg',
      encoding: "test",
      createReadStream: () => file,
    };
    upload.promise = new Promise((r) => r(fileUpload));
    upload.file = fileUpload;

    const query = `mutation CSVImport($file: Upload!) {
      csvImportStations(file: $file) {
        messages {
          body
          status
        }
        pid
        progress {
          current
          percentage
          total
        }
        status
      }
    }`

    const result = await graphql({
      schema,
      source: query,
      variableValues: {
        file: upload,
      },
      contextValue: context,
    });

    const errors = parseGraphQLErrors(result)

    expect(errors[0].code).toBe('INVALID_FILE_TYPE')
    expect(errors[0].message).toBe('exceptions.invalidFileType')
  })
})
