import { exec } from 'child_process'
import { graphql } from 'graphql'
import { sequelize } from '../../src/utilities/Database.js'
import { schema } from '../../src/graphql/schema.js'
// Model(s)
import { Station } from '../../src/models/Station.js'
// Test helpers
import {
  deepClone,
  buildContext,
  isSortedByStringAscending
} from '../TestHelpers.js'

// Fixtures
import {
  defaultStationSearchArgs as defaultSearchArgs,
  defaultStationSearchQuery as defaultSearchQuery
} from '../fixtures/station.js'

describe('StationResolver - All - Test suite.', () => {
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

  test('all: It should be able to search stations by id.', async () => {
    const variables = deepClone(defaultSearchArgs)
    variables.search.id = [1]

    const context = buildContext()
    const result = await graphql({
      schema,
      source: defaultSearchQuery,
      contextValue: context,
      variableValues: variables
    })

    // There should be exactly station with id as [1].
    const stations = result.data.stations
    expect(stations).not.toBe(null)
    expect(stations.resultInfo.totalResults).toBe(variables.search.id.length)
    expect(stations.items.length).toBe(variables.search.id.length)
    expect(stations.items[0].id).toBe(variables.search.id[0])
  })

  test('all: It should be able to search stations by name.', async () => {
    const variables = deepClone(defaultSearchArgs)
    variables.search.keywords = 'Testing name 1'
    const context = buildContext()
    const result = await graphql({
      schema,
      source: defaultSearchQuery,
      contextValue: context,
      variableValues: variables
    })

    const stations = result.data.stations
    // There should be exactly station with name as 'Testing name 1'.
    expect(stations).not.toBe(null)
    expect(stations.resultInfo.totalResults).toBe(1)
    expect(stations.items.length).toBe(1)
    expect(stations.items[0].name).toBe(variables.search.keywords)
  })

  test('all: It should return all stations if the requested page size is 0.', async () => {
    const variables = deepClone(defaultSearchArgs)
    variables.config.pageSize = 0
    // Get total count of stations.
    const itemCount = await Station.count()
    const context = buildContext()
    const result = await graphql({
      schema,
      source: defaultSearchQuery,
      contextValue: context,
      variableValues: variables
    })

    const stations = result.data.stations
    // There should be at least one item.
    expect(stations.items.length).toBeGreaterThan(1)
    expect(stations.items.length).toBe(itemCount)
  })

  test('all: It should return stations sorted by name.', async () => {
    const variables = deepClone(defaultSearchArgs)
    variables.config.orderBy = 'name'
    const context = buildContext()
    const result = await graphql({
      schema,
      source: defaultSearchQuery,
      contextValue: context,
      variableValues: variables
    })

    const stations = result.data.stations
    // There should be at least one item.
    expect(stations.items.length).toBeGreaterThan(1)
    // Check that the items are sorted by name.
    expect(isSortedByStringAscending(stations.items, 'name')).toBe(true)
  })

  test('all: It should paginate.', async () => {
    const context = buildContext()
    const variables = deepClone(defaultSearchArgs)
    // Get total count of stations.
    const itemCount = await Station.count()
    // Fetch the first page.
    variables.config.pageSize = 1
    let result = await graphql({
      schema,
      source: defaultSearchQuery,
      contextValue: context,
      variableValues: variables
    })
    let stations = result.data.stations
    // There should be one item.
    expect(stations.items.length).toBe(1)
    // ...fetch the last page.
    variables.config.page = itemCount - 1
    result = await graphql({
      schema,
      source: defaultSearchQuery,
      contextValue: context,
      variableValues: variables
    })
    stations = result.data.stations
    // ...and the last page should have one item.
    expect(stations.items.length).toBe(1)
  })
})
