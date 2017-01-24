import React, {Component} from 'react';
import storage from 'electron-json-storage';
import {render} from 'react-dom';
import {remote} from 'electron';

import SettingsPanel from './components/SettingsPanel';
import WebAppView from './components/WebAppView';
import SwitcherListItem from './components/SwitcherListItem';
import MenuBuilder from './components/MenuBuilder';
import DraggableArea from './components/DraggableArea';

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

class MantaChat extends Component {
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
      console.log(unreads);
      const totalUnread = Object.keys(unreads)
        .reduce((acc, i) => acc + unreads[i], 0);
      remote.app.setBadgeCount(totalUnread);
    }
  }

  handleFocusChange = (index) => {
    this.setState({active: index});
  }

  render() {
    return (
      <div style={styles.main}>
        <DraggableArea />
        <MenuBuilder
          apps={this.state.apps}
          onActiveChange={(index) => this.setState({active: index})}
        />
        <SettingsPanel
          apps={this.state.apps}
          onChange={this.handleSettingsChange}
          isOpen={this.state.isSettingsOpen}
          onClose={() => this.setState({isSettingsOpen: false})}
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
            isActive
            onClick={() => this.setState({isSettingsOpen: true})}
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
        </div>
      </div>
    )
  }
}

render(<MantaChat />, document.querySelector('.main'));
