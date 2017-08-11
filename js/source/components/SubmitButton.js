import React from 'react'
import reducer from '../reducers/reducer'

// preventDefault() stops page reload on Form submission
const SubmitButton = ({ bpo, lgbpo, bpoPlus, submitForm, name, year }) => (
	<div>
		<form onSubmit={(e) => {
			e.preventDefault()
			submitForm(name, year)
			}}>
			<button name="submit">Submit</button>
			<br />
			<h3>BPO: {bpo}</h3>
			<h3>LgBPO: {lgbpo}</h3>
			<h3>BPO+: {bpoPlus}</h3>
		</form>
	</div>
)

export default SubmitButton