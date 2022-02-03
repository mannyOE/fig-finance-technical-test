const config = require('../config')

const mongoose = require('mongoose')

const DATABASE_URL = config.mongodb

const connectDb = async (cb) => {
	return mongoose.connect(
		DATABASE_URL,
		{useUnifiedTopology: true, useNewUrlParser: true},
		(err) => {
			if (err) {
				console.log('Connection to Database failed. ')
			} else {
				console.log('Database connection successful. ' + DATABASE_URL)
				cb()
			}
		}
	)
}

const db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error'))

module.exports = connectDb
