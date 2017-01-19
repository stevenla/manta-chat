import React, {Component} from 'react';
import defaultMenu from 'electron-default-menu';
import url from 'url';
import storage from 'electron-json-storage';
import {render} from 'react-dom';
import {shell, remote} from 'electron';

const {app, Menu, MenuItem} = remote;

import SettingsPanel from './components/SettingsPanel';
import WebAppView from './components/WebAppView';
import SwitcherListItem from './components/SwitcherListItem';

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
  webviewContainer: {
    flex: 1,
    position: 'relative',
  },
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
    this.reloadUrls();
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
          {this.state.urls.map((app, index) =>
            <SwitcherListItem
              key={app.url}
              icon={app.icon}
              isActive={index === this.state.active}
              onClick={() => this.setState({active: index})}
              shortcutNumber={index + 1}
            />
          )}
          <SwitcherListItem
            icon='./icons/gear.png'
            isActive
            onClick={() => this.setState({isSettingsOpen: true})}
            style={{marginTop: 'auto'}}
          />
        </ul>
        <div style={styles.webviewContainer}>
          {this.state.urls.map(({url}, index) =>
            <WebAppView
              key={url}
              src={url}
              isActive={index === this.state.active}
            />
          )}
        </div>
      </div>
    )
  }
}

render(<MantaChat />, document.querySelector('.main'));
