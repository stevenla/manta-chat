import { app, BrowserWindow } from 'electron';
import windowStateKeeper from 'electron-window-state';
import { join, resolve } from 'path';

export default (plugins) => {
  plugins.on('init', () => {
    let isQuitting = false;

    const windowState = windowStateKeeper({
      defaultWidth: 1000,
      defaultHeight: 800,
    });

    const mainWindow = new BrowserWindow({
      x: windowState.x,
      y: windowState.y,
      width: windowState.width,
      height: windowState.height,
      fullscreen: windowState.fullScreen,
      titleBarStyle: 'hidden',
    });

    windowState.manage(mainWindow);

    // and load the index.html of the app.
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    plugins.emit('main-window-loaded', mainWindow);

    // Emitted when the window is closed.
    mainWindow.on('close', (event) => {
      // Call a hide instead of a close when window is closed
      if (!isQuitting) {
        event.preventDefault();
        mainWindow.hide();
      }
    });

    app.on('before-quit', () => {
      isQuitting = true;
    });

    app.on('activate', () => {
      mainWindow.show();
    });
  });
};
