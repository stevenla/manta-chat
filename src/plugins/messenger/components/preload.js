import {ipcRenderer} from 'electron';

const REFRESH_INTERVAL = 500;

function startCheckingUnreadCountMessenger() {
  setTimeout(() => {
    const lives = document.querySelectorAll('[aria-live]');
    ipcRenderer.sendToHost('unread', lives.length);
    startCheckingUnreadCountMessenger();
  }, REFRESH_INTERVAL);
}

window.addEventListener('load', () => {
  if (location.host.match(/messenger\.com/)) {
    startCheckingUnreadCountMessenger();
  }
});
