'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.PlayerInput = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _TextArea = require('../components/TextArea');

var _TextArea2 = _interopRequireDefault(_TextArea);

var _actions = require('../actions/actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PlayerInput = exports.PlayerInput = (0, _reactRedux.connect)(
// 'Getters' for this container
function (state) {
	return {
		text: state.text,
		data: state.data,
		name: state.name
	};
},

// 'Setters' for container
function (dispatch) {
	return {
		getMatch: function getMatch(event) {
			var text = event.target.value;
			dispatch((0, _actions.setName)({ type: 'SET_NAME', text: text }));
		}
	};
})(_TextArea2.default);

exports.default = PlayerInput;