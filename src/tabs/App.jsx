import { useState, useRef, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import { Header } from '../components/Header.jsx';
import { PlayerController } from '../components/PlayerController.jsx';
import PersonalInfo from './personalInfo.jsx';
import '../index.css';

export default function App() {
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
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
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
      <Routes>
        <Route
          path="/"
          element={<PlayerController leftRoute={null} rightRoute="/next" showText={true} />}
        />
        <Route
          path="/next"
          element={<PersonalInfo />}
        />
      </Routes>
    </div>
  );
}
