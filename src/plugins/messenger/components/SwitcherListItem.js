import React from 'react';

const styles = {
  switcherLi: (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    ...(isActive
      ? {}
      : {opacity: .5}
    ),
  }),
  switcherButton: {
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
  },
  switcherIcon: {
    width: 32,
    height: 32,
    padding: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
  },
  switcherShortcut: {
    marginTop: 4,
    padding: '1px 4px',
    color: '#9BA3B5',
    display: 'inline',
    borderRadius: 4,
  },
};

const SwitcherListItem = ({
  icon,
  isActive,
  onClick,
  shortcutNumber,
  style = {},
}) => (
  <li style={{...styles.switcherLi(isActive), ...style}}>
    <button
      onClick={onClick}
      style={styles.switcherButton}
    >
      <img
        src={icon}
        style={styles.switcherIcon}
      />
      {shortcutNumber > 0 &&
        <div style={styles.switcherShortcut}>
          ⌘{shortcutNumber}
        </div>
      }
    </button>
  </li>
);

export default SwitcherListItem;
