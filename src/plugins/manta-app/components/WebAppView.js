import React, {Component} from 'react';
import url from 'url';
import {shell} from 'electron';
import path from 'path';

const styles = {
  webview: (isActive) => ({
    width: '100%',
    height: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    ...(isActive
      ? {zIndex: 10}
      : {opacity: 0}
    ),
  }),
}

export default class WebAppView extends Component {
  _webview = React.createRef();

  componentDidMount() {
    this.attachHandlers();
  }

  componentWillUnmount() {
    this.detachHandlers();
  }

  attachHandlers = () => {
    this._webview.current.addEventListener('new-window', this.handleLinkClick);
    this._webview.current.addEventListener('ipc-message', this.handleIpcMessage);
    this._webview.current.addEventListener('did-navigate', this.handleNavigate);
  }

  detachHandlers = () => {
    this._webview.current.removeEventListener('new-window', this.handleLinkClick);
    this._webview.current.removeEventListener('ipc-message', this.handleIpcMessage);
    this._webview.current.removeEventListener('did-navigate', this.handleNavigate);
  }

  handleIpcMessage = ({channel, args}) => {
    switch (channel) {
      case 'unread':
        this.props.onUnreadChange(this.props.index, args[0]);
        break;

      case 'focus':
        this.props.onFocusChange(this.props.index);
        break;
    }
  }

  handleLinkClick(event) {
    const protocol = url.parse(event.url).protocol;
    if (protocol === 'http:' || protocol === 'https:') {
      shell.openExternal(event.url);
    }
  }

  handleNavigate = (event) => {
    // HACK: fix slack signin. this should be in its own plugin
    if (event.url.includes('.slack.com') && (event.url.includes('/signin') || event.url.includes('/signout/done'))) {
      this._webview.current.loadURL(this.props.src);
    }
  }

  render() {
    return (
      <webview
        partition="persist:manta"
        preload={`file://${path.resolve(__dirname, '..', 'preload.js')}`}
        ref={this._webview}
        src={this.props.src}
        style={styles.webview(this.props.isActive)}
      />
    )
  }
}
