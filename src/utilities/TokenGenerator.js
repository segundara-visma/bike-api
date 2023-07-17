import crypto from 'crypto'
import bcrypt from 'bcryptjs'

/**
 * Wrapper class for unifying packages like crypto and uuid.
 * @constructor
 */
export class TokenGenerator
{
  /**
   * Creates sha256 HMAC using crypto based on supplied data and key.
   *
   * @param {*} data Supplie that gets stringified to JSON.
   * @param {String} key Used to hash JSON-string.
   */
  static hmacSha256 (data, key) {
    const hmac = crypto.createHmac('sha256', key)
    hmac.update(JSON.stringify(data))
    return hmac.digest('hex')
  }


  static md5 (str) {
    return crypto.createHash('md5').update(str).digest('hex')
  }

  /**
   * Hashes supplied string using bcryptjs.
   *
   * @param {String} str String to hash.
   * @param {Number} salt Salt length to generate or salt to use
   * @returns {String}
   */
  static async bcryptHash (str, salt = 10) {
    return await bcrypt.hash(str, salt)
  }

  /**
   * Generates uuidv4-token.
   *
   * @returns {String} The generated uuid.
   */
  static uuidv4 () {
    return crypto.randomUUID()
  }

  /**
   * Generates a random integer between 0 and supplied maximum.
   *
   * @param {Number} max Maximum value for the random integer.
   * @returns {Number}
   */
  static randomInt (max) {
    return crypto.randomInt(max)
  }

  /**
   * Generates a random string of supplied length.
   *
   * @param {Number} length Length of the output string.
   * @returns {String}
   */
  static randomString (length) {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
      result += characters.charAt(TokenGenerator.randomInt(charactersLength))
    }
    return result
  }

  /**
   * Encrypts supplied string using AES-256-CBC.
   *
   * @param {String} str Value to hash.
   * @param {String} hashKey 32-character string used as key.
   * @throws {Error} If hashKey is not 32 characters long.
   * @returns {String}
   */
  static encryptWithAES (str, hashKey) {
    if (hashKey.length !== 32) {
      throw new Error('Hash key must be 32 characters long.')
    }

    const iv = crypto.randomBytes(16).toString('hex').slice(0, 16)

    const encrypter = crypto.createCipheriv('aes-256-cbc', hashKey, iv)

    // Reason for normalize: https://nodejs.org/api/crypto.html#using-strings-as-inputs-to-cryptographic-apis
    let encryptedString = encrypter.update(str.normalize(), 'utf8', 'hex')
    encryptedString += encrypter.final('hex')

    // prepend the IV to the beginning as it is needed when decrypting
    encryptedString = iv + encryptedString

    return encryptedString
  }

  /**
   * Decrypts supplied string using AES-256-CBC.
   *
   * @param {String} str Value to hash.
   * @param {String} hashKey 32 character string used as key.
   * @throws {Error} If hashKey is not 32 characters long.
   * @returns {String}
   */
  static decryptWithAES (str, hashKey) {
    if (hashKey.length !== 32) {
      throw new Error('Hash key must be 32 characters long.')
    }

    const iv = str.substring(0, 16)
    const encryptedString = str.substring(16)
    const decrypter = crypto.createDecipheriv('aes-256-cbc', hashKey, iv)
    let decryptedString = decrypter.update(encryptedString, 'hex', 'utf-8')
    decryptedString += decrypter.final('utf-8')

    return decryptedString
  }
}
