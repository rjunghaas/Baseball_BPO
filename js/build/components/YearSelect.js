'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reducer = require('../reducers/reducer');

var _reducer2 = _interopRequireDefault(_reducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var YearSelect = function YearSelect(_ref) {
	var year = _ref.year,
	    setYear = _ref.setYear;
	return _react2.default.createElement(
		'div',
		null,
		_react2.default.createElement(
			'select',
			{ value: year, onChange: setYear, name: 'year' },
			_react2.default.createElement(
				'option',
				{ value: '2016' },
				'2016'
			),
			_react2.default.createElement(
				'option',
				{ value: '2015' },
				'2015'
			)
		)
	);
};

exports.default = YearSelect;