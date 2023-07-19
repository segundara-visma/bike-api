import fs from 'fs'
import path from 'path'
import mysql from 'mysql2/promise'
const { exec } = await import('./util/execUtil.js')

let SRC_PATH = process.cwd()
SRC_PATH += process.env.ENVIRONMENT === 'development' ? '/src' : '/dist'

// Custom console to add some color to the messages.
const ColorConsole = await import(SRC_PATH + '/utilities/console/colors.js')

const validateDatabaseConnection = async function () {
  const { sequelize } = await import(SRC_PATH + '/utilities/Database.js')
  try {
    await sequelize.authenticate()
    ColorConsole.success('Database connection has been established successfully.')
    return true
  } catch (error) {
    ColorConsole.success('The database connection couldn\'t be established!')
    console.log(error)
    return false
  }
}

const validateEnviromentVariables = async function () {
  var reqEnv = {
    // Database info that needs to be set.
    'DB_HOST': process.env.RDS_HOSTNAME ? process.env.RDS_HOSTNAME : process.env.DB_HOST,
    'DB_NAME': process.env.DB_NAME,
    'DB_USER': process.env.RDS_USERNAME ? process.env.RDS_USERNAME : process.env.DB_USER,
    'DB_PASSWORD': process.env.RDS_PASSWORD ? process.env.RDS_PASSWORD : process.env.DB_PASSWORD,
    'DB_PORT': process.env.RDS_PORT ? process.env.RDS_PORT : process.env.DB_PORT,
    'DB_DIALECT': process.env.DB_DIALECT,
    // Local file storages.
    'TEMPORARY_DIR': process.env.TEMPORARY_DIR,
    'LOG_STORAGE_PATH': process.env.LOG_STORAGE_PATH,
    'TRANSLATION_DIR' : process.env.TRANSLATION_DIR
  }

  var i
  const errors = []
  for (i in reqEnv) {
    if (typeof reqEnv[i] === 'undefined') {
      errors.push('The environment variable ' + i + ' at .env-file is not set!')
    } else if (!reqEnv[i].length) {
      errors.push('The environment variable ' + i + ' at .env-file is not set!')
    }
  }

  return errors
}

const createLogFiles = async function () {
  ColorConsole.info('Base path of log files:', process.env.LOG_STORAGE_PATH)
  if (typeof process.env.LOG_STORAGE_PATH != 'string') {
    ColorConsole.error('Environment variable LOG_STORAGE_PATH is not set. Please create it to .env-file')
    process.exit(1)
  }

  fs.mkdirSync(process.env.LOG_STORAGE_PATH, { recursive: true })

  var i
  var p
  var onlyPath
  const logs = await import(SRC_PATH + '/config/logs.js')
  const basePath = process.env.LOG_STORAGE_PATH + path.sep
  for (i in logs.default) {
    p = basePath + logs.default[i].filename

    // Create a directory for the log file if it doesn't exist.
    onlyPath = path.dirname(p)
    if (!fs.existsSync(onlyPath)) {
      try {
        fs.mkdirSync(onlyPath, { recursive: true })
        ColorConsole.success('Created a directory: ' + onlyPath)
      } catch (err) {
        ColorConsole.error('Couldn\'t create a required directory: ' + onlyPath)
        ColorConsole.error(err)
      }
    }

    // Create a log file.
    try {
      fs.accessSync(p, fs.constants.R_OK | fs.constants.W_OK)
    } catch (err) {
      fs.openSync(p, 'w+' , 0o777)
      ColorConsole.success('Created a log file: ' + p)
    }
  }
}

const createSequalizeCliConf = function (value = null) {
  // Output path
  const p = SRC_PATH + '/config/sequelize-cli.config.json'
  const onlyPath = path.dirname(p)

  if (!fs.existsSync(onlyPath)) {
    fs.mkdirSync(onlyPath, { recursive: true })
  }

  const dbParams = {
    // Database info that needs to be set.
    DB_HOST: process.env.DB_HOST,
    DB_NAME: value ? value : process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_PORT: process.env.DB_PORT,
    DB_DIALECT: process.env.DB_DIALECT
  }

  var contents = {
    [process.env.ENVIRONMENT]: {
      url: 'mysql://' + dbParams.DB_USER + ':' + dbParams.DB_PASSWORD + '@' + dbParams.DB_HOST + ':' + dbParams.DB_PORT + '/' + dbParams.DB_NAME,
      dialect: dbParams.DB_DIALECT
    }
  }

  ColorConsole.info('Creating ' + p + ' file.')

  fs.writeFileSync(p, JSON.stringify(contents), (err) => {
    if (err) {
      throw err
    }
    ColorConsole.success('Created ' + p)
  })
}

