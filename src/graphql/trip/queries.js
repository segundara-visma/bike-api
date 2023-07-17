// Custom types
import { SearchResultConfigType } from '../global/types.js'
import {
  TripSearchType,
  TripSearchResultResponseType
} from './types.js'
// Resolver
import {TripResolvers} from './resolvers.js'

// Queries
export default {
  /**
   * Trip search query.
   * @param {SearchResultConfigType} config Modifies the search, with pagination, column sorting and output.
   * @param {TripSearchType} search Specific parameters used in trip search.
   */
  trips: {
    type: TripSearchResultResponseType,
    description: 'Trip search query that responses with search results.',
    args: {
      config: {
        type: SearchResultConfigType,
        description: 'Object that holds information about pagination, sorting and output of the search result.'
      },
      search: {
        type: TripSearchType,
        description: 'Search parameter object'
      }
    },
    resolve: TripResolvers.all
  }
}
