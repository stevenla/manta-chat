'use strict';

var _electron = require('electron');

var _PluginManager = require('./PluginManager');

var _PluginManager2 = _interopRequireDefault(_PluginManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var enabledPlugins = require('./enabled-plugins.json');

var plugins = new _PluginManager2.default('main');

_electron.app.on('ready', function () {
  plugins.load(enabledPlugins);
  plugins.emit('init');
});