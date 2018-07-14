export default plugins => {
  plugins.on('load', () => {
    if (location.host.match(/pushbullet\.com/)) {
      const sheet = document.createElement('style');
      document.head.appendChild(sheet);
      sheet.innerText = `
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
      `;

      document.addEventListener('click', event => {
        const pushList = document.querySelector('#pushlist');
        const contains = pushList && pushList.contains(event.target);
        if (contains) {
          document.querySelector('#message').focus();
        }
      });
    }
  });
};
