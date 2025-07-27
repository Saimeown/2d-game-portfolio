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
      {/* Store image at same y as sprite, left side */}
      <img
        src="public/assets/STORE.png"
        alt="Store"
        style={{
          position: 'absolute',
          left: 1270 + STORE_X * scale,
          top: -60 + offsetY + STORE_Y * scale,
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
      {/* Hotel Image at same y as sprite, right side */}
      <img
        src="/assets/HOTEL.png"
        alt="Standee"
        style={{
          position: 'absolute',
          left: -410 + STANDEE_X * scale,
          top: -86 + offsetY + STANDEE_Y * scale,
          width: 90 * scale,
          height: 90 * scale,
          zIndex: 2,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        draggable={false}
      />
      {/* Billboard image at same y as sprite, right side */}
      <img
        src="/assets/BILLBOARD.png"
        alt="Standee"
        style={{
          position: 'absolute',
          left: 270 + STANDEE_X * scale,
          top: -240 + offsetY + STANDEE_Y * scale,
          width: 150 * scale,
          height: 150 * scale,
          zIndex: 2,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        draggable={false}
      />
      {/* School image at same y as sprite, right side */}
      <img
        src="/assets/SCHOOL.png"
        alt="School"
        style={{
          position: 'absolute',
          left: -1370 + STANDEE_X * scale,
          top: -86 + offsetY + STANDEE_Y * scale,
          width: 90 * scale,
          height: 90 * scale,
          zIndex: 2,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        draggable={false}
      />
      {/* Cart image at same y as sprite, right side */}
      <img
        src="/assets/CART.png"
        alt="Cart"
        style={{
          position: 'absolute',
          left: -570 + STANDEE_X * scale,
          top: -7 + offsetY + STANDEE_Y * scale,
          width: 60 * scale,
          height: 60 * scale,
          zIndex: 2,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        draggable={false}
      />
      {/* Building image at same y as sprite, right side */}
      <img
        src="/assets/BUILDING.png"
        alt="Building"
        style={{
          position: 'absolute',
          left: -1650 + STANDEE_X * scale,
          top: -86 + offsetY + STANDEE_Y * scale,
          width: 60 * scale,
          height: 90 * scale,
          zIndex: 2,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        draggable={false}
      />
      {/* Fence image 1 at same y as sprite, right side */}
      <img
        src="/assets/FENCE.png"
        alt="Fence"
        style={{
          position: 'absolute',
          left: -1650 + STANDEE_X * scale,
          top: 75 + offsetY + STANDEE_Y * scale,
          width: 120 * scale,
          height: 28 * scale,
          zIndex: 0,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        draggable={false}
      />
      {/* Fence image 2 at same y as sprite, right side */}
      <img
        src="/assets/FENCE.png"
        alt="Fence"
        style={{
          position: 'absolute',
          left: -1250 + STANDEE_X * scale,
          top: 75 + offsetY + STANDEE_Y * scale,
          width: 120 * scale,
          height: 28 * scale,
          zIndex: 0,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        draggable={false}
      />
      {/* Fence image 3 at same y as sprite, right side */}
      <img
        src="/assets/FENCE.png"
        alt="Fence"
        style={{
          position: 'absolute',
          left: -965 + STANDEE_X * scale,
          top: 75 + offsetY + STANDEE_Y * scale,
          width: 120 * scale,
          height: 28 * scale,
          zIndex: 0,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        draggable={false}
      />

      {/* Grass 1 image at same y as sprite, right side */}
      <img
        src="/assets/grass.png"
        alt="Grass"
        style={{
          position: 'absolute',
          left: -1000 + STANDEE_X * scale,
          top: 10 + offsetY + STANDEE_Y * scale,
          width: 32 * scale,
          height: 13 * scale,
          zIndex: 0,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        draggable={false}
      />
      {/* Grass 2 image at same y as sprite, right side */}
      <img
        src="/assets/grass.png"
        alt="Grass"
        style={{
          position: 'absolute',
          left: -1100 + STANDEE_X * scale,
          top: -80 + offsetY + STANDEE_Y * scale,
          width: 32 * scale,
          height: 13 * scale,
          zIndex: 0,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        draggable={false}
      />
      {/* Grass 3 image at same y as sprite, right side */}
      <img
        src="/assets/grass.png"
        alt="Grass"
        style={{
          position: 'absolute',
          left: -1200 + STANDEE_X * scale,
          top: -170 + offsetY + STANDEE_Y * scale,
          width: 32 * scale,
          height: 13 * scale,
          zIndex: 0,
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
  useEffect(() => {
    // Check if the sound has already been played in this session
    const hasPlayed = sessionStorage.getItem('startSoundPlayed');
    if (!hasPlayed) {
      const audio = new Audio('/assets/start-sfx.mp3');
      audio.play().catch((error) => {
        console.error('Error playing start sound:', error);
      });
      // Mark the sound as played in this session
      sessionStorage.setItem('startSoundPlayed', 'true');
    }
  }, []); // Empty dependency array ensures this runs only on first mount

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