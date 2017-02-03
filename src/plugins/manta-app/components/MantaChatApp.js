import React, {Component} from 'react';
import storage from 'electron-json-storage';
import {remote} from 'electron';

import SettingsView from './SettingsView';
import WebAppView from './WebAppView';
import SwitcherListItem from './SwitcherListItem';
import MenuBuilder from './MenuBuilder';
import DraggableArea from './DraggableArea';

const styles = {
  main: {
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
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
};

export default class MantaChatApp extends Component {
  state = {
    active: 0,
    apps: [],
    unreads: {},
    isSettingsOpen: false,
  };

  componentDidMount() {
    this.reloadUrls();
  }

  reloadUrls() {
    storage.get('apps', (error, data) => {
      const apps = data.result || [];
      this.setState({apps});
    });
  }

  handleSettingsChange = (apps) => {
    this.setState({ apps, isSettingsOpen: false });
    storage.set('apps', {result: apps});
  }

  handleUnreadChange = (index, count) => {
    if (this.state.unreads[index] !== count) {
      const unreads = {...this.state.unreads};
      unreads[index] = count;
      this.setState({ unreads });
      const totalUnread = Object.keys(unreads)
        .reduce((acc, i) => acc + unreads[i], 0);
      remote.app.setBadgeCount(totalUnread);
    }
  }

  handleFocusChange = (index) => {
    this.setState({active: index});
  }

  handleActiveReload = () => {
    if (this.state.active >= 0) {
      const wv = document.querySelector(`webview:nth-child(${this.state.active + 1})`);
      wv.reload();
    }
  }

  render() {
    return (
      <div style={styles.main}>
        <DraggableArea />
        <MenuBuilder
          apps={this.state.apps}
          onActiveChange={(index) => this.setState({active: index})}
          onActiveReload={this.handleActiveReload}
        />
        <ul style={styles.switcher}>
          {this.state.apps.map((app, index) =>
            <SwitcherListItem
              key={app.url}
              icon={app.icon}
              isActive={index === this.state.active}
              onClick={() => this.setState({active: index})}
              shortcutNumber={index + 1}
              unreadCount={this.state.unreads[index]}
            />
          )}
          <SwitcherListItem
            icon='./icons/gear.png'
            isActive={this.state.active === -1}
            onClick={() => this.setState({active: -1})}
            style={{marginTop: 'auto'}}
          />
        </ul>
        <div style={styles.webviewContainer}>
          {this.state.apps.map(({url}, index) =>
            <WebAppView
              key={url}
              src={url}
              index={index}
              isActive={index === this.state.active}
              onUnreadChange={this.handleUnreadChange}
              onFocusChange={this.handleFocusChange}
            />
          )}
          <SettingsView
            apps={this.state.apps}
            onChange={this.handleSettingsChange}
            isActive={this.state.active === -1}
            onClose={() => this.setState({isSettingsOpen: false})}
          />
        </div>
      </div>
    )
  }
}
