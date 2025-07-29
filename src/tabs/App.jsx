import React, { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import { Header } from '../components/Header.jsx';
import { PlayerController } from '../components/PlayerController.jsx';
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

  const STANDEE_X = 600;
  const STANDEE_Y = 300 - 60; // 240
  const STORE_X = 40;
  const STORE_Y = 300 - 60;
  const offsetY = (window.innerHeight - 367 * scale) / 2;

  // Define grass platforms
  const grassPlatforms = [
    {
      x: -378 + STANDEE_X, // -400
      y: 4 + STANDEE_Y, // 250
      width: 10,
      height: 7,
    },
    {
      x: -455 + STANDEE_X, // -500
      y: -65.4 + STANDEE_Y, // 160
      width: 10,
      height: 7,
    },
    {
      x: -415 + STANDEE_X, // -600
      y: -31 + STANDEE_Y, // 70
      width: 10,
      height: 7,
    },
    {
      x: 37 + STANDEE_X, // -600
      y: -143 + STANDEE_Y, // 70
      width: 10,
      height: 7,
    },
    {
      x: 76 + STANDEE_X, // -600
      y: -182 + STANDEE_Y, // 70
      width: 10,
      height: 7,
    },
    {
      x: -582 + STANDEE_X, // -600
      y: -154 + STANDEE_Y, // 70
      width: 75,
      height: 7,
    },
  ];

  return (
    <>
      {/* Store image */}
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
      {/* Standee image */}
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
      {/* Hotel Image */}
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
      {/* Billboard image */}
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
      {/* School image */}
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
      {/* Cart image */}
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
      {/* Building image */}
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
      {/* Fence image 1 */}
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
      {/* Fence image 2 */}
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
      {/* Fence image 3 */}
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
      {/* Fence image 4 */}
      <img
        src="/assets/FENCE.png"
        alt="Fence"
        style={{
          position: 'absolute',
          left: -550 + STANDEE_X * scale,
          top: 75 + offsetY + STANDEE_Y * scale,
          width: 120 * scale,
          height: 28 * scale,
          zIndex: 0,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        draggable={false}
      />
      {/* Fence image 5 */}
      <img
        src="/assets/FENCE.png"
        alt="Fence"
        style={{
          position: 'absolute',
          left: -350 + STANDEE_X * scale,
          top: 75 + offsetY + STANDEE_Y * scale,
          width: 120 * scale,
          height: 28 * scale,
          zIndex: 0,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        draggable={false}
      />
      {/* Grass images */}
      <img
        src="/assets/SHORT-BRICK.png"
        alt="Brick"
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
      <img
        src="/assets/SHORT-BRICK.png"
        alt="Brick"
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
      <img
        src="/assets/SHORT-BRICK.png"
        alt="Brick"
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
      <img
        src="/assets/SHORT-BRICK.png"
        alt="Brick"
        style={{
          position: 'absolute',
          left: 70 + STANDEE_X * scale,
          top: -370 + offsetY + STANDEE_Y * scale,
          width: 32 * scale,
          height: 13 * scale,
          zIndex: 0,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        draggable={false}
      />
      <img
        src="/assets/SHORT-BRICK.png"
        alt="Brick"
        style={{
          position: 'absolute',
          left: 170 + STANDEE_X * scale,
          top: -470 + offsetY + STANDEE_Y * scale,
          width: 32 * scale,
          height: 13 * scale,
          zIndex: 0,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        draggable={false}
      />
      <img
        src="/assets/LONG-BRICK.png"
        alt="Brick"
        style={{
          position: 'absolute',
          left: -1505 + STANDEE_X * scale,
          top: -400 + offsetY + STANDEE_Y * scale,
          width: 80 * scale,
          height: 13 * scale,
          zIndex: 0,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        draggable={false}
      />
      <img
        src="/assets/standee-exclamation.png"
        alt="Exclamation"
        style={{
          position: 'absolute',
          left: -1385 + STANDEE_X * scale,
          top: -462 + offsetY + STANDEE_Y * scale,
          width: 25 * scale,
          height: 25 * scale,
          zIndex: 0,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        draggable={false}
      />
      <img
        src="/assets/DOOR.png"
        alt="Door"
        style={{
          position: 'absolute',
          left: -1475 + STANDEE_X * scale,
          top: -515.5 + offsetY + STANDEE_Y * scale,
          width: 30 * scale,
          height: 45 * scale,
          zIndex: 0,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        draggable={false}
      />
      {/*}
      {grassPlatforms.map((platform, index) => (
        <div
          key={`grass-visual-${index}`}
          style={{
            position: 'absolute',
            left: platform.x * scale,
            top: platform.y * scale + offsetY,
            width: platform.width * scale,
            height: platform.height * scale,
            border: '2px solid blue',
            backgroundColor: 'rgba(0, 0, 255, 0.3)',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        />
      ))}
      */}
      <PlayerController
        leftRoute={null}
        rightRoute="/next"
        showText={true}
        fallOnLoad={true}
        platforms={grassPlatforms} // Pass platforms to PlayerController
      />
    </>
  );
}

export default function App() {
  useEffect(() => {
    const hasPlayed = sessionStorage.getItem('startSoundPlayed');
    if (!hasPlayed) {
      const audio = new Audio('/assets/start-sfx.mp3');
      audio.play().catch((error) => {
        console.error('Error playing start sound:', error);
      });
      sessionStorage.setItem('startSoundPlayed', 'true');
    }
  }, []);

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
        <Route path="/" element={<MainWithPlatforms />} />
        <Route path="/next" element={<PersonalInfo />} />
      </Routes>
    </div>
  );
}