import { EventEmitter } from 'events';
import { join } from 'path';
const enabledPlugins = require('./enabled-plugins.json');

export default class PluginManager extends EventEmitter {
  constructor(type, ...rest) {
    super(type, ...rest);
    this.type = type;
  }

  load() {
    enabledPlugins.forEach(pluginName => {
      try {
        // Get the filename from config
        const pluginRoot = join(__dirname, 'plugins', pluginName);

        // Require the correct plugin
        if (this.type) {
          let plugin = require(join(pluginRoot, this.type));
          if (plugin.__esModule) {
            plugin = plugin.default;
          }
          // Call the plugin with the manager as the first argument to load
          plugin(this);
        }
      } catch (error) {
        console.error(error);
      }
    });
  }
}
