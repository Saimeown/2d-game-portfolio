import React, { useState, useRef, useEffect } from 'react';
import { Header } from '../components/Header.jsx';
import { PlayerController } from '../components/PlayerController.jsx';

export default function PersonalInfo() {
  const [muted, setMuted] = useState(false);
  const musicRef = useRef(null);
  useEffect(() => {
    const startMusic = () => {
      if (musicRef.current) {
        musicRef.current.volume = 0.5;
        musicRef.current.muted = muted;
        musicRef.current.play().catch(() => {});
      }
    };
    window.addEventListener('pointerdown', startMusic, { once: true });
    window.addEventListener('keydown', startMusic, { once: true });
    return () => {
      window.removeEventListener('pointerdown', startMusic);
      window.removeEventListener('keydown', startMusic);
    };
  }, [muted]);
  const toggleMute = () => {
    setMuted(m => {
      if (musicRef.current) musicRef.current.muted = !m;
      return !m;
    });
  };

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
      <Header muted={muted} toggleMute={toggleMute} />
      <audio
        ref={musicRef}
        src="/assets/background-music.mp3"
        loop
        preload="auto"
        style={{ display: 'none' }}
      />
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
      <PlayerController leftRoute="/" rightRoute={null} showText={false} />
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
