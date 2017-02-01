import React, {Component} from 'react';
import {shell, remote} from 'electron';
import defaultMenu from 'electron-default-menu';
const {app, Menu, MenuItem} = remote;

export default class MenuBuilder extends Component {
  componentWillUpdate(nextProps, nextState) {
    this.buildMenus(nextProps.apps);
  }

  buildMenus(apps) {
    const menu = defaultMenu(app, shell);
    menu[3].submenu.splice(3, 1, ...apps.map(({name}, index) => ({
        accelerator: `CmdOrCtrl+${index + 1}`,
        label: name,
        click: () => this.props.onActiveChange(index),
      }))
    );
    Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
  }

  render () {
    return null;
  }
}
