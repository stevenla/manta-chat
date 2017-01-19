import { EventEmitter } from 'events';
import { join } from 'path';

export default class PluginManager extends EventEmitter {
  constructor(type, ...rest) {
    super(type, ...rest);
    this.type = type;
  }

  load(pluginNames) {
    pluginNames.forEach(pluginName => {
      try {
        // Get the filename from config
        const pluginRoot = join('./plugins/', pluginName);
        const config = require('./' + join(pluginRoot, 'plugin.json'));

        // Require the correct plugin
        if (this.type) {
          let plugin = require('./' + join(pluginRoot, this.type));
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
