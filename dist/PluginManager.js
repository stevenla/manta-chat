'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _path = require('path');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PluginManager = function (_EventEmitter) {
  _inherits(PluginManager, _EventEmitter);

  function PluginManager(type) {
    var _ref;

    _classCallCheck(this, PluginManager);

    for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      rest[_key - 1] = arguments[_key];
    }

    var _this = _possibleConstructorReturn(this, (_ref = PluginManager.__proto__ || Object.getPrototypeOf(PluginManager)).call.apply(_ref, [this, type].concat(rest)));

    _this.type = type;
    return _this;
  }

  _createClass(PluginManager, [{
    key: 'load',
    value: function load(pluginNames) {
      var _this2 = this;

      pluginNames.forEach(function (pluginName) {
        try {
          // Get the filename from config
          var pluginRoot = (0, _path.join)('./plugins/', pluginName);
          var config = require('./' + (0, _path.join)(pluginRoot, 'plugin.json'));

          // Require the correct plugin
          if (_this2.type) {
            var plugin = require('./' + (0, _path.join)(pluginRoot, _this2.type));
            if (plugin.__esModule) {
              plugin = plugin.default;
            }
            // Call the plugin with the manager as the first argument to load
            plugin(_this2);
          }
        } catch (error) {
          console.error(error);
        }
      });
    }
  }]);

  return PluginManager;
}(_events.EventEmitter);

exports.default = PluginManager;