import React, { Component } from 'react';
import { shell, remote } from 'electron';
import defaultMenu from 'electron-default-menu';
const { app, Menu, MenuItem } = remote;

export default class MenuBuilder extends Component {
  componentDidUpdate(nextProps, nextState) {
    setImmediate(() => this.buildMenus(nextProps.apps));
  }

  buildMenus(apps) {
    const menu = defaultMenu(app, shell);
    menu[0].submenu.splice(2, 0, {
      accelerator: 'Cmd+,',
      label: 'Preferences...',
      click: () => this.props.onSettingsOpen(),
    });
    menu[2].submenu.splice(1, 0, {
      accelerator: 'CmdOrCtrl+Alt+R',
      label: 'Reload Current Screen',
      click: () => this.props.onActiveReload(),
    });
    menu[3].submenu.splice(
      3,
      1,
      ...apps.map(({ name }, index) => ({
        accelerator: `CmdOrCtrl+${index + 1}`,
        label: name,
        click: () => this.props.onActiveChange(index),
      })),
    );
    Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
  }

  render() {
    return null;
  }
}
