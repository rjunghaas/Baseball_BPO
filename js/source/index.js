import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import App from './components/App'
import reducer from './reducers/reducer'
import { getData } from './actions/actions'

// set year to 2016 initially
const INITIAL_DATA = {year: '2016'};

const store = createStore(reducer, INITIAL_DATA, applyMiddleware(thunk));

// Call api to get initial list of players' names
store.dispatch(getData());

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('form')
)