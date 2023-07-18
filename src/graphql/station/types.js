// Vendor
import {
  GraphQLInt,
  GraphQLList,
  GraphQLFloat,
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInputObjectType
} from 'graphql'

// Global types
import { ResultInfo } from '../global/types.js'

const ReturnType = new GraphQLObjectType({
  name: 'ReturnType',
  description: '', // TODO Create description.
  fields: () => ({
    returnStationId: {
      type: new GraphQLNonNull(GraphQLInt),
      description: ''
    },
    returnStationName: {
      type: GraphQLString
    },
    count: {
      type: GraphQLInt
    }
  })
})

const departureType = new GraphQLObjectType({
  name: 'departureType',
  description: '', // TODO Create description.
  fields: () => ({
    departureStationId: {
      type: new GraphQLNonNull(GraphQLInt),
      description: ''
    },
    departureStationName: {
      type: GraphQLString
    },
    count: {
      type: GraphQLInt
    }
  })
})

const StationType = new GraphQLObjectType({
  name: 'StationType',
  description: '', // TODO Create description.
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLInt),
      description: ''
    },
    name: {
      type: GraphQLString
    },
    address: {
      type: GraphQLString
    },
    city: {
      type: GraphQLString
    },
    operator: {
      type: GraphQLString
    },
    capacity: {
      type: GraphQLInt
    },
    xCoord: {
      type: GraphQLFloat
    },
    yCoord: {
      type: GraphQLFloat
    },
    mostReturn: {
      type: new GraphQLList(ReturnType)
    },
    mostDeparture: {
      type: new GraphQLList(departureType)
    },
    returnCount: {
      type: GraphQLInt
    },
    departureCount: {
      type: GraphQLInt
    },
    departureDistanceSum: {
      type: GraphQLInt
    },
    returnDistanceSum: {
      type: GraphQLInt
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLString)
    },
    updatedAt: {
      type: new GraphQLNonNull(GraphQLString)
    }
  })
})

/**
 * Input object that has multiple values which are used when getting all stations. All the fields are optional.
 */
const StationSearchType = new GraphQLInputObjectType({
  name: 'StationSearchType',
  description: '',// TODO Create description.
  fields: () => ({
    id: {
      type: new GraphQLList(GraphQLInt),
      description: 'Identication number(s). This parameter will cause an additional search, that gets prepended to the initial search.'
    },
    keywords: {
      type: GraphQLString,
      description: 'Station\'s departure-station-name or return-station-name containing the supplied keywords.'
    }
  })
})

/**
 * TODO
 */
const StationSearchResultResponseType = new GraphQLObjectType({
  name: 'StationSearchResultResponseType',
  description: 'Contains info about ran search, and the search result itself.',
  fields: () => ({
    resultInfo: {
      type: new GraphQLNonNull(ResultInfo),
      description: 'Contains info about ran search for example total result count before the page and page size is used in the query.'
    },
    items: {
      type: new GraphQLList(StationType),
      description: 'Search results'
    }
  })
})

export { StationType, StationSearchType, StationSearchResultResponseType }
