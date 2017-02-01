export default (plugins) => {
  plugins.on('load', () => {
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
  });
}
