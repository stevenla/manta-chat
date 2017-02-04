export default (plugins) => {
  plugins.on('main-app-mounted', () => {
    alert('Hello from manta-plugin-example!');
  });
};
