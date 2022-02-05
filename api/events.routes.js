const {Router} = require('express')
const {
	fetchEvents,
	createEvent,
	deleteOneEvent,
	fetchOneEvent
} = require('./events.controller')
const Joi = require('joi')
const ADMINISTRATION = 'ADMINISTRATION'
const USERS = 'USERS'

const router = Router()

const middlewares = {
	userTypes: async function (req, res, next, type) {
		const header = req.headers['authorization']
		if (header && header === type) {
			return next()
		}
		return res.status(403).send({message: 'Access denied'})
	},
	validateEvent: function (req, res, next) {
		const Schema = Joi.object({
			title: Joi.string().min(5),
			description: Joi.string().min(15),
			category: Joi.string().min(2),
			date: Joi.date().greater(new Date()),
			isVirtual: Joi.boolean(),
			address: Joi.string().min(10)
		})
		let report = Schema.validate(req.body)
		if (report.error) {
			return res.status(403).send({message: report.error})
		}
		return next()
	}
}

router.get(
	'/',
	(req, res, next) => middlewares.userTypes(req, res, next, USERS),
	fetchEvents
)
router.post(
	'/',
	(req, res, next) => middlewares.userTypes(req, res, next, ADMINISTRATION),
	middlewares.validateEvent,
	createEvent
)

router.delete(
	'/:eventID',
	(req, res, next) => middlewares.userTypes(req, res, next, ADMINISTRATION),
	deleteOneEvent
)

router.get(
	'/:eventID',
	(req, res, next) => middlewares.userTypes(req, res, next, ADMINISTRATION),
	fetchOneEvent
)

module.exports = router
