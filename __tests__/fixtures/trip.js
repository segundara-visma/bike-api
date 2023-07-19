export const defaultTripSearchArgs = {
    config: {
      page: 0,
      pageSize: 5,
      orderBy: 'distance',
      orderDirection: 'asc'
    },
    search: {
    }
}

export const defaultTripSearchQuery = `query Trips($config: SearchResultConfigType, $search: TripSearchType) {
    trips(config: $config, search: $search) {
      items {
        id
        coveredDistance
        departure
        departureStationId
        departureStationName
        duration
        return
        returnStationId
        returnStationName
      }
      resultInfo {
        page
        pageSize
        totalResults
      }
    }
}`