'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _electron = require('electron');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var app = _electron.remote.app,
    Menu = _electron.remote.Menu,
    MenuItem = _electron.remote.MenuItem;

var defaultMenu = require('electron-default-menu');

var styles = {
  main: {
    bottom: 0,
    display: 'flex',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  },
  switcher: {
    flex: '0 0 68px',
    borderRight: '1px solid #CCCCCC',
    margin: 0,
    padding: 0,
    paddingTop: 30,
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column'
  },
  switcherLi: function switcherLi(isActive) {
    return _extends({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 15
    }, isActive ? {} : { opacity: .5 });
  },
  switcherButton: {
    width: 68,
    height: 68,
    border: 0,
    backgroundColor: 'transparent',
    padding: 0,
    outline: 'none',
    cursor: 'pointer'
  },
  webviewContainer: {
    flex: 1,
    position: 'relative'
  },
  webview: function webview(isActive) {
    var _extends2;

    return _extends((_extends2 = {
      width: '100%',
      height: '100%',
      position: 'absolute',
      bottom: 0,
      left: 0
    }, _defineProperty(_extends2, 'position', 'absolute'), _defineProperty(_extends2, 'right', 0), _defineProperty(_extends2, 'top', 0), _extends2), isActive ? { zIndex: 999 } : { visibility: 'hidden' });
  }
};

var webviewStyle = {};

var urls = [{ url: 'https://messenger.com', icon: 'messenger.png' }, { url: 'https://fb.messenger.com', icon: 'workplace.png' }];

var MantaChat = function (_Component) {
  _inherits(MantaChat, _Component);

  function MantaChat() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, MantaChat);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = MantaChat.__proto__ || Object.getPrototypeOf(MantaChat)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      active: 0
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(MantaChat, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      document.querySelectorAll('webview').forEach(function (webView) {
        webView.addEventListener('new-window', _this2.handleLinkClick);
      });

      var menu = defaultMenu(app, _electron.shell);
      menu.splice(4, 0, {
        label: 'Tabs',
        submenu: [{
          accelerator: 'CmdOrCtrl+1',
          label: 'Messenger',
          click: function click() {
            return _this2.setState({ active: 0 });
          }
        }, {
          accelerator: 'CmdOrCtrl+2',
          label: 'Workplace',
          click: function click() {
            return _this2.setState({ active: 1 });
          }
        }]
      });
      Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
    }
  }, {
    key: 'handleLinkClick',
    value: function handleLinkClick(event) {
      var protocol = _url2.default.parse(event.url).protocol;
      if (protocol === 'http:' || protocol === 'https:') {
        _electron.shell.openExternal(event.url);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return _react2.default.createElement(
        'div',
        { style: styles.main },
        _react2.default.createElement(
          'ul',
          { style: styles.switcher },
          urls.map(function (_ref2, index) {
            var url = _ref2.url,
                icon = _ref2.icon;
            return _react2.default.createElement(
              'li',
              { key: url, style: styles.switcherLi(_this3.state.active === index) },
              _react2.default.createElement(
                'button',
                {
                  onClick: function onClick() {
                    return _this3.setState({ active: index });
                  },
                  style: styles.switcherButton
                },
                _react2.default.createElement('img', { src: './icons/' + icon }),
                _react2.default.createElement(
                  'div',
                  null,
                  '\u2318',
                  index + 1
                )
              )
            );
          })
        ),
        _react2.default.createElement(
          'div',
          { style: styles.webviewContainer },
          urls.map(function (_ref3, index) {
            var url = _ref3.url;
            return _react2.default.createElement('webview', {
              key: url,
              src: url,
              style: styles.webview(_this3.state.active === index)
            });
          })
        )
      );
    }
  }]);

  return MantaChat;
}(_react.Component);

(0, _reactDom.render)(_react2.default.createElement(MantaChat, null), document.querySelector('.main'));