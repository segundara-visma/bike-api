// Vendor types
import {
  GraphQLNonNull
} from 'graphql'
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs'
// Resolver
import {TripResolvers} from './resolvers.js'
// Custom types
import { ProcessStatusType } from '../global/types.js'

// Mutations
export default {
  /**
   * TODO
   */
  csvImportTrips: {
    type: ProcessStatusType,
    description: '',
    args: {
      file: {
        type: new GraphQLNonNull(GraphQLUpload)
      }
    },
    resolve: TripResolvers.csvImport
  }
}
