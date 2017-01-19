import React, {Component} from 'react';

const styles = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 20,
  },
  wrapper: {
    position: 'absolute',
    top: 40,
    left: 40,
    bottom: 40,
    right: 40,
    backgroundColor: 'white',
    zIndex: 30,
    padding: 20,
    borderRadius: 5,
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  }
}

export default class Settings extends Component {
  state = {
    urls: []
  }

  componentWillReceiveProps(nextProps) {
    this.setState({urls: nextProps.urls});
  }

  copyUrlsAt = (index) => {
    const urls = [...this.state.urls];
    urls[index] = {...urls[index]};
    return urls;
  }

  handleChange = (index, field, event) => {
    const urls = this.copyUrlsAt(index);
    urls[index][field] = event.target.value;
    this.setState({urls});
  }

  handleSave = () => {
    this.props.onChange(this.state.urls);
  }

  handleNew = () => {
    const urls = [...this.state.urls, {}];
    this.setState({urls});
  }

  render() {
    if (!this.props.isOpen) {
      return null;
    }
    return (
      <div>
        <div style={styles.backdrop} onClick={this.props.onClose} />
        <div style={styles.wrapper}>
          <table>
            <thead>
              <tr>
                <td>Name</td>
                <td>Icon</td>
                <td>URL</td>
              </tr>
            </thead>
            <tbody>
              {this.state.urls.map((app, index) =>
                <tr key={index}>
                  <td>
                    <input
                      onChange={(event) => this.handleChange(index, 'name', event)}
                      value={app.name}
                    />
                  </td>
                  <td>
                    <input
                      onChange={(event) => this.handleChange(index, 'icon', event)}
                      value={app.icon}
                    />
                  </td>
                  <td>
                    <input
                      onChange={(event) => this.handleChange(index, 'url', event)}
                      value={app.url}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <button onClick={this.handleNew}>new</button>
          <button onClick={this.props.onClose}>cancel</button>
          <button onClick={this.handleSave}>save</button>
        </div>
      </div>
    )
  }
}
