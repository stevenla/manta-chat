import { app } from 'electron';
import PluginManager from './PluginManager';

const plugins = new PluginManager('main');

app.disableHardwareAcceleration();
app.on('ready', () => {
  plugins.load();
  plugins.emit('init');
});
