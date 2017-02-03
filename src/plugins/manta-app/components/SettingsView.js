import React, {Component} from 'react';
import {static as Immutable} from 'seamless-immutable';
import styled from 'styled-components';
import {base64Sync} from 'base64-img';

const {dialog} = require('electron').remote;

import SwitcherList from './SwitcherList';
import SwitcherListItem from './SwitcherListItem';

const AppTable = styled.table`
  border-spacing: 0;
  width: 100%;
  thead tr {
    height: 30px;
  }
  td {
    padding: 0;
    padding-right: 10px;
    margin: 0;
  }
  tbody tr {
    height: 73px;
    td {
      padding-bottom: 30px;
    }
  }
  input[type='text'] {
    box-sizing: border-box;
    background: transparent;
    border: 0;
    color: #eee;
    padding: 5px 0 6px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    width: 100%;

    &:focus {
      outline: 0;
      padding: 5px 0 5px;
      border-bottom: 2px solid #fff;
    }
  }

  input[type='file'] {
    position: fixed;
    top: -1000px;
  }

  select {
    width: 100%;
    height: 30px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #eee;;
    background: transparent;
  }
`;

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
    backgroundColor: '#5B5F67',
    color: '#eee',
    zIndex: 20,
  },
  body: {
    padding: 10,
  },
  image: {
    width: 32,
    height: 32,
  },
  switcherList: {
    backgroundColor: '#5B5F67',
    borderRightColor: '#5B5F67',
  },
  settingsPanel: {
    paddingTop: 30,
  },
};

const UPLOAD_ICON = 'UPLOAD_ICON';
class IconSelector extends Component {
  handleSelectChange = (event) => {
    const value = event.target.value;
    if (value === UPLOAD_ICON) {
      dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
          {name: 'Images', extensions: ['jpg', 'png', 'gif']},
        ],
      },
      (filePaths) => {
        const filePath = filePaths[0];
        const encoded = base64Sync(filePath);
        this.props.onSetIcon(encoded);
      });
    } else {
      this.props.onSetIcon(event.target.value);
    }
  }

  render() {
    return (
      <select onChange={this.handleSelectChange} value=''>
        <option disabled value=''>Change Icon</option>
        <hr />
        <option value={UPLOAD_ICON}>Upload an icon</option>
        <hr />
        <option value='./icons/messenger.png'>Messenger</option>
        <option value='./icons/slack.png'>Slack</option>
        <option value='./icons/irc.png'>IRC</option>
        <option value='./icons/workplace.png'>Messenger for Work</option>
        <option value='./icons/pushbullet.png'>Pushbullet</option>
      </select>
    )
  }
}

export default class SettingsView extends Component {
  state = {
    apps: []
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.apps !== this.props.apps) {
      this.setState({apps: nextProps.apps});
    }
  }

  handleChange = (index, field, event) => {
    const apps = Immutable.setIn(this.state.apps, [index, field], event.target.value);
    this.setState({apps});
  }

  handleSetIcon = (index, src) => {
    const apps = Immutable.setIn(this.state.apps, [index, 'icon'], src);
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

  handleCancel = () => {
    this.setState({apps: this.props.apps});
    this.props.onClose();
  }

  render() {
    if (!this.props.isActive) {
      return null;
    }

    return (
      <div style={styles.wrapper}>
        <SwitcherList style={styles.switcherList}>
          {this.state.apps.map((app, index) =>
            <SwitcherListItem
              key={app.url}
              icon={app.icon}
              isActive
              shortcutNumber={index + 1}
            />
          )}
        </SwitcherList>
        <div style={{flexGrow: 1}}>
          <AppTable>
            <thead>
              <tr style={styles.tableHeader}>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {this.state.apps.map((app, index) =>
                <tr key={index}>
                  <td>
                    <input
                      type='text'
                      placeholder='Name'
                      onChange={(event) => this.handleChange(index, 'name', event)}
                      value={app.name}
                    />
                  </td>
                  <td>
                    <input
                      type='text'
                      placeholder='URL'
                      onChange={(event) => this.handleChange(index, 'url', event)}
                      value={app.url}
                    />
                  </td>
                  <td>
                    <IconSelector
                      onSetIcon={(src) => this.handleSetIcon(index, src)}
                      value={app.icon}
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
          </AppTable>

          <button onClick={this.handleNew}>new</button>
          <button onClick={this.handleCancel}>cancel</button>
          <button onClick={this.handleSave}>save</button>
        </div>
      </div>
    )
  }
}
