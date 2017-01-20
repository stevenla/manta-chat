import React, {Component} from 'react';
import url from 'url';
import {shell} from 'electron';

const styles = {
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
}

export default class WebAppView extends Component {
  componentDidMount() {
    this.attachClickHandlers();
  }

  componentWillUnmount() {
    this.detachClickHandlers();
  }

  attachClickHandlers = () => {
    this.refs.view.addEventListener('new-window', this.handleLinkClick);
  }

  detachClickHandlers = () => {
    this.refs.view.removeEventListener('new-window', this.handleLinkClick);
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
      />
    )
  }
}
