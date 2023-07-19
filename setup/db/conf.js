// Set the base path of the app based on the environment.
let SRC_PATH = process.cwd()
SRC_PATH += process.env.ENVIRONMENT === 'development' ? '/src' : '/dist'

const ColorConsole = await import(SRC_PATH + '/utilities/console/colors.js')
import Setup from '../setupActions.js'

async function run () {
  try {
    Setup.createSequalizeCliConf()
    await Setup.createDatabase().then(() => {
      ColorConsole.success('Ran migrations. There might be some details above this message, if there were new migrations.')
    })
    await Setup.runMigrations().then(() => {
      ColorConsole.success('Ran migrations. There might be some details above this message, if there were new migrations.')
    })

    await Setup.runSeeders().then(() => {
      ColorConsole.success('DB Seeding complete. Your database is now refreshed with the data from the seeders.')
    })

    ColorConsole.success('The database ' + process.env.DB_NAME + ' on ' + process.env.DB_HOST + ' is now ready to use.')
    process.exit(0)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

run()