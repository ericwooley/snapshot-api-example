/***************************
 * configuration
 * the commands below should line up with your npm run scripts.
 */

const initDbCommand = 'initIntegrationDB'
const startServerInIntegrationModeCommand = 'start:integration'
const apiPort = process.env.API_PORT || 3200
const jestCommand = 'jest:integration'
// After starting the server, it must console.log a string we can listen too,
// so this script knows that the server is ready to start accepting input.
// You might be able to find a better way if this solution doesn't suit your
// liking. EG poll http://localhost:3200/ until you get a 200 response.
const serverOutPutWhenReady = 'api running on port ' + apiPort + '!'
// you may need to increase this if your server has a long startup time
const serverTimeoutTime = 2000

/***************************
 * Script
 * You probably don't need to edit much below this line
 */

// https://nodejs.org/api/child_process.html
const p = require('child_process')
// https://www.npmjs.com/package/terminate
// Getting child processes which spawn themselves to
// all die on script exit can be very painful
// terminate does a great job
const terminate = require('terminate')

// Initialize the database
p.execSync('npm run ' + initDbCommand, { stdio: [0, 1, 2] })

// initialize the spawn server.
const initServer = p.spawn(
  'npm',
  ['run', startServerInIntegrationModeCommand],
  {
    shell: true
  }
)

// This is all code to ensure the server dies when this script ends.
process.on('SIGINT', cleanExit)
process.on('uncaughtException', cleanExit)
process.on('exit', cleanExit)
function cleanExit (code = 1) {
  if (!initServer.killed) {
    terminate(initServer.pid, () => process.exit(code))
  } else {
    process.exit(code)
  }
}

// reference to clear the timeout for when the server is timed out
let timeoutRef
new Promise((resolve, reject) => {
  // If we don't find the text within the serverTimeoutTime, exit 1
  timeoutRef = setTimeout(() => cleanExit(1), serverTimeoutTime)
  // pipe our server output to the screen
  initServer.stdout.pipe(process.stdout)
  // pipe our server errors to the screen
  initServer.stderr.pipe(process.stderr)
  // listen to the server output for the string that we know means it's ready
  initServer.stdout.on('data', data => {
    data = data + ''
    // if the output has the string we know means it's ready, fulfil this promise.
    if (data.match(serverOutPutWhenReady)) {
      resolve()
    }
  })
}).then(() => {
  // clear out the server timeout, getting here means we found the server ready string.
  clearTimeout(timeoutRef)
  try {
    let command = 'npm run ' + jestCommand
    // if we get a -u as an argv, that means the user wants to update the snapshots.
    const updateTests = process.argv.find(arg => arg === '-u')
    // if we want to update the tests, add -- -u to the npm commands.
    if (updateTests) {
      command += ' -- -u'
      console.log('updating snapshots')
    }
    // execute our jest command, this will throw an error if jest exits negatively
    p.execSync(command, { stdio: [0, 1, 2] })
    console.log('jest done')
    cleanExit(0)
  } catch (e) {
    // (probably) jest threw an error, so we want to exit as an error.
    console.log('jest failed, exiting')
    cleanExit(1)
  }
})
