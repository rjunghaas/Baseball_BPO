'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _redux = require('redux');

var _isomorphicFetch = require('isomorphic-fetch');

var reducer = function reducer() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var action = arguments[1];

	switch (action.type) {
		case 'LOAD_SUCCESS':
			console.log(action.payload);
			return _extends({}, state, { data: action.payload });
		case 'GET_MATCH':
			var text = action.payload;
			// match input text to closest match in state.data
			var searchdata = state.data.filter(function (name) {
				return name.toLowerCase().indexOf(text) > -1;
			});
			// clear data if input is empty
			text === '' ? searchdata[0] = '' : searchdata[0];
			return _extends({}, state, { text: text, name: searchdata[0] });
		case 'SET_YEAR':
			return _extends({}, state, { year: action.payload });
		case 'SUBMIT_SUCCESS':
			return _extends({}, state, { bpo: action.payload.bpo, lgbpo: action.payload.lgBPO, bpoPlus: action.payload.bpoPlus });
		default:
			return state;
	}
};

exports.default = reducer;