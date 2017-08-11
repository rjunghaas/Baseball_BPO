import { combineReducers } from 'redux'
import { fetch } from 'isomorphic-fetch'

const reducer = (state = {}, action) => {
	switch(action.type) {
		case 'LOAD_SUCCESS':
			console.log(action.payload);
			return {...state, data: action.payload};
		case 'GET_MATCH':
			var text = action.payload;
			// match input text to closest match in state.data
			var searchdata = state.data.filter(function(name) { 
				return name.toLowerCase().indexOf(text) > -1
			});
			// clear data if input is empty
			text === '' ? searchdata[0] = '' : searchdata[0]
			return {...state,text: text, name: searchdata[0]};
		case 'SET_YEAR':
			return {...state, year: action.payload};
		case 'SUBMIT_SUCCESS':
			return {...state, bpo: action.payload.bpo, lgbpo: action.payload.lgBPO, bpoPlus: action.payload.bpoPlus};
		default:
			return state;
	}
}

export default reducer