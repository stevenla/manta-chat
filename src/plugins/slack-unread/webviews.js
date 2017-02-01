import {ipcRenderer} from 'electron';
const REFRESH_INTERVAL = 2000;

export default (plugins) => {
  plugins.on('load', () => {
    if (location.host.match(/slack\.com/)) {
      setInterval(() => {
        const allUnreadCount = document.querySelectorAll('.section_holder .unread').length;
        ipcRenderer.sendToHost('unread', allUnreadCount);
      }, REFRESH_INTERVAL);
    }
  });
}
