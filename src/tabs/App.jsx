import React, { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import { Header } from '../components/Header.jsx';
import { PlayerController } from '../components/PlayerController.jsx';
import { Platforms } from '../components/Platforms.jsx';
import PersonalInfo from './personalInfo.jsx';
import '../index.css';

function MainWithPlatforms() {
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
  // Store position: x = 40 (left side), y = ground level
  const STORE_X = 40;
  const STORE_Y = 300 - 60; // 60 is store height, adjust if needed

  // Center vertically using same offset as PlayerController
  const offsetY = (window.innerHeight - 367 * scale) / 2;

  return (
    <>
      <Platforms scale={scale} />
      {/* Store image at same y as sprite, left side */}
      <img
        src="public/assets/STORE.png"
        alt="Store"
        style={{
          position: 'absolute',
          left: 1270 + STORE_X * scale,
          top:  -60 + offsetY + STORE_Y * scale,
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
          left: 40 + STANDEE_X * scale,
          top: 70 + offsetY + STANDEE_Y * scale,
          width: 30 * scale,
          height: 30 * scale,
          zIndex: 2,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        draggable={false}
      />
      <PlayerController leftRoute={null} rightRoute="/next" showText={true} fallOnLoad={true} />
    </>
  );
}

export default function App() {
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
      <Routes>
        <Route
          path="/"
          element={<MainWithPlatforms />}
        />
        <Route
          path="/next"
          element={<PersonalInfo />}
        />
      </Routes>
    </div>
  );
}
