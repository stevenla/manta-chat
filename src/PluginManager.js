import { EventEmitter } from 'events';
import {resolve} from 'path';
import exists from 'node-file-exists';
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
        const pluginRoot = resolve(__dirname, 'plugins', pluginName);

        // Require the correct plugin
        if (this.type) {
          const path = resolve(pluginRoot, this.type);
          if (exists(`${path}.js`)) {
            let plugin = require(path);
            if (plugin.__esModule) {
              plugin = plugin.default;
            }
            // Call the plugin with the manager as the first argument to load
            plugin(this);
          }
        }
      } catch (error) {
        console.error(error);
      }
    });
  }
}
