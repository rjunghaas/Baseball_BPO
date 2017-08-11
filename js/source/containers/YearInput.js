import React from 'react'
import { connect } from 'react-redux'
import YearSelect from '../components/YearSelect'
import { setYear } from '../actions/actions'

export const YearInput = connect(
	state => ({ 
		year: state.year
	}),
	
	dispatch => ({
		setYear: event => {
			console.log("setting year ", event.target.value);
			var year = event.target.value;
			console.log(year);
			dispatch(setYear({ type: 'SET_YEAR', year }));
		}
	})
)(YearSelect)

export default YearInput