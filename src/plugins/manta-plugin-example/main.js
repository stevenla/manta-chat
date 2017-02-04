import { app, BrowserWindow } from 'electron';

export default (plugins) => {
  plugins.on('main-window-loaded', () => {
    const win = new BrowserWindow();
    win.loadURL(`file://${__dirname}/example.html`);
  });
};
