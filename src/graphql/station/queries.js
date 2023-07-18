// Vendor types
import { GraphQLInt } from 'graphql'
// Custom types
import { SearchResultConfigType } from '../global/types.js'
import {
  StationType,
  StationSearchType,
  StationSearchResultResponseType
} from './types.js'
// Resolver
import {StationResolvers} from './resolvers.js'

// Queries
export default {
  /**
   * Get one station by id.
   * @param {Number} id Id of the wanted station.
   */
  station: {
    type: StationType,
    description: '',
    args: {
      id: {
        type: GraphQLInt,
        description: ''
      }
    },
    resolve: StationResolvers.get
  },

  /**
   * Station search query.
   * @param {SearchResultConfigType} config Modifies the search, with pagination, column sorting and output.
   * @param {StationSearchType} search Specific parameters used in station search.
   */
  stations: {
    type: StationSearchResultResponseType,
    description: 'Station search query that responses with search results.',
    args: {
      config: {
        type: SearchResultConfigType,
        description: 'Object that holds information about pagination, sorting and output of the search result.'
      },
      search: {
        type: StationSearchType,
        description: 'Search parameter object'
      }
    },
    resolve: StationResolvers.all
  }
}
