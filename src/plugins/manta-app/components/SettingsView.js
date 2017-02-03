import React, {Component} from 'react';
import {static as Immutable} from 'seamless-immutable';
import styled from 'styled-components';

import SwitcherList from './SwitcherList';
import SwitcherListItem from './SwitcherListItem';
import IconSelector from './IconSelector';

const TEXT_COLOR = '#DBE0E9';
const TEXT_COLOR_FADED = '#9BA3B6';
const BACKGROUND_COLOR = '#2B303B';
const BORDER_COLOR = 'rgba(255, 255, 255, 0.2)';

const AddNewEntryButton = styled.button`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  border: 1px solid ${BORDER_COLOR};
  color: ${TEXT_COLOR};
  cursor: pointer;
  display: block;
  font-size: 1.25em;
  font-weight: lighter;
  line-height: 56px;
  padding: 0;
  width: 100%;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const Button = styled.button`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 5px;
  border: 1px solid ${BORDER_COLOR};
  box-sizing: border-box;
  color: ${TEXT_COLOR};
  cursor: pointer;
  font-weight: lighter;
  line-height: 28px;
  padding: 0 12px;
  white-space: nowrap;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const SettingsTitle = styled.div`
  color: ${TEXT_COLOR_FADED};
  font-size: 13px;
  height: 30px;
  left: 0;
  line-height: 22px;
  pointer-events: none;
  position: fixed;
  right: 0;
  text-align: center;
  top: 0;
`;

const TextInput = styled.input`
  box-sizing: border-box;
  background: transparent;
  border: 0;
  color: ${TEXT_COLOR};
  padding: 8px;
  line-height: 12px;
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 100%;

  &:focus {
    outline: 0;
    border-color: #fff;
  }
`;

const AppTable = styled.table`
  border-spacing: 0;
  width: 100%;
  margin-top: 30px;

  td {
    padding: 0 10px 20px 0;
    margin: 0;

    button {
      width: 100%;
    }
  }

  tr {
    height: 73px;
  }
`;

const Wrapper = styled.div`
  box-sizing: border-box;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  padding-right: 20;
  display: flex;
  background-color: ${BACKGROUND_COLOR};
  color: ${TEXT_COLOR};
  z-index: 20;
  overflow: scroll;
`;

const styles = {
  switcherList: {
    backgroundColor: BACKGROUND_COLOR,
    borderRightColor: BACKGROUND_COLOR,
  },
};

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
      <Wrapper>
        <SettingsTitle>Manta - Preferences</SettingsTitle>
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
            <tbody>
              {this.state.apps.map((app, index) =>
                <tr key={index}>
                  <td>
                    <TextInput
                      type='text'
                      placeholder='Name'
                      onChange={(event) => this.handleChange(index, 'name', event)}
                      value={app.name}
                    />
                  </td>
                  <td>
                    <TextInput
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
                    <Button onClick={(event) => this.handleMoveUp(index, event)}>
                      Move up
                    </Button>
                  </td>
                  <td>
                    <Button onClick={(event) => this.handleDelete(index, event)}>
                      Remove
                    </Button>
                  </td>
                </tr>
              )}
            </tbody>
          </AppTable>

          <AddNewEntryButton onClick={this.handleNew}>Add new...</AddNewEntryButton>
          <Button onClick={this.handleCancel}>cancel</Button>
          <Button onClick={this.handleSave}>save</Button>
        </div>
      </Wrapper>
    )
  }
}
