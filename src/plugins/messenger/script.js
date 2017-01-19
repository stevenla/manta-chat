import React, {Component} from 'react';
import defaultMenu from 'electron-default-menu';
import url from 'url';
import storage from 'electron-json-storage';
import {render} from 'react-dom';
import {shell, remote} from 'electron';

const {app, Menu, MenuItem} = remote;

import SettingsPanel from './components/SettingsPanel';

const styles = {
  main: {
    bottom: 0,
    display: 'flex',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  switcher: {
    flex: '0 0 68px',
    borderRight: '1px solid #1A1D23',
    margin: 0,
    padding: 0,
    paddingTop: 30,
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#2B303B',
    WebkitAppRegion: 'drag',
    userSelect: 'none',
  },
  switcherLi: (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    ...(isActive
      ? {}
      : {opacity: .5}
    ),
  }),
  switcherButton: {
    width: 68,
    height: 68,
    border: 0,
    backgroundColor: 'transparent',
    padding: 0,
    outline: 'none',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switcherIcon: {
    width: 32,
    height: 32,
    padding: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
  },
  switcherShortcut: {
    marginTop: 4,
    padding: '1px 4px',
    color: '#9BA3B5',
    display: 'inline',
    borderRadius: 4,
  },
  webviewContainer: {
    flex: 1,
    position: 'relative',
  },
  webview: (isActive) => ({
    width: '100%',
    height: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    ...(isActive
      ? {zIndex: 10}
      : {visibility: 'hidden'}
    ),
  }),
  draggable: {
    height: 50,
    width: '100%',
    position: 'absolute',
    zIndex: 999,
    userSelect: 'none',
    WebkitAppRegion: 'drag',
    pointerEvents: 'none',
  }
};

class MantaChat extends Component {
  state = {
    active: 0,
    urls: [],
    isSettingsOpen: false,
  };

  componentDidMount() {
    this.attachClickHandlers();
    this.reloadUrls();
  }

  componentWillUnmount() {
    this.detachClickHandlers();
  }

  componentWillUpdate(nextProps, nextState) {
    this.buildMenus(nextState.urls);
  }

  reloadUrls() {
    storage.get('urls', (error, data) => {
      const urls = data.result || [];
      this.setState({urls});
    });
  }

  handleSettingsChange = (urls) =>{
    this.setState({ urls, isSettingsOpen: false });
    storage.set('urls', {result: urls});
  }

  buildMenus(urls) {
    const menu = defaultMenu(app, shell);
    menu[3].submenu.splice(3, 1, ...urls.map(({name}, index) => ({
        accelerator: `CmdOrCtrl+${index + 1}`,
        label: name,
        click: () => this.setState({active: index}),
      }))
    );
    Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
  }

  attachClickHandlers = () => {
    document.querySelectorAll('webview').forEach(webView => {
      webView.addEventListener('new-window', this.handleLinkClick);
    });
  }

  detachClickHandlers = () => {
    document.querySelectorAll('webview').forEach(webView => {
      webView.removeEventListener('new-window', this.handleLinkClick);
    });
  }

  handleLinkClick(event) {
    const protocol = url.parse(event.url).protocol;
    if (protocol === 'http:' || protocol === 'https:') {
      shell.openExternal(event.url);
    }
  }

  render() {
    return (
      <div style={styles.main}>
        <div style={styles.draggable} />
        <SettingsPanel
          urls={this.state.urls}
          onChange={this.handleSettingsChange}
          isOpen={this.state.isSettingsOpen}
          onClose={() => this.setState({isSettingsOpen: false})}
        />
        <ul style={styles.switcher}>
          {this.state.urls.map(({url, icon}, index) =>
            <li key={url} style={styles.switcherLi(this.state.active === index)}>
              <button
                onClick={() => this.setState({active: index})}
                style={styles.switcherButton}
              >
                <img
                  src={`./icons/${icon}`}
                  style={styles.switcherIcon}
                />
                <div style={styles.switcherShortcut}>⌘{index + 1}</div>
              </button>
            </li>
          )}
          <li
            style={{ flex: '0 0', marginTop: 'auto' }}
          >
            <button style={styles.switcherButton} onClick={() => this.setState({isSettingsOpen: true})}>
              settings
            </button>
          </li>
        </ul>
        <div style={styles.webviewContainer}>
          {this.state.urls.map(({url}, index) =>
            <webview
              key={url}
              src={url}
              style={styles.webview(this.state.active === index)}
            />
          )}
        </div>
      </div>
    )
  }
}

render(<MantaChat />, document.querySelector('.main'));
