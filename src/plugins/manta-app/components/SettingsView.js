import React, {Component} from 'react';

const styles = {
  wrapper: (isActive) => ({
    width: '100%',
    height: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    display: 'flex',
    ...(isActive
      ? {zIndex: 10}
      : {visibility: 'hidden'}
    ),
  }),
  body: {
    padding: 10,
  },
};

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

  handleDelete = (index, event) => {
    const apps = [...this.state.apps];
    apps.splice(index, 1);
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
    return (
      <div style={styles.wrapper(this.props.isActive)}>
        <div style={styles.body}>
          <table>
            <thead>
              <tr>
                <td>Name</td>
                <td>Icon</td>
                <td>URL</td>
                <td></td>
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
                  <td>
                    <button onClick={(event) => this.handleDelete(index, event)}>
                      x
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
