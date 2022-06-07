const server = require('./server')
const workers = require('./backgroundWorkers')
const app = {}

app.init = () => {
  // start the server
  server.init()

  // start the workers
  workers.init()
}

app.init()

