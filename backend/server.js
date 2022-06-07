const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const { errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const userRoutes = require("./routes/userRoutes")
const checkRoutes = require("./routes/checkRoutes")
const cors = require('cors')
const port = process.env.PORT || 5000

const server = express()

// connect app to database
connectDB()

server.use( cors({ origin: "*" }) )
// parse requests of content-type - application/json
server.use(express.json())
// parse requests of content-type - application/x-www-form-urlencoded
server.use(express.urlencoded({ extended: false }))

server.use("/api/users", userRoutes)
server.use("/api/checks", checkRoutes)

server.get("/", (req, res) => res.send('API is set and ready to receive your requests'))

server.use(errorHandler)
server.init = () => {
  // start the server
  server.listen(port, () => console.log(`Server is alive on port ${port}`.red.underline)) 
}

module.exports = server