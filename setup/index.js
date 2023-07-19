import readline from 'readline'

let SRC_PATH = process.cwd()
SRC_PATH += process.env.ENVIRONMENT === 'development' ? '/src' : '/dist'

// const ColorConsole = require(SRC_PATH + '/utilities/console/colors')
const ColorConsole = await import(SRC_PATH + '/utilities/console/colors.js')
const colors = ColorConsole.colors
/**
 * Run the whole setup process.
 */

// Script arguments
const SEED = process.env.npm_config_seed === 'true' ? true : false
import Setup from './setupActions.js'

async function prompt (query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return await new Promise(resolve => rl.question(query, ans => {
    rl.close()
    resolve(ans)
  }))
}

async function run () {
  var errors = await Setup.validateEnviromentVariables()
  var ok // Helper variable to get and check the result of the tests.
  if (!errors.length) {
    ColorConsole.success('Required environment variables were set.')

    // Create log files mentioned in ./config/logs.js
    ColorConsole.info('Creating log files...')
    await Setup.createLogFiles()
    // Create a database mentioned in .env-file.
    ColorConsole.info('Creating a database if it doesn\'t exist...')
    //if (process.env.ENVIRONMENT == 'development') {
      Setup.createTmpDirectories()
    //}

    Setup.createSequalizeCliConf()

    if (process.env.ENVIRONMENT == 'development') {
      // Database setup.
      await Setup.createDatabase()
      ColorConsole.info('Validating database connection...')
      ok = await Setup.validateDatabaseConnection()
      if (ok) { // If the database connection is not ok, it is pointless to go further.
        await Setup.populateDatabase(SEED)
        process.exit(0)
      } else {
        ColorConsole.error('Database connection could not be made. Review your .env-file and make sure the database accepts connections.')
        process.exit(1)
      }
    }
  } else {
    ColorConsole.error('There were errors during a validation of your .env-file.')
    for (var e in errors) {
      console.log(' - ' + errors[e])
    }
  }
}

try {
  var step = 1 // When the step is variable and not a static string, we can add steps between already defined steps.
  let promptMsg = '\n\n====About the setup process ====\n'
  promptMsg += 'The following actions are going to be executed:\n\n'

  promptMsg += step + '. Validate your ' + colors.FgBlue + '.env' + colors.Reset + '-file.\n'
  promptMsg += colors.FgYellow + '- The process will terminate.\n' + colors.Reset
  promptMsg += ' - If the required variables are not set.\n'
  promptMsg += ' - If the database connection can\'t be eshtablished.\n'
  step++

  promptMsg += step + '. Create a file for Sequelize CLI (' + colors.FgBlue + SRC_PATH + '/config/sequalize-cli.config.json' + colors.Reset + ').\n'
  step++

  promptMsg += step + '. Populate database with Sequelize CLI.\n'
  promptMsg += ' - Migrations' + colors.FgBlue + ' (./db/migrations/*)' + colors.Reset + ' to populate database with the required tables.\n'
  if (SEED) {
    promptMsg += ' - Seeders' + colors.FgBlue + ' (./db/seeders/*)' + colors.Reset + ' to populate database tables with initial data.\n'
  }
  step++

  promptMsg += step + '. Create files for the application to write log entries in to.\n'
  promptMsg += ' - The files that are going to be created, are listed at ' + colors.FgBlue + SRC_PATH + '/config/logs.js.\n' + colors.Reset
  promptMsg += ' - The files will be created to the path you have specified at ' + colors.FgBlue + '.env' + colors.Reset + '-file (' + colors.FgBlue + 'LOG_STORAGE_PATH' + colors.Reset + ').\n'
  step++

  promptMsg += step + '. Create temporary directories to base tmp directory (' + colors.FgBlue + '.env' + colors.Reset + '-file: ' + colors.FgBlue + 'TEMPORARY_DIR' + colors.Reset + ').\n'
  promptMsg += ' - A temporary directory could contain files that the user has uploaded. For example an import file.\n'
  step++

  promptMsg += 'Press Enter to continue or CTRL + C to cancel...\n\n'
  step++

  if (process.env.ENVIRONMENT !== 'production' && process.env.ENVIRONMENT !== 'staging') {
    prompt(promptMsg).then(async () => {
      run()
    })
  } else {
    run()
  }

} catch (err) {
  console.log(err)
  process.exit(1)
}
