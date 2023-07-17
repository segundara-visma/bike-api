import { GraphQLString, GraphQLObjectType, GraphQLSchema } from 'graphql'
// Global
import { ProcessStatusType } from './global/types.js'
// Trip
import TripQueries from './trip/queries.js'
import TripMutations from './trip/mutations.js'
// Station
import StationQueries from './station/queries.js'
import StationMutations from './station/mutations.js'
// Utilities / Helpers
import {ProcessHandler} from '../utilities/ProcessHandler.js'

// Pool all queries together
let allQueries = {
  ...TripQueries,
  ...StationQueries,
  importStatus: {
    type: ProcessStatusType,
    description: 'Get a current status of the requested process.',
    args: {
      pid: {
        type: GraphQLString,
        description: 'Process identification number (PID).'
      }
    },
    resolve: (root, { pid }) => {
      return ProcessHandler.get(pid)
    }
  }
}

// Pool all mutations together
let allMutations = {
  ...TripMutations,
  ...StationMutations
}

// Stitch together all the queries.
const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: allQueries
})

const RootMutation = new GraphQLObjectType({
  name: 'RootMutation',
  fields: allMutations
})

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
})

export {schema}
