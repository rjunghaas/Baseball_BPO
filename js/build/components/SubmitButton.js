'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reducer = require('../reducers/reducer');

var _reducer2 = _interopRequireDefault(_reducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// preventDefault() stops page reload on Form submission
var SubmitButton = function SubmitButton(_ref) {
	var bpo = _ref.bpo,
	    lgbpo = _ref.lgbpo,
	    bpoPlus = _ref.bpoPlus,
	    submitForm = _ref.submitForm,
	    name = _ref.name,
	    year = _ref.year;
	return _react2.default.createElement(
		'div',
		null,
		_react2.default.createElement(
			'form',
			{ onSubmit: function onSubmit(e) {
					e.preventDefault();
					submitForm(name, year);
				} },
			_react2.default.createElement(
				'button',
				{ name: 'submit' },
				'Submit'
			),
			_react2.default.createElement('br', null),
			_react2.default.createElement(
				'h3',
				null,
				'BPO: ',
				bpo
			),
			_react2.default.createElement(
				'h3',
				null,
				'LgBPO: ',
				lgbpo
			),
			_react2.default.createElement(
				'h3',
				null,
				'BPO+: ',
				bpoPlus
			)
		)
	);
};

exports.default = SubmitButton;