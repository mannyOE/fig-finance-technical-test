const {Events} = require('./models/events')
const generateQuery = async function ({
	virtual,
	keywords,
	category,
	date_from,
	date_to
}) {
	let query = {$and: []}
	if (date_to) {
		query.$and.push({
			date: {$lt: new Date(date_to)}
		})
	}
	if (date_from) {
		query.$and.push({
			date: {$gte: new Date(date_from)}
		})
	}
	if (category) {
		query.$and.push({
			category
		})
	}
	if (virtual) {
		if (virtual === 'true') {
			virtual = true
		} else {
			virtual = false
		}
		query.$and.push({
			isVirtual: virtual
		})
	}
	if (keywords) {
		keywords = keywords.split(',')
		let titleQueries = keywords.map((word) => {
			return {title: {$regex: word}}
		})
		let descriptionQueries = keywords.map((word) => {
			return {description: {$regex: word}}
		})
		let categoryQueries = keywords.map((word) => {
			return {category: {$regex: word}}
		})
		let addressQueries = keywords.map((word) => {
			return {address: {$regex: word}}
		})
		query.$and.push({
			$or: [
				...titleQueries,
				...descriptionQueries,
				...categoryQueries,
				...addressQueries
			]
		})
	}
	if (query.$and.length === 0) {
		delete query.$and
	}
	return query
}
const generatePagination = async function (page, pageSize) {
	let pagination = {
		skip: 0,
		count: 10,
		totalPages: 0,
		page: 1
	}
	if (pageSize) {
		pagination.count = Number(pageSize)
	}
	if (page) {
		page = Number(page)
		pagination.page = page
		pagination.skip = (page - 1) * pagination.count
	}
	return pagination
}
module.exports = {
	fetchEvents: async function (req, res) {
		try {
			let {page, pageSize, virtual, keywords, category, date_from, date_to} =
				req.query

			let pagination = await generatePagination(page, pageSize)
			let query = await generateQuery({
				virtual,
				keywords,
				category,
				date_from,
				date_to
			})
			pagination.totalPages = Math.ceil(
				(await Events.countDocuments(query)) / pagination.count
			)
			let results = await Events.find(query)
				.skip(pagination.skip)
				.limit(pagination.count)
			return res.send({
				results,
				pagination: {
					totalPages: pagination.totalPages,
					currentPage: pagination.page
				}
			})
		} catch (error) {
			return res.status(400).json({message: error.message})
		}
	},
	fetchOneEvent: async function (req, res) {
		try {
			let event = await Events.findById(req.params.eventID)
			return res.send({event})
		} catch (error) {
			return res.status(400).json({message: error.message})
		}
	},
	deleteOneEvent: async function (req, res) {
		try {
			await Events.deleteMany({_id: req.params.eventID})
			return res.send({message: 'Event deleted'})
		} catch (error) {
			return res.status(400).json({message: error.message})
		}
	},
	createEvent: async function (req, res) {
		try {
			let event = await Events.create({...req.body})
			return res.send({message: 'Event created', event: event._id})
		} catch (error) {
			return res.status(400).json({message: error.message})
		}
	}
}
