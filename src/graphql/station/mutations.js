// Vendor types
import {
  GraphQLNonNull
} from 'graphql'
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs'
// Resolver
import {StationResolvers} from './resolvers.js'
// Custom types
import { ProcessStatusType } from '../global/types.js'

// Mutations
export default {
  /**
   *
   */
  csvImportStations: {
    type: ProcessStatusType,
    description: '',
    args: {
      file: {
        type: new GraphQLNonNull(GraphQLUpload)
      }
    },
    resolve: StationResolvers.csvImport
  }
}
