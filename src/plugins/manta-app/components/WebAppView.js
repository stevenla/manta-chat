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
  componentDidMount() {
    this.attachHandlers();
  }

  componentWillUnmount() {
    this.detachHandlers();
  }

  attachHandlers = () => {
    this.refs.view.addEventListener('new-window', this.handleLinkClick);
    this.refs.view.addEventListener('ipc-message', this.handleIpcMessage);
  }

  detachHandlers = () => {
    this.refs.view.removeEventListener('new-window', this.handleLinkClick);
    this.refs.view.removeEventListener('ipc-message', this.handleIpcMessage);
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

  render() {
    return (
      <webview
        ref='view'
        src={this.props.src}
        style={styles.webview(this.props.isActive)}
        preload={`file://${path.resolve(__dirname, '..', 'preload.js')}`}
      />
    )
  }
}
