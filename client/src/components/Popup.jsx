import React, { useEffect, useState } from 'react';

const Popup = ({ content, color, visible, duration = 2000, onClose }) => {
  const [internalVisible, setInternalVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      setInternalVisible(true);
      const timer = setTimeout(() => {
        setInternalVisible(false);
        if (onClose) {
          onClose();
        }
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  if (!internalVisible) {
    return null;
  }

  return (
    <div
      className='pop-up-temp'
      style={{
        backgroundColor: color,
        '--duration': `${duration / 1000}s`,
      }}
    >
      <p>{content}</p>
      <div className="timer-bar"></div>
    </div>
  );
};

export default Popup;
