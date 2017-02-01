/**
 * Manually set device pixel ratio to 2x
 */
export default (plugins) => {
  plugins.on('load', () => {
    if (location.host.match(/messenger\.com/)) {
      window.setCookie('dpr', '2');
    }
  });
}
