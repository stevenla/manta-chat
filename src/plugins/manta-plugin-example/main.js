export default (plugins) => {
  plugins.on('main-window-loaded', () => {
    console.log('logging this to the main console. doesnt do much in live.');
  });
};
