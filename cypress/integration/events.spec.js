const ADMINISTRATION = 'ADMINISTRATION'
const USERS = 'USERS'
const {faker} = require('@faker-js/faker')
describe('Fetch Events tests', () => {
	context('GET /events', () => {
		it('Should Return 200 status code', () => {
			let query = `?pageSize=2&page=1`
			cy.request({
				method: 'GET',
				headers: {
					authorization: USERS
				},
				url: 'http://localhost:3001/events' + query
			}).should((response) => {
				expect(response.status).to.eq(200)
			})
		})
	})
})

describe('Fetch Events tests', () => {
	context('GET /events', () => {
		it('Should Assert that pagination and results property exist', () => {
			let query = `?pageSize=2&page=1`
			cy.request({
				method: 'GET',
				headers: {
					authorization: USERS
				},
				url: 'http://localhost:3001/events' + query
			}).should((response) => {
				let json = JSON.parse(JSON.stringify(response.body))
				expect(json).to.have.property('results')
				expect(json).to.have.property('pagination')
			})
		})
	})
})

describe('Fetch Events tests', () => {
	context('GET /events', () => {
		it('Should assert that totalPages is at least 1 and current page is 1', () => {
			let query = `?pageSize=2&page=1`
			cy.request({
				method: 'GET',
				headers: {
					authorization: USERS
				},
				url: 'http://localhost:3001/events' + query
			}).should((response) => {
				let json = JSON.parse(JSON.stringify(response.body))

				expect(json.pagination.currentPage).to.be.eq(1)
				expect(json.pagination.totalPages).to.be.at.least(1)
			})
		})
	})
})

describe('Fetch Events tests', () => {
	context('GET /events', () => {
		it('Should assert that length of the results property is equal to 2', () => {
			let query = `?pageSize=2&page=1`
			cy.request({
				method: 'GET',
				headers: {
					authorization: USERS
				},
				url: 'http://localhost:3001/events' + query
			}).should((response) => {
				let json = JSON.parse(JSON.stringify(response.body))
				expect(json.results.length).to.be.eq(2)
			})
		})
	})
})

describe('CREATE Events tests', () => {
	context('POST /events', () => {
		it('Should Return 200 status code and delete created event and event should no longer exist', () => {
			let tenDays = 10 * 24 * 60 * 60 * 1000
			let base = new Date().getTime()
			let payload = {
				title: faker.commerce.productName(),
				description: faker.commerce.productDescription(),
				category: faker.commerce.productAdjective(),
				isVirtual: false,
				date: new Date(base + tenDays),
				address: faker.address.cityName() + ', ' + faker.address.country()
			}
			cy.request({
				method: 'POST',
				headers: {
					authorization: ADMINISTRATION
				},
				body: {...payload},
				url: 'http://localhost:3001/events'
			}).should((response) => {
				expect(response.status).to.eq(200)
				let json = JSON.parse(JSON.stringify(response.body))
				expect(json).to.have.property('event')
				expect(json).to.have.property('message')

				cy.request({
					method: 'GET',
					headers: {
						authorization: ADMINISTRATION
					},
					url: 'http://localhost:3001/events/' + json.event
				}).should((response) => {
					expect(response.status).to.eq(200)
					let dt = JSON.parse(JSON.stringify(response.body))
					expect(dt).to.have.property('event')
					expect(dt.event.title).to.be.eq(payload.title)
					expect(dt.event.description).to.be.eq(payload.description)
					expect(dt.event.category).to.be.eq(payload.category)
					expect(dt.event.address).to.be.eq(payload.address)

					cy.request({
						method: 'DELETE',
						headers: {
							authorization: ADMINISTRATION
						},
						url: 'http://localhost:3001/events/' + dt.event._id
					}).should((response) => {
						expect(response.status).to.eq(200)
						let result = JSON.parse(JSON.stringify(response.body))
						expect(result).to.have.property('message')
					})
				})
			})
		})
	})
})
