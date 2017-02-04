import { EventEmitter } from 'events';
import {resolve} from 'path';
import exists from 'node-file-exists';
import * as config from './config';

const enabledPlugins = require('./enabled-plugins.json');

function makeConfigPluginEnabledMap(plugins) {
  const map = {};
  plugins.forEach(plugin => {
    map[plugin.path] = plugin.enabled;
  });
  return map;
}

export default class PluginManager extends EventEmitter {
  constructor(type, ...rest) {
    super(type, ...rest);
    this.type = type;
    this.config = config;
  }

  load() {
    // TODO: need to fix this and make it not iterate over and over
    const config = this.config.readJSONSync();
    const enabledMap = makeConfigPluginEnabledMap(config.plugins);
    const enabledPluginsWithoutDisabled = enabledPlugins
      .filter(plugin =>
        !enabledMap.hasOwnProperty(plugin) || enabledMap[plugin]
      );
    const configPlugins = config.plugins
      .filter(plugin => plugin.enabled)
      .map(plugin => plugin.path);
    const plugins = [...enabledPluginsWithoutDisabled, ...configPlugins];
    plugins.forEach(pluginName => {
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
