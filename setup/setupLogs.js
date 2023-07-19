let SRC_PATH = process.cwd()
SRC_PATH += process.env.ENVIRONMENT === 'development' ? '/src' : '/dist'

const ColorConsole = await import(SRC_PATH + '/utilities/console/colors.js')
import Setup from './setupActions.js'
// Set the base path of the app based on the environment.
const BASE_PATH = process.env.ENVIRONMENT === 'production' ? './dist' : './src'
process.env.BASE_PATH = BASE_PATH

try {
  await Setup.createLogFiles()
  ColorConsole.success('See output above for this process')
  process.exit(0)
} catch (err) {
  console.log(err)
  process.exit(1)
}
