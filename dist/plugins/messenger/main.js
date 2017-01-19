'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _electron = require('electron');

var _electronWindowState = require('electron-window-state');

var _electronWindowState2 = _interopRequireDefault(_electronWindowState);

var _path = require('path');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (plugins) {
  plugins.on('init', function () {
    var isQuitting = false;

    var windowState = (0, _electronWindowState2.default)({
      defaultWidth: 1000,
      defaultHeight: 800
    });

    var mainWindow = new _electron.BrowserWindow({
      x: windowState.x,
      y: windowState.y,
      width: windowState.width,
      height: windowState.height,
      fullscreen: windowState.fullScreen,
      titleBarStyle: 'hidden'
    });

    windowState.manage(mainWindow);

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/index.html');
    plugins.emit('main-window-loaded', mainWindow);

    // Emitted when the window is closed.
    mainWindow.on('close', function (event) {
      // Call a hide instead of a close when window is closed
      if (!isQuitting) {
        event.preventDefault();
        mainWindow.hide();
      }
    });

    mainWindow.webContents.on('new-window', function (e, url) {
      e.preventDefault();
      require('shell').openExternal(url);
    });

    _electron.app.on('before-quit', function () {
      isQuitting = true;
    });

    _electron.app.on('activate', function () {
      mainWindow.show();
    });
  });
};