import React from 'react';

const styles = {
  switcher: {
    flex: '0 0 68px',
    borderRight: '1px solid #1A1D23',
    margin: 0,
    padding: 0,
    paddingTop: 30,
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#2B303B',
    WebkitAppRegion: 'drag',
    userSelect: 'none',
    overflow: 'scroll',
  },
};

const SwitcherList = ({style, ...props}) => (
  <ul style={{...styles.switcher, ...style}} {...props} />
);

export default SwitcherList;
