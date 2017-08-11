'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.postApi = exports.getApi = undefined;

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Helper  function for GET request to get list of players in database from server
var getApi = exports.getApi = function getApi(url) {
	return (0, _isomorphicFetch2.default)(url).then(function (res) {
		return res.json();
	}).catch(function (err) {
		return console.log(err);
	});
};

// Helper function for posting inputted data to server to get BPO
var postApi = exports.postApi = function postApi(url, method, obj) {
	var str = JSON.stringify(obj);
	return (0, _isomorphicFetch2.default)(url, {
		method: method,
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: str
	}).then(function (res) {
		return res.json();
	}).catch(function (err) {
		return console.log(err);
	});
};