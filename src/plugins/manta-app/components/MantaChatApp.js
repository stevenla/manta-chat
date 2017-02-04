import React, {Component} from 'react';
import storage from 'electron-json-storage';
import {remote} from 'electron';

import SettingsView from './SettingsView';
import WebAppView from './WebAppView';
import SwitcherList from './SwitcherList';
import SwitcherListItem from './SwitcherListItem';
import MenuBuilder from './MenuBuilder';
import DraggableArea from './DraggableArea';
import withDotfiles from './withDotfiles';

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
  webviewContainer: {
    flex: 1,
    position: 'relative',
  },
};

class MantaChatApp extends Component {
  state = {
    active: 0,
    unreads: {},
    isSettingsOpen: false,
  };

  /**
   * Close the settings view, and save settings in the config
   */
  handleSettingsChange = (config) => {
    this.setState({ isSettingsOpen: false });
    this.props.onConfigChange(config);
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
      // TODO: maybe replce this with refs
      const webview = document.querySelector(
        `webview:nth-child(${this.state.active + 1})`
      );
      webview.reload();
    }
  }

  render() {
    return (
      <div style={styles.main}>
        <DraggableArea />
        <MenuBuilder
          apps={this.props.config.apps}
          onActiveChange={(index) => this.setState({active: index})}
          onSettingsOpen={() => this.setState({isSettingsOpen: true})}
          onActiveReload={this.handleActiveReload}
        />
        <SettingsView
          config={this.props.config}
          onChange={this.handleSettingsChange}
          isActive={this.state.isSettingsOpen}
          onClose={() => this.setState({isSettingsOpen: false})}
        />
        <SwitcherList>
          {this.props.config.apps.map((app, index) =>
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
            isActive={this.state.isSettingsOpen}
            onClick={() => this.setState({isSettingsOpen: true})}
            style={{marginTop: 'auto'}}
          />
        </SwitcherList>
        <div style={styles.webviewContainer}>
          {this.props.config.apps.map(({url}, index) =>
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

export default withDotfiles(MantaChatApp);
