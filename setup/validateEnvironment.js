let SRC_PATH = process.cwd()
SRC_PATH += process.env.ENVIRONMENT === 'development' ? '/src' : '/dist'

const ColorConsole = await import(SRC_PATH + '/utilities/console/colors.js')
import Setup from './setupActions.js'
// Set the base path of the app based on the environment.

Setup.validateEnviromentVariables().then((errors) => {
  if (errors.length) {
    ColorConsole.error('There were errors during a validation of your .env-file.')
    for (var e in errors) {
      ColorConsole.error(' - ' + errors[e])
    }
    process.exit(1)
  } else {
    process.exit(0)
  }
})
