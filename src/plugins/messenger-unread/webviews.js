import {ipcRenderer} from 'electron';
const REFRESH_INTERVAL = 2000;

export default (plugins) => {
  plugins.on('load', () => {
    if (location.host.match(/messenger\.com/)) {
      setInterval(() => {
        const lives = document.querySelectorAll('[aria-live]');
        ipcRenderer.sendToHost('unread', lives.length);
      }, REFRESH_INTERVAL);
    }
  });
}
