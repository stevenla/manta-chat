import React, {Component} from 'react';
import fs from 'fs';
import path from 'path';
import homedir from 'homedir';
import mkdirp from 'mkdirp';

const FILE_ROOT = `${homedir()}/.config/manta`;
const CONFIG_FILE = `${FILE_ROOT}/manta.json`;
const DEFAULT_SETTINGS = {
  apps: [
    {
      name: 'Messenger',
      icon: './icons/messenger.png',
      url: 'https://messenger.com',
    },
  ],
  plugins: [
    {
      path: 'manta-plugin-example',
      enabled: true,
      options: {},
    },
  ],
};

/**
 * Higher order component to link config with ~/.config/manta
 */
export default function withDotfiles(MyComponent) {
  class DotfilesConfig extends Component {
    state = {
      config: {
        apps: [],
        plugins: [],
      },
    };

    componentDidMount() {
      this.readJSON((err, json) => {
        this.setState({config: json});
      })
    }

    handleConfigChange = (config) => {
      // TODO: this seriously needs error handling
      this.setState({config});
      this.writeJSON(config);
    }

    writeJSON(json, cb) {
      mkdirp.sync(FILE_ROOT);
      fs.writeFileSync(
        CONFIG_FILE,
        JSON.stringify(json, null, 2),
        'utf8',
        cb
      );
    }

    readJSON(cb) {
      fs.readFile(CONFIG_FILE, 'utf8', (err, data) => {
        if (err) {
          if (err.message.match(/^ENOENT/)) {
            // File doesn't exist, make a default one
            this.writeJSON(DEFAULT_SETTINGS, () => {
              cb(null, DEFAULT_SETTINGS);
            });
          } else {
            // We got another error
            alert(`We couldn't load your config. Sorry!`);
            cb(err, null);
          }
        } else {
          cb(null, JSON.parse(data));
        }
      });
    }

    render() {
      return (
        <MyComponent
          config={this.state.config}
          onConfigChange={this.handleConfigChange}
          {...this.props}
        />
      );
    }
  }

  DotfilesConfig.displayName = `withDotfiles(${MyComponent.displayName})`;
  return DotfilesConfig;
}
