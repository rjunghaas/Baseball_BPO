import React from 'react'
import { getState } from 'redux'
import { connect } from 'react-redux'
import SubmitButton from '../components/SubmitButton'
import { submitPost } from '../actions/actions'

export const SubmitInput = connect(
	state => ({
		name: state.name,
		year: state.year,
		bpo: state.bpo,
		lgbpo: state.lgbpo,
		bpoPlus: state.bpoPlus
	}),
	
	dispatch => ({
		submitForm: (name, year) => {
			dispatch(submitPost({type: 'GET_BPO', name, year}));
		}
	})
)(SubmitButton)

export default SubmitInput