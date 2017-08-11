'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.SubmitInput = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _SubmitButton = require('../components/SubmitButton');

var _SubmitButton2 = _interopRequireDefault(_SubmitButton);

var _actions = require('../actions/actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SubmitInput = exports.SubmitInput = (0, _reactRedux.connect)(function (state) {
	return {
		name: state.name,
		year: state.year,
		bpo: state.bpo,
		lgbpo: state.lgbpo,
		bpoPlus: state.bpoPlus
	};
}, function (dispatch) {
	return {
		submitForm: function submitForm(name, year) {
			dispatch((0, _actions.submitPost)({ type: 'GET_BPO', name: name, year: year }));
		}
	};
})(_SubmitButton2.default);

exports.default = SubmitInput;