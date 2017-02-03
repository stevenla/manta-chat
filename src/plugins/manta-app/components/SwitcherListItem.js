import React from 'react';

const styles = {
  switcherLi: (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    position: 'relative',
  }),
  switcherButton: (isActive) => ({
    width: 68,
    height: 68,
    border: 0,
    backgroundColor: 'transparent',
    padding: 0,
    outline: 'none',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'opacity .1s ease-out',
    ...(isActive
      ? {}
      : {opacity: .3}
    ),
  }),
  switcherIcon: {
    width: 32,
    height: 32,
    padding: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    pointerEvents: 'none',
  },
  switcherShortcut: {
    marginTop: 4,
    padding: '1px 4px',
    color: '#9BA3B5',
    display: 'inline',
    borderRadius: 4,
  },
  unread: {
    position: 'absolute',
    right: 6,
    top: 0,
    padding: '0 5px',
    backgroundColor: 'red',
    color: 'white',
    fontSize: 10,
    borderRadius: 8,
    minWidth: 16,
    minHeight: 16,
    textAlign: 'center',
    lineHeight: '16px',
    zIndex: 10,
    fontWeight: 'bold',
    boxSizing: 'border-box',
  },
};

const SwitcherListItem = ({
  icon,
  isActive,
  onClick,
  shortcutNumber,
  style = {},
  unreadCount,
}) => (
  <li style={{...styles.switcherLi(isActive), ...style}}>
    {unreadCount > 0 && <div style={styles.unread}>{unreadCount}</div>}
    <button
      onClick={onClick}
      style={styles.switcherButton(isActive)}
    >
      <img
        src={icon}
        style={styles.switcherIcon}
      />
      {shortcutNumber !== undefined &&
        <div style={styles.switcherShortcut}>
          ⌘{shortcutNumber}
        </div>
      }
    </button>
  </li>
);

export default SwitcherListItem;
