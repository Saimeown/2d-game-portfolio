import React, { useRef, useEffect, useState } from 'react';
import App from './tabs/App.jsx';
import MusicContext from './MusicContext.js';
import PlayerPositionContext from './PlayerPositionContext.js';

export default function MainApp() {
  const [muted, setMuted] = useState(false);
  const musicRef = useRef(null);
  const [playerY, setPlayerY] = useState(null);

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
    <MusicContext.Provider value={{ muted, toggleMute }}>
      <PlayerPositionContext.Provider value={{ y: playerY, setY: setPlayerY }}>
        <audio
          ref={musicRef}
          src="/assets/background-music.mp3"
          loop
          preload="auto"
          style={{ display: 'none' }}
        />
        <App />
      </PlayerPositionContext.Provider>
    </MusicContext.Provider>
  );
}
