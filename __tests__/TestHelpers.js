// Vendor(s)
import { Logger } from '../src/utilities/Logger'

/**
 * A helper function to build a context object for the GraphQL resolver tests.
 * The context object contains the audit trail object and the translation function.
 *
 * @returns {Object} The context object.
 */
export const buildContext = function () {
  let auditTrail = new Logger('graphqlAccessLog')
  // Create payload for the audit trail.
  auditTrail.setStickyParams({
    action: 'unit-test',
    type: 'unit-test'
  })

  // Return the whole context.
  return {
    auditTrail,
    __: (str) => str
  }
}

/**
 * Some of the system's methods return an array of GraphQL Error objects.
 * This is a small helper function to parse those errors into a simple array of error objects.
 *
 * @param {Object} result The result object from the GraphQL query.
 * @param {Boolen} verbose Print the supplied result for debugging purposes.
 * @returns {Array} An array of error objects.
 */
export const parseGraphQLErrors = function (result, verbose = false) {
  const errors = []
  if (verbose) {
    console.log(result)
  }

  for (let i in result.errors) {
    const err = result.errors[i]
    for (let j in err.extensions.originalError.data) {
      const ogErr = err.extensions.originalError
      errors.push(ogErr.data[j])
    }
  }

  return errors
}

/**
 * A helper function to check if an array of objects is sorted by a string key in ascending order.
 *
 * @param {Array} arr Array to check.
 * @param {String} key Array's object key to check.
 * @returns {Boolean}
 */
export const isSortedByStringAscending = function (arr, key) {
  for (let i = 1; i < arr.length; i++) {
    if (typeof arr[i][key] === 'undefined') {
      console.log('There is no key: ' + key + ' in the array\'s objects.')
      return false
    }
    const currentStr = arr[i][key]
    const previousStr = arr[i - 1][key]

    if (currentStr.localeCompare(previousStr) < 0) {
      return false
    }
  }
  return true
}

/**
 * A helper function to check if an array of objects is sorted by a string key in descending order.
 *
 * @param {Array} arr Array to check.
 * @param {String} key Array's object key to check.
 * @returns {Boolean}
 */
export const isSortedByStringDescending = function (arr, key) {
  for (let i = 1; i < arr.length; i++) {
    if (typeof arr[i][key] === 'undefined') {
      console.log('There is no key: ' + key + ' in the array\'s objects.')
      return false
    }
    const currentStr = arr[i][key]
    const previousStr = arr[i - 1][key]

    if (currentStr.localeCompare(previousStr) > 0) {
      return false
    }
  }
  return true
}

export const isSortedByDateDescending = function (arr, key) {
  for (let i = 1; i < arr.length; i++) {
    if (typeof arr[i][key] === 'undefined') {
      return false
    }
    if (new Date(arr[i][key]).getTime() > new Date(arr[i - 1][key]).getTime()) {
      return false
    }
  }
  return true
}

export const isSortedByDateAscending = function (arr, key) {
  for (let i = 1; i < arr.length; i++) {
    if (typeof arr[i][key] === 'undefined') {
      return false
    }
    if (new Date(arr[i][key]).getTime() < new Date(arr[i - 1][key]).getTime()) {
      return false
    }
  }
  return true
}

export const isSortedAscending = function (arr, key) {
  for (let i = 1; i < arr.length; i++) {
    if (typeof arr[i][key] === 'undefined') {
      return false
    }

    if (arr[i][key] < arr[i - 1][key]) {
      return false
    }

  }
  return true
}

export const isSortedDescending = function (arr, key) {
  for (let i = 1; i < arr.length; i++) {
    if (typeof arr[i][key] === 'undefined') {
      return false
    }
    if (arr[i][key] > arr[i - 1][key]) {
      return false
    }
  }
  return true
}

/**
 * Deep clones an object recursively.
 * @param {Object} obj The object to clone.
 * @returns {Object} The cloned object.
 */
export const deepClone = function (obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  const clone = Object.assign({}, obj)
  Object.keys(clone).forEach(
    key => (clone[key] = deepClone(clone[key]))
  )

  if (Array.isArray(obj)) {
    clone.length = obj.length
    return Array.from(clone)
  }

  return clone
}
