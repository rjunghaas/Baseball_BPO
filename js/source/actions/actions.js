import { getApi, postApi } from './api'

export const getData = () => {
	return function(dispatch) {
		// Call api for getting players data
		return getApi('https://xegsms2vug.execute-api.us-west-2.amazonaws.com/prod/getPlayers')
			.then(res => dispatch({ type: 'LOAD_SUCCESS', payload: res.data }))
			.catch(error => console.error(error))
	}
}

export const setName = (action) => ({
	type: 'GET_MATCH',
	payload: action.text
})

export const setYear = (action) => ({
	type: 'SET_YEAR',
	payload: action.year
})

export const submitPost = (action) => {
	// Call API with user inputted data to calculate BPO
	return function(dispatch) {
		postApi('https://xegsms2vug.execute-api.us-west-2.amazonaws.com/prod/calcBPO', 'POST', {name: action.name, year: action.year})
			.then(res => dispatch({ type: 'SUBMIT_SUCCESS', payload: res.data }))
			.catch(error => console.error(error))
	}
}