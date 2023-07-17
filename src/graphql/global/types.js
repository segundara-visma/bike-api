// Vendor
import {
  GraphQLInt,
  GraphQLList,
  GraphQLFloat,
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLObjectType,
  GraphQLInputObjectType
} from 'graphql'

const ResultOrderDirection = new GraphQLEnumType({
  name: 'ResultOrderDirectionType',
  description: 'Order direction used when querying results',
  values: {
    asc: { value: 'ASC' },
    desc: { value: 'DESC' }
  }
})

const ResultInfo = new GraphQLObjectType({
  name: 'ResultInfo',
  description: 'Contains information of the ran search query.',
  fields: () => ({
    totalResults: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Result count without any limitations.'
    },
    page: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Result page / offset.'
    },
    pageSize: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Result limit page.'
    }
  })
})

const SearchResultConfigType = new GraphQLInputObjectType({
  name: 'SearchResultConfigType',
  description: 'Global search options for pagination and sorting.',
  fields: () => ({
    page: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Offset of pagination.'
    },
    pageSize: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Maximum number of records returned.'
    },
    orderDirection: {
      type: new GraphQLNonNull(ResultOrderDirection),
      description: 'Sorting direction. Values \'asc\' or \'desc\'. Notice that the value is in lowercase.'
    },
    orderBy: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Field used to sort the result.'
    },
    output: {
      type: GraphQLString,
      description: 'Valid output value is csv.'
    },
    groupBy: {
      type: GraphQLBoolean,
      description: 'This is needed for license model. To determine if the response is expected to be grouped or not'
    }
  })
})

const SearchResultConfigTypeConstructor = function (pagination = true, ordering = true, outputVariants = true, grouping = false) {
  const fields = {}
  if (pagination) {
    fields.page = {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Offset of pagination.'
    }
    fields.pageSize = {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Maximum number of records returned.'
    }
  }

  if (ordering) {
    fields.orderDirection = {
      type: new GraphQLNonNull(ResultOrderDirection),
      description: 'Sorting direction. Values \'asc\' or \'desc\'. Notice that the value is in lowercase.'
    }

    fields.orderBy = {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Field used to sort the result.'
    }
  }

  if (outputVariants) {
    fields.output = {
      type: GraphQLString,
      description: 'Valid output value is csv and excel. If this if left out the output will be JSON.'
    }
  }

  if (grouping) {
    fields.groupBy = {
      type: GraphQLString,
      description: 'Group by value.'
    }

    // fields.groupByPrecion = {
    //   type: GraphQLString,
    //   description: 'Sometimes there might be a need for a further specification for group option.'
    // }
  }

  return new GraphQLInputObjectType({
    name: 'SearchResultConfigTypeV2',
    description: 'Global search options for pagination and sorting.',
    fields: () => (fields)
  })
}

const ProcessMessageType = new GraphQLObjectType({
  name: 'ProcessMessageType',
  description: '',
  fields: () => ({
    status: {
      type: new GraphQLNonNull(GraphQLString),
      description: ''
    },
    body: {
      type: GraphQLString,
      description: ''
    }
  })
})

const ProcessProgressType = new GraphQLObjectType({
  name: 'ProcessProgressType',
  description: '',
  fields: () => ({
    current: {
      type: new GraphQLNonNull(GraphQLInt),
      description: ''
    },
    total: {
      type: new GraphQLNonNull(GraphQLInt),
      description: ''
    },
    percentage: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: ''
    }
  })
})

const ProcessStatusType = new GraphQLObjectType({
  name: 'ProcessStatusType',
  description: '',
  fields: () => ({
    pid: {
      type: new GraphQLNonNull(GraphQLString),
      description: ''
    },
    status: {
      type: new GraphQLNonNull(GraphQLString),
      description: ''
    },
    progress: {
      type: new GraphQLNonNull(ProcessProgressType),
      description: ''
    },
    messages: {
      type: new GraphQLList(ProcessMessageType),
      description: ''
    }
  })
})

const ExportResponseType = new GraphQLObjectType({
  name: 'ExportResponseType',
  description: 'Used when export is requested from the server.',
  fields: () => ({
    url: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Download link of the export file.'
    },
    filename: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Name of the file including extension.'
    },
    extension: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Extension of the file.'
    }
  })
})

const DatetimeRangeInputType = new GraphQLInputObjectType({
  name: 'DatetimeRangeInputType',
  description: 'Type forming timespan where both fields are required.',
  fields: () => ({
    start: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Datetime string (Format YYYY-MM-DD HH:ii).'
    },
    end: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Datetime string (Format YYYY-MM-DD HH:ii).'
    }
  })
})

const DateRangeInputType = new GraphQLInputObjectType({
  name: 'DateRangeInputType',
  description: 'Type forming timespan where both fields are required.',
  fields: () => ({
    start: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Date string (Format YYYY-MM-DD).'
    },
    end: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Date string (Format YYYY-MM-DD).'
    }
  })
})

export {
  ResultInfo,
  ProcessStatusType,
  ExportResponseType,
  DateRangeInputType,
  DatetimeRangeInputType,
  SearchResultConfigType,
  SearchResultConfigTypeConstructor
}
