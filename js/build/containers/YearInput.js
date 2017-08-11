'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.YearInput = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _YearSelect = require('../components/YearSelect');

var _YearSelect2 = _interopRequireDefault(_YearSelect);

var _actions = require('../actions/actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var YearInput = exports.YearInput = (0, _reactRedux.connect)(function (state) {
	return {
		year: state.year
	};
}, function (dispatch) {
	return {
		setYear: function setYear(event) {
			console.log("setting year ", event.target.value);
			var year = event.target.value;
			console.log(year);
			dispatch((0, _actions.setYear)({ type: 'SET_YEAR', year: year }));
		}
	};
})(_YearSelect2.default);

exports.default = YearInput;