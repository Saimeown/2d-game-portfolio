import React from 'react';

const PLATFORMS = [
  { x: 20, y: 220, width: 80, height: 15 },
  { x: -30, y: 160, width: 90, height: 15 },
  { x: 100, y: 180, width: 60, height: 15 },
];
const GAME_WIDTH = 740;
const GAME_HEIGHT = 367;

export function Platforms({ scale = 1 }) {
  return (
    <>
      {PLATFORMS.map((plat, idx) => (
        <img
          key={idx}
          src="/assets/platform.png"
          alt="platform"
          style={{
            position: 'absolute',
            left: plat.x * scale,
            top: plat.y * scale,
            width: plat.width * scale,
            height: plat.height * scale,
            zIndex: 0,
            pointerEvents: 'none',
            userSelect: 'none',
            display: 'block',
          }}
          draggable={false}
          onError={e => {
            e.target.style.display = 'none';
            const fallback = document.createElement('div');
            fallback.style.position = 'absolute';
            fallback.style.left = `${plat.x * scale}px`;
            fallback.style.top = `${plat.y * scale}px`;
            fallback.style.width = `${plat.width * scale}px`;
            fallback.style.height = `${plat.height * scale}px`;
            fallback.style.background = 'rgba(0,200,255,0.7)';
            fallback.style.border = '2px solid #fff';
            fallback.style.zIndex = 0;
            fallback.style.pointerEvents = 'none';
            fallback.style.userSelect = 'none';
            e.target.parentNode.appendChild(fallback);
          }}
        />
      ))}
    </>
  );
}
