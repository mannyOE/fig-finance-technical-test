import React, {useState, useEffect, useCallback} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {update} from '../store'
const USERS = 'USERS'

export default function Home({base_url}) {
	const [loaded, setLoaded] = useState(false)
	const [message, setMessage] = useState('')
	const results = useSelector((state) => state.events.results)
	const dispatch = useDispatch()
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
		keywords: '',
		category: '',
		isVirtual: 'None',
		date_from: '',
		date_to: ''
	})
	const [pagination, setPagination] = useState({
		page: 1,
		pageSize: 5,
		totalPages: 1
	})
	const generateQuery = async function (page) {
		let query = `?pageSize=${pagination.pageSize}&page=${
			page || pagination.page
		}`
		setMessage('No results found at this time')
		if (data.category && data.category !== 'None') {
			setMessage('No results to your query')
			query = query + `&category=${data.category}`
		}

		if (data.keywords && data.keywords.trim() !== '') {
			setMessage('No results to your query')
			query = query + `&keywords=${data.keywords.replace(' ', ',')}`
		}

		if (data.isVirtual && data.isVirtual !== 'None') {
			setMessage('No results to your query')
			query = query + `&virtual=${data.isVirtual === 'Yes' ? true : false}`
		}

		if (data.date_from && data.date_to) {
			setMessage('No results to your query')
			query = query + `&date_from=${data.date_from}&date_to=${data.date_to}`
		}
		return query
	}

	const loadEvents = useCallback(
		async (page) => {
			let query = await generateQuery(page)
			await fetch(base_url + '/events' + query, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					authorization: USERS
				}
			})
				.then((response) => response.json())
				.then((dt) => {
					setPagination({
						...pagination,
						totalPages: dt.pagination.totalPages,
						page: dt.pagination.currentPage
					})
					dispatch(update(dt.results))
				})
		},
		[pagination, data, dispatch, generateQuery]
	)

	useEffect(() => {
		document.title = 'Tech events UK'
		if (!loaded) {
			loadEvents()
			setLoaded(true)
		}
	}, [loaded, loadEvents])

	const changeData = function (value, field) {
		let dt = {...data}
		dt[field] = value
		setData({...dt})
	}

	async function changePage(e, dir) {
		e.preventDefault()
		let curr = pagination.page
		if (dir === 'prev') {
			curr--
		} else {
			curr++
		}
		setPagination({...pagination, page: curr})
		loadEvents(curr)
	}
	async function updatePage(e, curr) {
		e.preventDefault()
		setPagination({...pagination, page: curr})
		loadEvents(curr)
	}

	return (
		<div className='d-flex justify-content-center align-items-center page'>
			<div className='col-8 card content shadow-lg py-3'>
				<div className='d-flex justify-content-between my-3'>
					<h4>Tech Events UK</h4>
				</div>

				<div className='d-flex justify-content-start align-items-center'>
					<div className='form-group mr-1 col-2 px-0'>
						<label>Category</label>
						<select
							value={data.category}
							onChange={(e) => changeData(e.target.value, 'category')}
							className='form-control'
							id='exampleFormControlSelect1'
						>
							<option>None</option>
							{categories.map((x) => {
								return <option key={x}>{x}</option>
							})}
						</select>
					</div>

					<div className='form-group mr-1 col-2 px-0'>
						<label>Date From</label>
						<input
							value={data.date}
							onChange={(e) => changeData(e.target.value, 'date_from')}
							type='date'
							className='form-control'
						/>
					</div>

					<div className='form-group mr-1 col-2 px-0'>
						<label>Date To</label>
						<input
							value={data.date}
							onChange={(e) => changeData(e.target.value, 'date_to')}
							type='date'
							className='form-control'
						/>
					</div>
					<div className='form-group mr-2 col-1 px-0'>
						<label>Virtual</label>
						<select
							value={data.isVirtual}
							onChange={(e) => changeData(e.target.value, 'isVirtual')}
							className='form-control'
							id='exampleFormControlSelect1'
						>
							<option value='None' key='0'>
								None
							</option>
							<option value='Yes' key='1'>
								Yes
							</option>
							<option value='No' key='2'>
								No
							</option>
						</select>
					</div>
					<div className='form-group mr-1 col-3  px-0'>
						<label>Keywords</label>
						<input
							value={data.keywords}
							onChange={(e) => changeData(e.target.value, 'keywords')}
							type='text'
							className='form-control'
						/>
					</div>
					<div className='col-1 form-group px-0'>
						<button
							onClick={() => loadEvents(1)}
							className='btn btn-link mt-4 px-3 py-2'
						>
							Search
						</button>
					</div>
				</div>
				{results.length === 0 ? (
					<div className='text-center py-5'>{message}</div>
				) : (
					<div></div>
				)}
				{results.map((result) => {
					var months = [
						'Jan',
						'Feb',
						'Mar',
						'Apr',
						'May',
						'Jun',
						'Jul',
						'Aug',
						'Sep',
						'Oct',
						'Nov',
						'Dec'
					]
					var today = new Date(result.date)
					var dd = String(today.getDate()).padStart(2, '0')
					var mm = months[today.getMonth()]
					var yyyy = today.getFullYear()
					var th = 'AM'
					var hr = String(today.getHours()).padStart(2, '0')
					if (today.getHours() > 12) {
						th = 'PM'
						hr = String(today.getHours() - 12).padStart(2, '0')
					}
					var min = String(today.getMinutes()).padStart(2, '0')

					today = `${hr}:${min}${th}, ` + mm + ' ' + dd + ', ' + yyyy
					return (
						<div className='card py-2 px-3 mb-2' key={result._id}>
							<div className='d-flex justify-content-between align-items-center'>
								<div className='w-75'>
									<div>
										<h3>{result.title}</h3>
									</div>
									<div className='py-0'>
										<span>{result.description}</span>
									</div>
									<div className='d-flex'>
										<div>
											<strong>{result.category}</strong> *
										</div>
										<div className='py-0 ml-2'>
											{result.isVirtual ? (
												<a
													rel='noreferrer'
													target='_blank'
													href={result.address}
												>
													{result.address}
												</a>
											) : (
												<strong>
													<span>{result.address}</span>
												</strong>
											)}
										</div>
									</div>
								</div>
								<div className='w-25'>
									<div>{today}</div>
									<div>
										<strong>
											{result.isVirtual ? 'Virtual event' : 'Live event'}
										</strong>
									</div>
								</div>
							</div>
						</div>
					)
				})}

				{pagination.totalPages > 1 ? (
					<div className='d-flex justify-content-center align-items-center'>
						<nav aria-label='...'>
							<ul className='pagination'>
								<li
									className={`page-item ${
										pagination.page === 1 ? 'disabled' : ''
									}`}
								>
									<button
										onClick={(e) => changePage(e, 'prev')}
										className='btn btn-link page-link'
									>
										Previous
									</button>
								</li>
								{new Array(pagination.totalPages).fill(0).map((page, index) => {
									let active = index + 1 === pagination.page ? 'active' : ''
									return (
										<li key={index} className={'page-item ' + active}>
											<button
												onClick={(e) => updatePage(e, index + 1)}
												className='btn btn-link page-link'
												href='#'
											>
												{index + 1}
												<span className='sr-only'>(current)</span>
											</button>
										</li>
									)
								})}
								<li
									className={`page-item ${
										pagination.page === pagination.totalPages ? 'disabled' : ''
									}`}
								>
									<button
										onClick={(e) => changePage(e, 'next')}
										className='btn btn-link page-link'
										href='#'
									>
										Next
									</button>
								</li>
							</ul>
						</nav>
					</div>
				) : (
					<></>
				)}
			</div>
		</div>
	)
}
