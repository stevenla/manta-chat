import Cookie from 'js-cookie';
/**
 * Manually set device pixel ratio to 2x
 */
export default (plugins) => {
  plugins.on('load', () => {
    if (location.host.match(/messenger\.com/) || location.host.match(/facebook\.com/)) {
      Cookie.set('dpr', '2');
    }
  });
}
