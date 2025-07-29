import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header.jsx';
import { PlayerController } from '../components/PlayerController.jsx';

export default function PersonalInfo() {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setScale(Math.min(width / 740, height / 367));
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Standee position: x = 600 (right side), y = ground level
  const STANDEE_X = 600;
  const STANDEE_Y = 300 - 60; // 60 is standee height, adjust if needed

  // Center vertically using same offset as PlayerController
  const offsetY = (window.innerHeight - 367 * scale) / 2;

  // Example: One grass platform in the middle
  const grassPlatforms = [
    {
      x: 140, // horizontal position (adjust as needed)
      y: 247, // vertical position (adjust as needed)
      width: 120, // width of the platform
      height: 3, // height of the platform
    },
  ];

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        minWidth: 0,
        minHeight: 0,
      }}
    >
      <Header />
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: 0,
          pointerEvents: 'none',
        }}
        src="src/assets/background-image.mp4"
      />
      {/* Store image */}
      <img
        src="public/assets/STORE.png"
        alt="Store"
        style={{
          position: 'absolute',
          left: -1680 + STANDEE_X * scale,
          top: -60 + offsetY + STANDEE_Y * scale,
          width: 80 * scale,
          height: 80 * scale,
          zIndex: 2,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        draggable={false}
      />
      {/* Standee image at same y as sprite, right side */}
      <img
        src="/assets/standee-rightArrow.png"
        alt="Standee"
        style={{
          position: 'absolute',
          left: -1460 + STANDEE_X * scale,
          top: 70 + offsetY + STANDEE_Y * scale,
          width: 30 * scale,
          height: 30 * scale,
          zIndex: 2,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        draggable={false}
      />
      {/* Billboard image at same y as sprite, right side */}
      <img
        src="/assets/BILLBOARD.png"
        alt="Billboard"
        style={{
          position: 'absolute',
          left: -1230 + STANDEE_X * scale,
          top: -240 + offsetY + STANDEE_Y * scale,
          width: 150 * scale,
          height: 150 * scale,
          zIndex: 2,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        draggable={false}
      />
      <PlayerController
        leftRoute="/"
        rightRoute={null}
        showText={false}
        fallOnLoad={false}
        startAtLeft={true}
        platforms={grassPlatforms}
      />

      {/*
      {grassPlatforms.map((platform, idx) => (
        <div
          key={idx}
          style={{
            position: 'absolute',
            left: platform.x * scale,
            top: platform.y * scale + offsetY,
            width: platform.width * scale,
            height: platform.height * scale,
            background: 'rgba(0,255,0,0.3)',
            border: '2px solid green',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        />
      ))}
      */}

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'PixelGameFont, monospace',
          fontSize: 32,
          letterSpacing: 1,
          color: '#fff',
          textShadow: `
            -2px -2px 0 #000,  
            2px -2px 0 #000,   
            -2px 2px 0 #000,   
            2px 2px 0 #000,    
            0px 2px 0 #000,    
            2px 0px 0 #000,    
            0px -2px 0 #000,   
            -2px 0px 0 #000
          `,
        }}
      >
        <h1 style={{ marginBottom: 24 }}>Personal Info</h1>
      </div>
    </div>
  );
}