import fs from 'fs';
import path from 'path';
import homedir from 'homedir';
import mkdirp from 'mkdirp';
import exists from 'node-file-exists';

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
      enabled: false,
      options: {},
    },
  ],
};

export function writeJSONSync(json) {
  mkdirp.sync(FILE_ROOT);
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(json, null, 2), 'utf8');
}

export function readJSON(cb) {
  fs.readFile(CONFIG_FILE, 'utf8', (err, data) => {
    if (err) {
      if (err.message.match(/^ENOENT/)) {
        // File doesn't exist, make a default one
        writeJSONSync(DEFAULT_SETTINGS);
        cb(null, DEFAULT_SETTINGS);
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

export function readJSONSync() {
  if (!exists(CONFIG_FILE)) {
    writeJSONSync(DEFAULT_SETTINGS);
  }
  return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
}
