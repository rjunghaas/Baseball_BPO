'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.submitPost = exports.setYear = exports.setName = exports.getData = undefined;

var _api = require('./api');

var getData = exports.getData = function getData() {
	return function (dispatch) {
		// Call api for getting players data
		return (0, _api.getApi)('https://xegsms2vug.execute-api.us-west-2.amazonaws.com/prod/getPlayers').then(function (res) {
			return dispatch({ type: 'LOAD_SUCCESS', payload: res.data });
		}).catch(function (error) {
			return console.error(error);
		});
	};
};

var setName = exports.setName = function setName(action) {
	return {
		type: 'GET_MATCH',
		payload: action.text
	};
};

var setYear = exports.setYear = function setYear(action) {
	return {
		type: 'SET_YEAR',
		payload: action.year
	};
};

var submitPost = exports.submitPost = function submitPost(action) {
	// Call API with user inputted data to calculate BPO
	return function (dispatch) {
		(0, _api.postApi)('https://xegsms2vug.execute-api.us-west-2.amazonaws.com/prod/calcBPO', 'POST', { name: action.name, year: action.year }).then(function (res) {
			return dispatch({ type: 'SUBMIT_SUCCESS', payload: res.data });
		}).catch(function (error) {
			return console.error(error);
		});
	};
};