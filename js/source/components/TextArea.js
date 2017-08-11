import React from 'react'
import reducer from '../reducers/reducer'

const TextArea = ({ text, getMatch, name }) => (
	<div>
		<textarea placeholder="Enter Player's Name" value={text} onChange={getMatch} name="input" />
		<br />
		<h3>{name}</h3>
	</div>
)

export default TextArea