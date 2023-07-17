import fs from 'fs'
// Vendors
import moment from 'moment'
import bunyan from 'bunyan'
import path from 'path'
// Utilities
import {TokenGenerator} from './TokenGenerator.js'
// Different loggers available in the app.
import LogContexes from '../config/logs.js'

/**
 * @constructor
 */
class Logger
{
  // Key to mixin while creating tokens for the log entries.
  _key
  // Bunyan object used for doing the actual logging.
  _logger
  // Helps to distinquish where the log entry is coming from.
  _context
  // Groups many log entries. Helps to track, for example the users process.
  _sessionId

  // TODO Explain purpose.
  _stickyParams

  static logStoragePath (filename) {
    let p = process.env.LOG_STORAGE_PATH

    if (filename) {
      p += path.sep + filename
    }

    return p
  }

  constructor (context, sessionId = null) {
    this._stickyParams = {}
    // Used to generate random token for a log entry.
    this._key = process.env.LOGGER_KEY
    // Decide name of the bunyan instance and log-file where the log entries are written to.
    const contexes = Object.keys(LogContexes)
    if (contexes.indexOf(context) === -1) {
      throw new Error('Invalid log context ' + context + '. Available contexes are: ' + contexes.join(',') + '.')
    }

    // Path of the log file.
    const p = process.env.LOG_STORAGE_PATH + path.sep + LogContexes[context].filename

    try {
      fs.accessSync(p, fs.constants.R_OK | fs.constants.W_OK)
    } catch (err) {
      fs.open(p, 'wx+', function (err, fd) {
        if (err) {
          throw err
        }
        fs.fchmod(fd, 0o777, function (err) {
          if (err) {
            throw err
          }
        })
      })
    }

    // Create Bunyan logger instance.
    this._logger = bunyan.createLogger({
      name: LogContexes[context].name,
      streams: [
        {
          type: 'file',
          level: 'debug',
          path: p
        }
      ]
    })

    // Finally create session id which is used through out the logging.
    if (!sessionId) {
      sessionId = TokenGenerator.hmacSha256({ uuid: TokenGenerator.uuidv4(), time: moment().unix() }, this._key)
    }

    this._sessionId = sessionId
  }

  getLoggerService () {
    return this._logger
  }

  /**
   * Set parameters that will be included in every log entry.
   * @param {object} parameters Object containing the parameters.
   */
  setStickyParams (parameters) {
    this._stickyParams = parameters
  }

  /**
   * Update previously set parameters (using Object.assign) that will be included in every log entry.
   * Keys that are already set gets overwritten by the supplied object's keys.
   * Otherwise new key will be added to sticky parameters.
   *
   * NOTICE: The method doesn't assign keys recursively.
   * @param {object} parameters Object containing the new and updated parameters.
   */
  updateStickyParameters (parameters) {
    this._stickyParams = Object.assign(this._stickyParams, parameters)
  }

  /**
   * Writes debug entry to the logs
   * @param {string} message Descriptive message about what happened.
   * @param {*} payload Parameters / Payload to help search for logs later. For example userId.
   * @return {string} ID for this log entry.
   */
  debug (message, payload) {
    const entryId = this._sessionId
    this._logger.debug({ ...this._stickyParams,  payload, entryId }, message)
    return entryId
  }

  /**
   * Writes info entry to the logs
   * @param {string} message Descriptive message about what happened.
   * @param {*} payload Parameters / Payload to help search for logs later. For example userId.
   * @return {string} ID for this log entry.
   */
  info (message, payload) {
    const entryId = this._sessionId
    this._logger.info({ ...this._stickyParams,  payload, entryId }, message)
    return entryId
  }

  /**
   * Writes error entry to the logs
   * @param {string} message Descriptive message about what happened.
   * @param {*} payload Parameters / Payload to help search for logs later. For example userId.
   * @return {string} ID for this log entry.
   */
  error (message, payload) {
    const entryId = this._sessionId
    this._logger.error({ ...this._stickyParams, payload, entryId }, message)
    return entryId
  }

  /**
   * Writes warn level entry to the logs
   * @param {string} message Descriptive message about what happened.
   * @param {*} payload Parameters / Payload to help search for logs later. For example userId.
   * @return {string} ID for this log entry.
   */
  warn (message, payload) {
    const entryId = this._sessionId
    this._logger.warn({ ...this._stickyParams, payload, entryId }, message)
    return entryId
  }


  /**
   * Writes fatal level entry to the logs.
   * @param {string} message Descriptive message about what happened.
   * @param {*} payload Parameters / Payload to help search for logs later. For example userId.
   * @return {string} ID for this log entry.
   */
  fatal (message, payload) {
    const entryId = this._sessionId
    this._logger.fatal({ ...this._stickyParams, payload, entryId }, message)
    return entryId
  }
}

export {Logger, LogContexes}
