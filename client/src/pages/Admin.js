import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
const Joi = require('joi')
const ADMINISTRATION = 'ADMINISTRATION'
const VIRTUAL = 'isVirtual'

export default function Admin({base_url}) {
	function submitButton(e) {
		e.preventDefault()
		setLoading(true)
		fetch(base_url + '/events', {
			method: 'POST', // *GET, POST, PUT, DELETE, etc.
			headers: {
				'Content-Type': 'application/json',
				authorization: ADMINISTRATION
			},
			body: JSON.stringify(data)
		})
			.then((response) => response.json())
			.then((dt) => {
				setMessage(dt.message)
				setLoading(false)
				setData({
					title: '',
					description: '',
					category: '',
					isVirtual: false,
					date: '',
					address: ''
				})
			})
	}
	const [message, setMessage] = useState(null)
	const [loading, setLoading] = useState(false)
	const [categories] = useState([
		'AI',
		'Mobile development',
		'Web development',
		'Robotics',
		'Web3js',
		'Cryptocurrency',
		'Others'
	])
	const [data, setData] = useState({
		title: '',
		description: '',
		category: '',
		isVirtual: false,
		date: '',
		address: ''
	})
	const [validForm, setValidForm] = useState(true)

	useEffect(() => {
		const Schema = Joi.object({
			title: Joi.string().min(5),
			description: Joi.string().min(15),
			category: Joi.string().min(1),
			date: Joi.date().greater(new Date()),
			isVirtual: Joi.boolean(),
			address: Joi.string().min(10)
		})
		let report = Schema.validate(data)
		if (report.error) {
			setValidForm(true)
		} else {
			setValidForm(false)
		}
	}, [data])

	const changeData = function (value, field) {
		let dt = {...data}
		if (field === VIRTUAL) {
			dt[field] = !dt[field]
		} else {
			dt[field] = value
		}
		setData({...dt})
	}
	return (
		<div className='d-flex justify-content-center align-items-center page'>
			<div className='col-8 border content shadow-lg py-3'>
				<div className='d-flex justify-content-between'>
					<h4>Tech Events UK Admin Page</h4>
					<Link to='/'>Home</Link>
				</div>
				<form className='mt-5' onSubmit={(e) => submitButton(e)}>
					<h5>Create a new event</h5>

					{message && message.length > 0 ? (
						<div
							className='alert col-12 col-md-6 mt-2 alert-warning alert-dismissible fade show'
							role='alert'
						>
							<strong>Success!</strong> {message}
							<button
								type='button'
								onClick={() => setMessage(null)}
								className='close'
								data-dismiss='alert'
								aria-label='Close'
							>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
					) : (
						<div></div>
					)}

					<div className='form-group'>
						<label>Event title *</label>
						<input
							value={data.title}
							onChange={(e) => changeData(e.target.value, 'title')}
							type='text'
							className='form-control col-12 col-md-6'
						/>
					</div>

					<div className='form-group'>
						<label>Event Description *</label>
						<textarea
							onChange={(e) => changeData(e.target.value, 'description')}
							type='text'
							value={data.description}
							className='form-control col-12 col-md-6'
						/>
					</div>

					<div className='form-group'>
						<label>Event Category *</label>
						<select
							value={data.category}
							onChange={(e) => changeData(e.target.value, 'category')}
							className='form-control col-12 col-md-6'
							id='exampleFormControlSelect1'
						>
							<option value={null}>None</option>
							{categories.map((x) => {
								return <option key={x}>{x}</option>
							})}
						</select>
					</div>

					<div className='form-group'>
						<label>Event Location *</label>
						<input
							value={data.address}
							onChange={(e) => changeData(e.target.value, 'address')}
							type='text'
							className='form-control col-12 col-md-6'
						/>
					</div>

					<div className='form-group'>
						<label>Event Date *</label>
						<input
							value={data.date}
							onChange={(e) => changeData(e.target.value, 'date')}
							type='datetime-local'
							className='form-control col-12 col-md-6'
						/>
					</div>

					<div className='form-check'>
						<input
							value={data.isVirtual}
							onChange={(e) => changeData(e.target.value, 'isVirtual')}
							className='form-check-input'
							type='checkbox'
							id='defaultCheck1'
						></input>
						<label className='form-check-label'>Virtual Event</label>
					</div>

					<div className='form-group mt-3'>
						<button
							disabled={validForm || loading}
							type='submit'
							className='btn btn-primary px-5 py-2'
						>
							{loading ? <span>Loading...</span> : <span>Publish event</span>}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
