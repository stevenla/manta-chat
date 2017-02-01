import React from 'react';

const styles = {
  draggable: {
    height: 50,
    width: '100%',
    position: 'absolute',
    zIndex: 999,
    userSelect: 'none',
    WebkitAppRegion: 'drag',
    pointerEvents: 'none',
  },
};

const DraggableArea = () => <div style={styles.draggable} />;
export default DraggableArea;
