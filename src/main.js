import { app } from 'electron';
import PluginManager from './PluginManager';
const enabledPlugins = require('./enabled-plugins.json');

const plugins = new PluginManager('main');

app.on('ready', () => {
  plugins.load(enabledPlugins);
  plugins.emit('init');
});
