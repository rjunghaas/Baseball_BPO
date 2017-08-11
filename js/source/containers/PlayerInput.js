import React from 'react'
import { connect } from 'react-redux'
import TextArea from '../components/TextArea'
import { loadInitialData, setName } from '../actions/actions'

export const PlayerInput = connect(
	// 'Getters' for this container
	state =>
		({
			text: state.text,
			data: state.data,
			name: state.name
		}),
	
	// 'Setters' for container
	dispatch =>
		({
			getMatch: event => {
				var text = event.target.value
				dispatch(setName({type: 'SET_NAME', text}));
			}
		})
)(TextArea)

export default PlayerInput