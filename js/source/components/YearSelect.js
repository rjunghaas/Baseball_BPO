import React from 'react'
import reducer from '../reducers/reducer'

const YearSelect = ({ year, setYear }) => (
	<div>
		<select value={year} onChange={setYear} name="year">
			<option value="2016">2016</option>
			<option value="2015">2015</option>
		</select>
	</div>
)

export default YearSelect