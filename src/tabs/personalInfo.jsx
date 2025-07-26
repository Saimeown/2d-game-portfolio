import React from 'react';
import { Header } from '../components/Header.jsx';
import { PlayerController } from '../components/PlayerController.jsx';

export default function PersonalInfo() {
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
      <PlayerController
        leftRoute="/"
        rightRoute={null}
        showText={false}
        fallOnLoad={false}
        startAtLeft={true}
      />
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
        <p>Hello! This is the next page.</p>
        <p>Put your personal information or portfolio details here.</p>
      </div>
    </div>
  );
}
