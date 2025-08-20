import React, { useState, useEffect } from 'react';
import { VIRTUAL_WIDTH, VIRTUAL_HEIGHT } from '../constants/gameConstants.js';

export function GameContainer({ children }) {
  const [viewport, setViewport] = useState({
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    width: VIRTUAL_WIDTH,
    height: VIRTUAL_HEIGHT
  });

  useEffect(() => {
    function updateViewport() {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      const scaleX = windowWidth / VIRTUAL_WIDTH;
      const scaleY = windowHeight / VIRTUAL_HEIGHT;
      const scale = Math.min(scaleX, scaleY);
      
      const scaledWidth = VIRTUAL_WIDTH * scale;
      const scaledHeight = VIRTUAL_HEIGHT * scale;
      
      const offsetX = (windowWidth - scaledWidth) / 2;
      const offsetY = (windowHeight - scaledHeight) / 2;
      
      setViewport({
        scale,
        offsetX,
        offsetY,
        width: scaledWidth,
        height: scaledHeight
      });
    }

    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: viewport.offsetX,
          top: viewport.offsetY,
          width: viewport.width,
          height: viewport.height,
          transform: 'translateZ(0)', 
        }}
      >
        <div
          style={{
            position: 'relative',
            width: VIRTUAL_WIDTH,
            height: VIRTUAL_HEIGHT,
            transform: `scale(${viewport.scale})`,
            transformOrigin: '0 0',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
