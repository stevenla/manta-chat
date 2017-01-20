import {ipcRenderer} from 'electron';

const REFRESH_INTERVAL = 500;

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
    const lives = document.querySelectorAll('.unread');
    ipcRenderer.sendToHost('unread', lives.length);
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

window.addEventListener('load', () => {
  overwriteNotifications();
  if (location.host.match(/slack\.com/)) {
    startCheckingUnreadCountSlack();
  }
  if (location.host.match(/messenger\.com/)) {
    startCheckingUnreadCountMessenger();
  }
});
