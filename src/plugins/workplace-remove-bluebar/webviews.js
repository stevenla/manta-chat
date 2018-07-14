export default plugins => {
  plugins.on('load', () => {
    if (
      location.host.match(/fb\.facebook\.com/) &&
      location.pathname.match(/^\/chat/)
    ) {
      const sheet = document.createElement('style');
      document.head.appendChild(sheet);
      sheet.innerText = `
        #pagelet_bluebar {
          display: none;
        }
      `;
    }
  });
};
