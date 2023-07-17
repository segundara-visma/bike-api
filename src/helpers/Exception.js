export class Exception {

  /**
 * We need to call a function that takes in translateable
 * code for i18next-scanner to be able to pick it up.
 * Since the class doesn't have an actual translator, we need to fake it.
 * @param {String} str
 * @returns String
 */
  static __ (str) {
    return str
  }

  static invalidInput (errors, code = 422) {
    const error = new Error(Exception.__('exceptions.invalidInput'))
    error.data = errors
    error.code = code
    return error
  }

  static notAuthorized (errors) {
    const error = new Error(Exception.__('exceptions.notAuthorizedAction'))
    if (errors) {
      error.data = errors
    }
    error.code = 403
    return error
  }

  static notFound () {
    const error = new Error(Exception.__('exceptions.notFound'))
    error.code = 404
    return error
  }

  static systemError (errors) {
    const error = new Error('')
    error.data = errors
    error.code = 500
    return error
  }

  static SQLError (errors) {
    const error = new Error(Exception.__('exceptions.sqlError'))
    error.data = [{ message: errors[0].message }]
    error.code = 500
    return error
  }
}
