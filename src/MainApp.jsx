import React, { useRef, useEffect, useState } from 'react';
import App from './tabs/App.jsx';
import MusicContext, { SoundEffectsContext } from './MusicContext.js';
import PlayerPositionContext from './PlayerPositionContext.js';
import { PlayerMovementProvider } from './PlayerMovementContext.jsx';

export default function MainApp() {
  const [muted, setMuted] = useState(false);
  const [sfxMuted, setSfxMuted] = useState(false);
  const musicRef = useRef(null);
  const [playerY, setPlayerY] = useState(null);
  const wasSfxMuted = useRef(sfxMuted);

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

  useEffect(() => {
    wasSfxMuted.current = sfxMuted;
  }, [sfxMuted]);

  const toggleMute = () => {
    setMuted(m => {
      if (musicRef.current) musicRef.current.muted = !m;
      return !m;
    });
  };

  const toggleSfxMute = () => {
    setSfxMuted(m => !m);
  };

  return (
    <MusicContext.Provider value={{ muted, toggleMute }}>
      <SoundEffectsContext.Provider value={{ muted: sfxMuted, toggleMute: toggleSfxMute }}>
        <PlayerPositionContext.Provider value={{ y: playerY, setY: setPlayerY }}>
          <PlayerMovementProvider>
            <audio
              ref={musicRef}
              src="/assets/background-music.mp3"
              loop
              preload="auto"
              style={{ display: 'none' }}
            />
            <App />
          </PlayerMovementProvider>
        </PlayerPositionContext.Provider>
      </SoundEffectsContext.Provider>
    </MusicContext.Provider>
  );
}
