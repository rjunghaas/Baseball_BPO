'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _PlayerInput = require('../containers/PlayerInput');

var _YearInput = require('../containers/YearInput');

var _SubmitInput = require('../containers/SubmitInput');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var App = function App() {
	return _react2.default.createElement(
		'div',
		{ className: 'app' },
		_react2.default.createElement(_PlayerInput.PlayerInput, null),
		_react2.default.createElement(_YearInput.YearInput, null),
		_react2.default.createElement(_SubmitInput.SubmitInput, null)
	);
};

exports.default = App;