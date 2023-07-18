// Vendor
import {
  GraphQLInt,
  GraphQLList,
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInputObjectType
} from 'graphql'

// Global types
import { ResultInfo } from '../global/types.js'

const TripType = new GraphQLObjectType({
  name: 'TripType',
  description: '', // TODO Create description.
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLInt),
      description: ''
    },
    departure: {
      type: GraphQLString
    },
    return: {
      type: GraphQLString
    },
    departureStationId: {
      type: GraphQLInt
    },
    departureStationName: {
      type: GraphQLString
    },
    returnStationId: {
      type: GraphQLInt
    },
    returnStationName: {
      type: GraphQLString
    },
    coveredDistance: {
      type: GraphQLInt
    },
    duration: {
      type: GraphQLInt
    },
    createdAt: {
      allowNull: false,
      type: new GraphQLNonNull(GraphQLString)
    },
    updatedAt: {
      allowNull: true,
      type: new GraphQLNonNull(GraphQLString)
    },
    deletedAt: {
      allowNull: true,
      type: new GraphQLNonNull(GraphQLString)
    }
  })
})

/**
 * Input object that has multiple values which are used when getting all trips. All the fields are optional.
 */
const TripSearchType = new GraphQLInputObjectType({
  name: 'TripSearchType',
  description: '',// TODO Create description.
  fields: () => ({
    id: {
      type: new GraphQLList(GraphQLInt),
      description: 'Identication number(s). This parameter will cause an additional search, that gets prepended to the initial search.'
    },
    keywords: {
      type: GraphQLString,
      description: 'Trip\'s departure-station-name or return-station-name containing the supplied keywords.'
    }
  })
})

/**
 * TODO
 */
const TripSearchResultResponseType = new GraphQLObjectType({
  name: 'TripSearchResultResponseType',
  description: 'Contains info about ran search, and the search result itself.',
  fields: () => ({
    resultInfo: {
      type: new GraphQLNonNull(ResultInfo),
      description: 'Contains info about ran search for example total result count before the page and page size is used in the query.'
    },
    items: {
      type: new GraphQLList(TripType),
      description: 'Search results'
    }
  })
})

export { TripType, TripSearchType, TripSearchResultResponseType }
