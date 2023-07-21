import LogMsgs from './LogMessages.js'
const MsgKeys = Object.keys(LogMsgs)
class LogMessageHandler
{
  static get (code) {
    if (MsgKeys.indexOf(code) === -1) {
      throw 'Invalid message code ' + code + '!'
    } else {
      return { ...LogMsgs[code] }
    }
  }

  static getCode (code) {
    if (MsgKeys.indexOf(code) === -1) {
      throw 'Invalid message code ' + code + '!'
    } else {
      return code
    }
  }

  static getLogMsg (code) {
    if (MsgKeys.indexOf(code) === -1) {
      console.log('Invalid message code ' + code + ' !')
      throw 'Invalid message code ' + code + ' !'
    } else {
      return LogMsgs[code].log
    }
  }

  static getStaffMsg (code) {
    if (MsgKeys.indexOf(code) === -1) {
      console.log('Invalid message code ' + code + '!')
      throw 'Invalid message code ' + code + '!'
    } else {
      return LogMsgs[code].staff
    }
  }

  static getClientMsg (code) {
    if (MsgKeys.indexOf(code) === -1) {
      throw 'Invalid message code ' + code + '!'
    } else {
      return LogMsgs[code].clientMsg
    }
  }

  static getClientGuide (code) {
    if (MsgKeys.indexOf(code) === -1) {
      throw 'Invalid message code  ' + code + '!'
    } else {
      return LogMsgs[code].clientGuide
    }
  }
}

export default LogMessageHandler
