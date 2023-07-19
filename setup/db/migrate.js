// Set the base path of the app based on the environment.
let SRC_PATH = process.cwd()
SRC_PATH += process.env.ENVIRONMENT === 'development' ? '/src' : '/dist'

const ColorConsole = await import(SRC_PATH + '/utilities/console/colors.js')
import Setup from '../setupActions.js'

try {
  Setup.runMigrations().then(() => {
    ColorConsole.success('Ran migrations. There might be some details above this message, if there were new migrations.')
    process.exit(0)
  })
} catch (err) {
  console.log(err)
  process.exit(1)
}
