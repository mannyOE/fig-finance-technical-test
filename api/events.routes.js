const {Router} = require('express')
const {fetchEvents, createEvent} = require('./events.controller')
const Joi = require('joi')

const router = Router()

const middlewares = {
	users: async function (req, res, next) {
		const header = req.headers['authorization']
		if (header && header === 'Users') {
			return next()
		}
		return res.status(403).send({message: 'Access denied'})
	},
	admin: async function (req, res, next) {
		const header = req.headers['authorization']
		if (header && header === 'Administration') {
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

router.get('/', middlewares.users, fetchEvents)
router.post('/', middlewares.admin, middlewares.validateEvent, createEvent)

module.exports = router
