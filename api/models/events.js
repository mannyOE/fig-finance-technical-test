const mongoose = require('mongoose')
const {Schema} = mongoose

const eventsModel = new Schema(
	{
		title: {
			type: String,
			required: true
		},
		description: {
			type: String,
			required: true
		},
		category: {
			type: String,
			required: true
		},
		isVirtual: {
			type: Boolean,
			default: true
		},
		date: {
			type: Date,
			required: true
		},
		address: {
			type: String,
			required: true
		}
	},
	{
		timestamps: true,
		collection: 'events'
	}
)

const Events = mongoose.model('events', eventsModel)

module.exports = {Events}
