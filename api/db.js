const config = require('../config')

const mongoose = require('mongoose')

const {PWD, USER, CLUSTER, DB} = config

const connectDb = async (cb) => {
	let DATABASE_URL = `mongodb+srv://${USER}:${PWD}@${CLUSTER}/${DB}?retryWrites=true&w=majority`
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
