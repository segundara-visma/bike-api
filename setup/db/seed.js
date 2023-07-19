// Set the base path of the app based on the environment.
let SRC_PATH = process.cwd()
SRC_PATH += process.env.ENVIRONMENT === 'development' ? '/src' : '/dist'

const ColorConsole = await import(SRC_PATH + '/utilities/console/colors.js')
import Setup from '../setupActions.js'

try {
  Setup.runSeeders().then(() => {
    ColorConsole.success('DB Seeding complete. Your database is now refreshed with the data from the seeders.')
    process.exit(0)
  })
} catch (err) {
  console.log(err)
  process.exit(1)
}
