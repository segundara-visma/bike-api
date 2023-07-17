import path from 'path'
import bunyan from 'bunyan'
import Sequelize from 'sequelize'

// require('dotenv').config()

const logger = bunyan.createLogger({
  name: 'Database',
  streams: [
    {
      type: 'file',
      level: 'debug',
      path: process.env.LOG_STORAGE_PATH + path.sep + 'database/mysql.log'
    }
  ]
})

export const sequelize = new Sequelize(
  process.env.DB_NAME,            // Database name
  process.env.DB_USER,            // Database username
  process.env.DB_PASSWORD,        // Database password
  {                               // Other database options
    timezone: '+02:00',
    dialect: 'mysql',
    logging: function (msg) {
      // console.log(msg)
      logger.debug(msg)
    },
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    define: {
      timestamps: false
    },
    dialectOptions: {
      dateStrings: true,
      decimalNumbers: true,
      typeCast: function (field, next) { // for reading from database
        if (field.type === 'DATETIME') {
          return field.string()
        }
        return next()
      }
    }
  }
)
