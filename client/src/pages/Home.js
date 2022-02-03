import React from 'react'
import {Link} from 'react-router-dom'

export default function Home() {
	return (
		<div className='d-flex justify-content-center align-items-center page'>
			<div className='col-8 border content shadow-lg py-3'>
				<div className='d-flex justify-content-between'>
					<h4>Tech Events UK Home</h4>
					<Link to='/admin'>Admin</Link>
				</div>
			</div>
		</div>
	)
}
