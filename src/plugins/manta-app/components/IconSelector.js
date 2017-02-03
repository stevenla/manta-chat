import React, {Component} from 'react';
import styled from 'styled-components';
import {base64Sync} from 'base64-img';

const {dialog} = require('electron').remote;

const UPLOAD_ICON = 'UPLOAD_ICON';
const TEXT_COLOR = '#DBE0E9';
const TEXT_COLOR_FADED = '#9BA3B6';
const BACKGROUND_COLOR = '#2B303B';
const BORDER_COLOR = 'rgba(255, 255, 255, 0.2)';

const Select = styled.select`
  appearance: none;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid ${BORDER_COLOR};
  box-sizing: border-box;
  color: ${TEXT_COLOR};
  cursor: pointer;
  height: 30px;
  line-height: 28px;
  padding: 0 12px;
  width: 100%;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &:focus {
    outline: 0;
    border-color: #fff;
  }
`;


export default class IconSelector extends Component {
  handleSelectChange = (event) => {
    const value = event.target.value;
    if (value === UPLOAD_ICON) {
      dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
          {name: 'Images', extensions: ['jpg', 'png', 'gif', 'svg', 'webp']},
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
      <Select onChange={this.handleSelectChange} value=''>
        <option disabled hidden value=''>Change icon</option>
        <option value={UPLOAD_ICON}>Upload an image</option>
        <hr />
        <option value='./icons/discord.png'>Discord</option>
        <option value='./icons/irc.png'>IRC</option>
        <option value='./icons/line.png'>Line</option>
        <option value='./icons/messenger-work.png'>Messenger for Work</option>
        <option value='./icons/messenger.png'>Messenger</option>
        <option value='./icons/pushbullet.png'>Pushbullet</option>
        <option value='./icons/pusheen.png'>Pusheen</option>
        <option value='./icons/slack.png'>Slack</option>
        <option value='./icons/wechat.png'>Wechat</option>
        <option value='./icons/whatsapp.png'>Whatsapp</option>
      </Select>
    )
  }
}