const createTmpDirectories = function () {
  if (typeof process.env.TEMPORARY_DIR != 'string') {
    ColorConsole.error('Environment variable LOG_STORAGE_PATH is not set. Please set it to .env-file!')
    process.exit(1)
  }

  var i
  var p
  // const path = require('path')
  const dirs = [
    'imports/station',
    'imports/trip'
  ]
  const basePath = process.env.TEMPORARY_DIR + path.sep
  for (i in dirs) {
    p = basePath + dirs[i]
    try {
      if (!fs.existsSync(p)){
        fs.mkdirSync(p, { recursive: true })
        ColorConsole.success('Created directory: ' + p)
      } else {
        ColorConsole.info('Directory already exists: ' + p)
      }
    } catch (err) {
      ColorConsole.error('Couldn\'t create: ' + p)
    }
  }

}

/**
 * Creates the database mentioned in environment variable file (.env) if it doesn't already exist.
 */
const createDatabase = async function (value = null) {
  const dbParams = {
    // Database info that needs to be set.
    DB_HOST: process.env.RDS_HOSTNAME ? process.env.RDS_HOSTNAME : process.env.DB_HOST,
    DB_NAME: value ? value : process.env.DB_NAME,
    DB_USER: process.env.RDS_USERNAME ? process.env.RDS_USERNAME : process.env.DB_USER,
    DB_PASSWORD: process.env.RDS_PASSWORD ? process.env.RDS_PASSWORD : process.env.DB_PASSWORD,
    DB_PORT: process.env.RDS_PORT ? process.env.RDS_PORT : process.env.DB_PORT,
    DB_DIALECT: process.env.DB_DIALECT
  }

  const connection = await mysql.createConnection({
    host: dbParams.DB_HOST,
    port: dbParams.DB_PORT,
    user: dbParams.DB_USER,
    password: dbParams.DB_PASSWORD
  })

  let hidePartially = function (str) {
    return str.replace(/(.{2})(.*)/,
    function (gp1, gp2, gp3) {
      for (let i = 0; i < gp3.length; i++) {
        gp2 += "*"
      }
      return gp2
    })
  }

  console.log('Trying to create a database (if not existing)', {
    host: dbParams.DB_HOST,
    port: dbParams.DB_PORT,
    user: hidePartially(dbParams.DB_USER),
    database: dbParams.DB_NAME,
    password: hidePartially(dbParams.DB_PASSWORD)
  })

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbParams.DB_NAME}\`;`)
}

const dropDatabase = async function () {
  ColorConsole.success('Going to drop database!')
  return await exec('npx sequelize-cli db:drop --env=' + process.env.ENVIRONMENT)
}

const runMigrations = async function () {
  ColorConsole.success('Going to run migrations!')
  return await exec('npx sequelize-cli db:migrate --env=' + process.env.ENVIRONMENT)
}

const runSeeders = async function (seeders = []) {
  ColorConsole.success('Going to run seeders!')
  let command = 'npx sequelize-cli db:seed'
  // If seeders are passed as an argument, run only those.
  command += (seeders.length) ? ' --seed ' + seeders.join(',') : ':all'
  command += ' --env=' + process.env.ENVIRONMENT

  return await exec(command)
}

const populateDatabase = async function (seed = false) {
  try {
    var result = await runMigrations()
    if (seed) {
      result = runSeeders()
    }
    console.log(result)
    return true
  } catch (e) {
    console.log('Failed to populate the database!', e)

    return false
  }
}

export default {
  validateDatabaseConnection,
  validateEnviromentVariables,
  populateDatabase,
  runMigrations,
  runSeeders,
  createDatabase,
  createLogFiles,
  createTmpDirectories,
  createSequalizeCliConf,
  dropDatabase
}