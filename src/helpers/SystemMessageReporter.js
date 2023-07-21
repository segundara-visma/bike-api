// Vendor(s)
import { GraphQLError } from 'graphql'
// Utilitie(s) / Helper(s)
import LogMsgs from '../utilities/LogMessages.js'
import LogMsgHandler from '../utilities/LogMessageHandler.js'

export class SystemMessageReporter {

  static error (msgCode, ctx, errObj, payload = {}) {
    const code = LogMsgs[msgCode].code
    const logMsg = LogMsgHandler.getLogMsg(code)

    // If the custom error data is empty, add the default error message based on the error code.
    if (!errObj.data) {
      const clientMsg = ctx.__(LogMsgHandler.getClientMsg(code), payload)
      const clientGuide = ctx.__(LogMsgHandler.getClientGuide(code), payload)
      errObj.data = [{
        message: clientMsg,
        guide: clientGuide,
        code
      }]
    }

    // Send the error to the audit trail.
    ctx.auditTrail.error(logMsg, payload)

    const graphQLError = new GraphQLError(errObj.toString(), {
      extensions: {
        originalError: errObj
      }
    })

    return {
      code,
      logMsg,
      graphQLError
    }
  }

  static invalidInput (ctx, errors, code = 422, payload = {}) {
    const errObj = new Error(ctx.__('exceptions.invalidInput'))
    errObj.data = errors
    errObj.code = code

    return SystemMessageReporter.error(LogMsgs.INVALID_INPUT.code, ctx, errObj, payload)
  }

  static invalidFileType (ctx, errors, code = 422, payload = {}) {
    const errObj = new Error(ctx.__('exceptions.invalidFileType'))
    errObj.data = errors
    errObj.code = code

    return SystemMessageReporter.error(LogMsgs.INVALID_FILE_TYPE.code, ctx, errObj, payload)
  }

  static importFileMissingHeaders (ctx, errors, missingHeaders, code = 422, payload = {}) {
    const errObj = new Error(ctx.__('import.missingHeadersImportFile', { headers: missingHeaders.join(',') }))
    errObj.data = errors
    errObj.code = code

    return SystemMessageReporter.error(LogMsgs.IMPORT_FILE_MISSING_HEADERS.code, ctx, errObj, payload)
  }

  static notFound (ctx) {
    const error = new Error(ctx.__('exceptions.notFound'))
    error.code = 404
    return error
  }

  static systemError (errors) {
    const error = new Error('')
    error.data = errors
    error.code = 500
    return error
  }

  static SQLError (ctx, errors) {
    const errObj = new Error(ctx.__('exceptions.sqlError'))
    errObj.data = [{ message: errors[0].message }]
    errObj.code = 500
    return SystemMessageReporter.error(LogMsgs.SQL_ERROR.code, ctx, errObj, {})
  }
}
