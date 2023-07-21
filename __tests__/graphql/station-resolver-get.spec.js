import { exec } from 'child_process'
import { graphql } from 'graphql'
import { sequelize } from '../../src/utilities/Database.js'
import { schema } from '../../src/graphql/schema.js'
// Test helpers
import {
  buildContext
} from '../TestHelpers.js'

describe('StationResolver - Get - Test suite.', () => {
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

  test('get: It can get an existing station from database.', async () => {
    const query = `{
      station (id: 1) {
        id
      }
    }`

    const context = buildContext()
    const result = await graphql({
      schema,
      source: query,
      contextValue: context
    })

    expect(result.data.station.id).toBe(1)
  })

  test('get: It should return null, if the station isn\'t found with supplied identification number.', async () => {
    const query = `{
      station (id: 685) {
        id
      }
    }`

    const context = buildContext()
    const result = await graphql({
      schema,
      source: query,
      contextValue: context
    })
    expect(result.data.station).toBe(null)
  })
})
