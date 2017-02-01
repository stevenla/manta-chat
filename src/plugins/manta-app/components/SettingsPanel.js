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
  }
}

export default class Settings extends Component {
  state = {
    apps: []
  }

  componentWillReceiveProps(nextProps) {
    this.setState({apps: nextProps.apps});
  }

  copyUrlsAt = (index) => {
    const apps = [...this.state.apps];
    apps[index] = {...apps[index]};
    return apps;
  }

  handleChange = (index, field, event) => {
    const apps = this.copyUrlsAt(index);
    apps[index][field] = event.target.value;
    this.setState({apps});
  }

  handleMoveUp = (index, event) => {
    const apps = [...this.state.apps];
    const [current] = apps.splice(index, 1);
    apps.splice(index - 1, 0, current);
    this.setState({apps});
  }

  handleSave = () => {
    this.props.onChange(this.state.apps);
  }

  handleNew = (options = {}) => {
    const apps = [...this.state.apps, options];
    this.setState({apps});
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
                <td></td>
              </tr>
            </thead>
            <tbody>
              {this.state.apps.map((app, index) =>
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
                  <td>
                    <button onClick={(event) => this.handleMoveUp(index, event)}>
                      ^
                    </button>
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
