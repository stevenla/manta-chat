import React, {Component} from 'react';

import {readJSON, writeJSON} from '../../../config';

/**
 * Higher order component to link config with ~/.config/manta
 */
export default function withDotfiles(MyComponent) {
  class DotfilesConfig extends Component {
    state = {
      config: {
        apps: [],
        plugins: [],
      },
    };

    componentDidMount() {
      readJSON((err, json) => {
        this.setState({config: json});
      })
    }

    handleConfigChange = (config) => {
      // TODO: this seriously needs error handling
      this.setState({config});
      writeJSONSync(config);
    }

    render() {
      return (
        <MyComponent
          config={this.state.config}
          onConfigChange={this.handleConfigChange}
          {...this.props}
        />
      );
    }
  }

  DotfilesConfig.displayName = `withDotfiles(${MyComponent.displayName})`;
  return DotfilesConfig;
}
