import { app } from 'electron';
import PluginManager from './PluginManager';

const plugins = new PluginManager('main');

app.on('ready', () => {
  plugins.load();
  plugins.emit('init');
});
