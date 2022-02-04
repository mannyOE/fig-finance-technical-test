import {configureStore} from '@reduxjs/toolkit'

import {createSlice} from '@reduxjs/toolkit'

export const eventsSlice = createSlice({
	name: 'events',
	initialState: {
		results: []
	},
	reducers: {
		update: (state, action) => {
			state.results = action.payload
		}
	}
})

// Action creators are generated for each case reducer function
export const {update} = eventsSlice.actions

export default configureStore({
	reducer: {
		events: eventsSlice.reducer
	}
})
