// TODO: move most of this logic to separate plugins
import {ipcRenderer} from 'electron';

const REFRESH_INTERVAL = 2000;

function overwriteNotifications() {
  const OldNotification = Notification;

  Notification = function (title, options) {
    // Send the native Notification.
    // You can't catch it, that's why we're doing all of this. :)
    const opt = {
      ...options,
      silent: true,
    };

    const notif = new OldNotification(title, opt);

    let superClick = () => {};
    notif.onclick = () => {
      ipcRenderer.sendToHost('focus');
      superClick();
    };
    Object.defineProperty(notif, 'onclick', { set: (fn) => superClick = fn });

    return notif;
  };

  Notification.prototype = OldNotification.prototype;
  Notification.permission = OldNotification.permission;
  Notification.requestPermission = OldNotification.requestPermission;
}

function startCheckingUnreadCountSlack() {
  setTimeout(() => {
    const allUnreadCount = document.querySelectorAll('.section_holder .unread').length;
    // const hiddenUnreadCount = document.querySelectorAll('.hidden.unread').length;
    const hiddenUnreadCount = 0;
    ipcRenderer.sendToHost('unread', allUnreadCount - hiddenUnreadCount);
    startCheckingUnreadCountSlack();
  }, REFRESH_INTERVAL);
}

function startCheckingUnreadCountMessenger() {
  setTimeout(() => {
    const lives = document.querySelectorAll('[aria-live]');
    ipcRenderer.sendToHost('unread', lives.length);
    startCheckingUnreadCountMessenger();
  }, REFRESH_INTERVAL);
}

function addPushbulletStyles() {
  const sheet = document.createElement('style');
  document.head.appendChild(sheet);
  sheet.innerText = `
  /*
  #header { display: none !important }
  #sink > div { top: 0 !important }
  */
  #header {
    height: 50px !important;
  }
  .logo {
    bottom: 10px !important;
  }
  .logo img {
    height: 100% !important;
    width: auto !important;
  }
  #account-btn {
    width: 30px !important;
    height: 30px !important;
    background-size: 30px 30px !important;
    border-radius: 15px !important;
    border-width: 2px !important;
  }
  #sink > div:nth-child(2) { top: 50px !important }
  .navigation { display: none !important }
  #header + div > div > div:first-child { display: none !important }
  #header + div > div > div:nth-child(2) {
    left: 0 !important;
    width: 250px !important;
  }
  #mainbar {
    left: 250px !important;
    width: auto !important;
  }
  #sidebar > div:first-child { display: none !important }
  #sidebar > div:nth-child(2) { display: none !important }
  `
}

window.addEventListener('load', () => {
  overwriteNotifications();
  if (location.host.match(/slack\.com/)) {
    startCheckingUnreadCountSlack();
  }
  if (location.host.match(/messenger\.com/)) {
    startCheckingUnreadCountMessenger();
    window.setCookie('dpr', '2');  // Manually set device pixel ratio
  }
  if (location.host.match(/pushbullet\.com/)) {
    addPushbulletStyles();
  }
});
