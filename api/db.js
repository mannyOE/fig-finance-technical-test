const config = require('../config')
const logger = require('Console')
const mongoose = require('mongoose')

const {PWD, USER, CLUSTER, DB} = config

const connectDb = async (cb) => {
	let DATABASE_URL = `mongodb+srv://${USER}:${PWD}@${CLUSTER}/${DB}?retryWrites=true&w=majority`
	return mongoose.connect(
		DATABASE_URL,
		{useUnifiedTopology: true, useNewUrlParser: true},
		(err) => {
			if (err) {
				logger.log('Connection to Database failed. ')
			} else {
				logger.log('Database connection successful. ' + DATABASE_URL)
				cb()
			}
		}
	)
}

const db = mongoose.connection

db.on('error', logger.error.bind(console, 'MongoDB connection error'))

module.exports = connectDb
