/**
 * This is a workaround which can easily be imported into
 * setupActions.js for use in es6 module which this project
 * is built upon.
 */
const util = require('util')
const exec = util.promisify(require('child_process').exec)

exports.exec = exec