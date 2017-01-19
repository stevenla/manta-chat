import React, {Component} from 'react';
import {render} from 'react-dom';
import url from 'url';
import {shell, remote} from 'electron';
const {app, Menu, MenuItem} = remote;
const defaultMenu = require('electron-default-menu');


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
    borderRight: '1px solid #CCCCCC',
    margin: 0,
    padding: 0,
    paddingTop: 30,
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column'
  },
  switcherLi: (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    ...(isActive
      ? {}
      : {opacity: .5}
    )
  }),
  switcherButton: {
    width: 68,
    height: 68,
    border: 0,
    backgroundColor: 'transparent',
    padding: 0,
    outline: 'none',
    cursor: 'pointer',
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
      ? {zIndex: 999}
      : {visibility: 'hidden'}
    ),
  }),
};

const webviewStyle = {

}

const urls = [
  {url: 'https://messenger.com', icon: 'messenger.png'},
  {url: 'https://fb.messenger.com', icon: 'workplace.png'},
];

class MantaChat extends Component {
  state = {
    active: 0,
  };

  componentDidMount() {
    document.querySelectorAll('webview').forEach(webView => {
      webView.addEventListener('new-window', this.handleLinkClick);
    });


    const menu = defaultMenu(app, shell);
    menu.splice(4, 0, {
      label: 'Tabs',
      submenu: [
        {
          accelerator: 'CmdOrCtrl+1',
          label: 'Messenger',
          click: () => this.setState({active: 0}),
        },
        {
          accelerator: 'CmdOrCtrl+2',
          label: 'Workplace',
          click: () => this.setState({active: 1}),
        },
      ]
    });
    Menu.setApplicationMenu(Menu.buildFromTemplate(menu));

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
        <ul style={styles.switcher}>
          {urls.map(({url, icon}, index) =>
            <li key={url} style={styles.switcherLi(this.state.active === index)}>
              <button
                onClick={() => this.setState({active: index})}
                style={styles.switcherButton}
              >
                <img src={`./icons/${icon}`} />
                <div>⌘{index + 1}</div>
              </button>
            </li>
          )}
        </ul>
        <div style={styles.webviewContainer}>
          {urls.map(({url}, index) =>
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
