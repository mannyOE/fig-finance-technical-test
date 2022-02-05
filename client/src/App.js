import './App.css'
import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Admin from './pages/Admin'
const BASE_URL = 'http://localhost:3001'
function App() {
	return (
		<div className='App'>
			<Routes>
				<Route path='/' element={<Home base_url={BASE_URL} />} />
				<Route path='admin' element={<Admin base_url={BASE_URL} />} />
			</Routes>
		</div>
	)
}

export default App
