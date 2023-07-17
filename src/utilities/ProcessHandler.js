// Utilities
import {TokenGenerator} from './TokenGenerator.js'

export class ProcessHandler {

  static _processes = { }

  static start (action, success, error) {
    let pid
    do {
      pid = TokenGenerator.uuidv4()
    } while (ProcessHandler.processExists(pid))

    ProcessHandler._processes[pid] = {
      pid,
      progress: {
        current: 0,
        total: 0,
        percentage: 0
      },
      status: 'running',
      messages: []
    }

    new Promise((resolve, reject) => {
      action(ProcessHandler._processes[pid], resolve, reject)
    })
      .then(success)
      .catch(error)

    return pid
  }

  /**
   *
   * @param {string} pid Process identification number.
   * @param {number} totalDone Update processe's current numerical value
   * @param {number} total Opional. Update processe's maximum numerical value.
   * @returns
   */
  static updateProgress (pid, totalDone, total) {
    // console.log('current =', pid, totalDone, total)
    if (ProcessHandler.processExists(pid)) {
      // Update current progress value
      ProcessHandler._processes[pid].progress.totalDone = totalDone
      ProcessHandler._processes[pid].progress.total = total
      // Calculate current progress percentage value of total.
      ProcessHandler._processes[pid].progress.percentage = totalDone / ProcessHandler._processes[pid].progress.total * 100
      return true
    }
    return false
  }

  /**
   * Helper method to pass a message to the process.
   *
   * @param {Object} process Process that should get the message.
   * @param {String} msg The message.
   * @param {String} status The nature of the message.
   * @param {Number} index The placement of the message in the processe's messages array.
   */
  static passMessage (process, msg, status = 'info', index = null) {
    const message = {
      status,
      body: msg
    }

    if (index !== null && index < process.messages.length) {
      process.messages[index] = message
    } else {
      process.messages.push(message)
    }
  }

  /**
   * Mark process as completed / successful.
   * @param {string} pid Process identification number.
   * @returns {boolean} False, if the process with the supplied id didn't exist.
   */
  static compelete (pid) {
    if (ProcessHandler.processExists(pid)) {
      ProcessHandler._processes[pid].progress.percentage = 100
      ProcessHandler._processes[pid].status = 'compeleted'
      console.log('compeleted!!!!!!!!!!!!!!!')
      return true
    }
    return false
  }

  /**
   * Mark process as completed / successful.
   * @param {string} pid Process identification number.
   * @returns {boolean} False, if the process with the supplied id didn't exist.
   */
  static terminate (pid) {
    if (ProcessHandler.processExists(pid)) {
      ProcessHandler._processes[pid].status = 'terminated'
      return true
    }
    return false
  }

  static processExists (pid) {
    return Object.keys(ProcessHandler._processes).indexOf(pid) !== -1
  }

  /**
   * Mark process as completed / successful.
   * @param {string} pid Process identification number.
   * @returns {boolean} False, if the process with the supplied id didn't exist.
   */
  static get (pid) {
    if (ProcessHandler.processExists(pid)) {
      const process = ProcessHandler._processes[pid]
      return process
    }
    return null
  }

  static getAll () {
    return ProcessHandler._processes
  }
}
