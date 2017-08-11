import React from 'react'
import { PlayerInput } from '../containers/PlayerInput'
import { YearInput } from '../containers/YearInput'
import { SubmitInput } from '../containers/SubmitInput'

const App = () => 
	<div className="app">
		<PlayerInput />
		<YearInput />
		<SubmitInput />
	</div>

export default App