export const defaultStationSearchArgs = {
  config: {
    page: 0,
    pageSize: 5,
    orderBy: 'name',
    orderDirection: 'asc'
  },
  search: {
  }
}

export const defaultStationSearchQuery = `query Stations($config: SearchResultConfigType, $search: StationSearchType) {
  stations(config: $config, search: $search) {
    items {
      id
      name
      address
      xCoord
      yCoord
    }
    resultInfo {
      page
      pageSize
      totalResults
    }
  }
}`