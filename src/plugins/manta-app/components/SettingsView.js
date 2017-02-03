import React, {Component} from 'react';

const styles = {
  wrapper: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    display: 'flex',
    backgroundColor: 'white',
    zIndex: 20,
  },
  body: {
    padding: 10,
  },
  image: {
    width: 32,
    height: 32,
  },
};

const BuiltinIcons = (props) => (
  <select {...props}  >
    <option disabled>Built in icons</option>
    <option value='./icons/messenger.png'>Messenger</option>
    <option value='./icons/slack.png'>Slack</option>
    <option value='./icons/irc.png'>IRC</option>
    <option value='./icons/workplace.png'>Messenger for Work</option>
  </select>
);

class IconSelector extends Component {
  render() {
    return (
      <div />
    )
  }
}

export default class Settings extends Component {
  state = {
    apps: []
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.apps !== this.props.apps) {
      this.setState({apps: nextProps.apps});
    }
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

  handleSetIcon = (index, event) => {
    const files = event.target.files;
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const contents = reader.result;
        const apps = this.copyUrlsAt(index);
        apps[index].icon = contents;
        this.setState({apps});
      }
      reader.readAsDataURL(file);
    }
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
    if (!this.props.isActive) {
      return null;
    }

    return (
      <div style={styles.wrapper}>
        <div style={styles.body}>
          <table>
            <thead>
              <tr>
                <td></td>
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
                    <img src={app.icon} style={styles.image} />
                  </td>
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
                    <input
                      type='file'
                      onChange={(event) => this.handleSetIcon(index, event)}
                    />
                    <BuiltinIcons
                      onChange={(event) => this.handleChange(index, 'icon', event)}
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
