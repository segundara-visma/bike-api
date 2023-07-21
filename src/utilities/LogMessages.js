/**
 * Fake translator function to get error codes to be included in the scan made with i18next-scanner package.
 * @param {string} msg
 */
function __ (msg) {
  return msg
}

export default {
  PAGE_NOT_FOUND: {
    code: 'PAGE_NOT_FOUND',
    log: 'The page was not found.',
    clientMsg: __('system.404.clientMsg'),
    clientGuide: __('system.404.clientGuide')
  },

  INVALID_INPUT: {
    code: 'INVALID_INPUT',
    log: 'User tried to do action, but the input was invalid.',
    clientMsg: __('exceptions.invalidInput'),
    clientGuide: null
  },

  INVALID_FILE_TYPE: {
    code: 'INVALID_FILE_TYPE',
    log: 'User tried to upload wrong file type.',
    clientMsg: __('exceptions.invalidFileType', { types: 'csv' }),
    clientGuide: null
  },

  IMPORT_FILE_MISSING_HEADERS: {
    code: 'IMPORT_FILE_MISSING_HEADERS',
    log: 'Some headers are missing in the uploaded file.',
    clientMsg: __('exceptions.missingHeadersImportFile'),
    clientGuide: null
  },

  SQL_ERROR: {
    code: 'SQL_ERROR',
    log: 'There was a problem while trying to execute a query to the database.',
    clientMsg: __('system.fivehundred.clientMsg'),
    clientGuide: __('system.fivehundred.clientGuide')
  },

  STATION_CREATED: {
    code: 'STATION_CREATED',
    log: 'Station created.',
    clientMsg: __('stations.created'),
    clientGuide: null
  },

  TRIP_CREATED: {
    code: 'TRIP_CREATED',
    log: 'Trip created.',
    clientMsg: __('trips.created'),
    clientGuide: null
  }

}
