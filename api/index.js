const config = require('../config')
const connectDb = require('./db')
const express = require('express')
var bodyParser = require('body-parser')
const cors = require('cors')
const eventsRouter = require('./events.routes')

var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({extended: false})

const PORT = config.port

const app = express()
app.use(jsonParser)
app.use(urlencodedParser)
app.use(cors('*'))

app.use('/events', eventsRouter)

connectDb(() => {
	app.listen(PORT, async () => {
		console.log(`Server listening on ${PORT}`)
	})
})
