import PluginManager from '../../PluginManager';
const plugins = new PluginManager('webviews');
plugins.load();

window.addEventListener('load', () => {
  plugins.emit('load');
});
