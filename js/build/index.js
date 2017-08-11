'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _App = require('./components/App');

var _App2 = _interopRequireDefault(_App);

var _reducer = require('./reducers/reducer');

var _reducer2 = _interopRequireDefault(_reducer);

var _actions = require('./actions/actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// set year to 2016 initially
var INITIAL_DATA = { year: '2016' };

var store = (0, _redux.createStore)(_reducer2.default, INITIAL_DATA, (0, _redux.applyMiddleware)(_reduxThunk2.default));

// Call api to get initial list of players' names
store.dispatch((0, _actions.getData)());

(0, _reactDom.render)(_react2.default.createElement(
    _reactRedux.Provider,
    { store: store },
    _react2.default.createElement(_App2.default, null)
), document.getElementById('form'));