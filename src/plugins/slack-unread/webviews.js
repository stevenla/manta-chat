import {ipcRenderer} from 'electron';
const REFRESH_INTERVAL = 2000;

export default (plugins) => {
  plugins.on('load', () => {
    if (location.host.match(/slack\.com/)) {
      setInterval(() => {
        const allUnreadCount = Array.prototype.filter.call(
          document.querySelectorAll('.p-channel_sidebar a'),
          item => item.className.includes('unread') && !item.className.includes('muted')
        ).length;
        ipcRenderer.sendToHost('unread', allUnreadCount);
      }, REFRESH_INTERVAL);
    }
  });
}
