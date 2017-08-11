'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reducer = require('../reducers/reducer');

var _reducer2 = _interopRequireDefault(_reducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TextArea = function TextArea(_ref) {
	var text = _ref.text,
	    getMatch = _ref.getMatch,
	    name = _ref.name;
	return _react2.default.createElement(
		'div',
		null,
		_react2.default.createElement('textarea', { placeholder: 'Enter Player\'s Name', value: text, onChange: getMatch, name: 'input' }),
		_react2.default.createElement('br', null),
		_react2.default.createElement(
			'h3',
			null,
			name
		)
	);
};

exports.default = TextArea;