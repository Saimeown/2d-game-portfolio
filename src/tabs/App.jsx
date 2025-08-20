import React, { useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import { GameContainer } from '../components/GameContainer.jsx';
import { Header } from '../components/Header.jsx';
import { PlayerController } from '../components/PlayerController.jsx';
import PersonalInfo from './personalInfo.jsx';
import { VIRTUAL_WIDTH, VIRTUAL_HEIGHT } from '../constants/gameConstants.js';
import '../index.css';

function MainWithPlatforms() {
  // Use virtual coordinates directly
  const STANDEE_X = 1500;
  const STANDEE_Y = 800 - 120; // 680
  const STORE_X = 100;
  const STORE_Y = 800 - 120;

  // Define platforms using virtual coordinates
  const grassPlatforms = [
    {
      x: STANDEE_X - 970,
      y: STANDEE_Y - 30,
      width: 25,
      height: 15,
    },
    {
      x: STANDEE_X - 1050,
      y: STANDEE_Y - 100,
      width: 25,
      height: 15,
    },
    {
      x: STANDEE_X - 1130,
      y: STANDEE_Y - 170,
      width: 25,
      height: 15,
    },
    {
      x: STANDEE_X + 100,
      y: STANDEE_Y - 400,
      width: 25,
      height: 15,
    },
    {
      x: STANDEE_X + 190,
      y: STANDEE_Y - 480,
      width: 25,
      height: 15,
    },
    {
      x: STANDEE_X - 1450,
      y: STANDEE_Y - 400,
      width: 180,
      height: 15,
    },
  ];

  return (
    <>
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: VIRTUAL_WIDTH,
          height: VIRTUAL_HEIGHT,
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
          left: STANDEE_X - 80,
          top: STANDEE_Y - 99,
          width: 200,
          height: 200,
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
          left: STANDEE_X + 150,
          top: STANDEE_Y + 26,
          width: 75,
          height: 75,
          zIndex: 2,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        draggable={false}
      />

      {/* Hotel Image */}
      <img
        src="/assets/HOTEL.png"
        alt="Hotel"
        style={{
          position: 'absolute',
          left: STANDEE_X - 300,
          top: STANDEE_Y - 119,
          width: 220,
          height: 220,
          zIndex: 2,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        draggable={false}
      />

      {/* Billboard image */}
      <img
        src="/assets/BILLBOARD.png"
        alt="Billboard"
        style={{
          position: 'absolute',
          left: STANDEE_X + 675,
          top: STANDEE_Y - 600,
          width: 375,
          height: 375,
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
          left: STANDEE_X - 1325,
          top: STANDEE_Y - 124,
          width: 225,
          height: 225,
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
          left: STANDEE_X - 455,
          top: STANDEE_Y - 48,
          width: 150,
          height: 150,
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
          left: STANDEE_X - 1590,
          top: STANDEE_Y - 125,
          width: 150,
          height: 225,
          zIndex: 2,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        draggable={false}
      />

      {/* Fence images */}
      <img
        src="/assets/FENCE.png"
        alt="Fence"
        style={{
          position: 'absolute',
          left: STANDEE_X - 1525,
          top: STANDEE_Y + 30,
          width: 300,
          height: 70,
          zIndex: 0,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        draggable={false}
      />
      <img
        src="/assets/FENCE.png"
        alt="Fence"
        style={{
          position: 'absolute',
          left: STANDEE_X - 425,
          top: STANDEE_Y + 30,
          width: 300,
          height: 70,
          zIndex: 0,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        draggable={false}
      />
      <img
        src="/assets/FENCE.png"
        alt="Fence"
        style={{
          position: 'absolute',
          left: STANDEE_X - 225,
          top: STANDEE_Y + 30,
          width: 300,
          height: 70,
          zIndex: 0,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        draggable={false}
      />
      <img
        src="/assets/FENCE.png"
        alt="Fence"
        style={{
          position: 'absolute',
          left: STANDEE_X - 1125,
          top: STANDEE_Y + 30,
          width: 300,
          height: 70,
          zIndex: 0,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        draggable={false}
      />
      <img
        src="/assets/FENCE.png"
        alt="Fence"
        style={{
          position: 'absolute',
          left: STANDEE_X - 2413,
          top: STANDEE_Y + 30,
          width: 300,
          height: 70,
          zIndex: 0,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        draggable={false}
      />
      <img
        src="/assets/FENCE.png"
        alt="Fence"
        style={{
          position: 'absolute',
          left: STANDEE_X - 1375,
          top: STANDEE_Y + 30,
          width: 300,
          height: 70,
          zIndex: 0,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        draggable={false}
      />
      <img
        src="/assets/FENCE.png"
        alt="Fence"
        style={{
          position: 'absolute',
          left: STANDEE_X - 875,
          top: STANDEE_Y + 30,
          width: 300,
          height: 70,
          zIndex: 0,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        draggable={false}
      />

      {/* Brick platforms */}
      <img
        src="/assets/SHORT-BRICK.png"
        alt="Brick"
        style={{
          position: 'absolute',
          left: 503,
          top: STANDEE_Y - 30,
          width: 80,
          height: 33,
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
          left: 420,
          top: STANDEE_Y - 100,
          width: 80,
          height: 33,
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
          left: 345,
          top: STANDEE_Y - 170,
          width: 80,
          height: 33,
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
          left: STANDEE_X + 75,
          top: STANDEE_Y - 400,
          width: 80,
          height: 33,
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
          left: STANDEE_X + 162,
          top: STANDEE_Y - 480,
          width: 80,
          height: 33,
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
          left: 40,
          top: STANDEE_Y - 400,
          width: 200,
          height: 33,
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
          left: 150,
          top: STANDEE_Y - 460,
          width: 63,
          height: 63,
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
          left: 70,
          top: STANDEE_Y - 510,
          width: 75,
          height: 113,
          zIndex: 0,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        draggable={false}
      />

      <PlayerController
        leftRoute={null}
        rightRoute="/next"
        showText={true}
        fallOnLoad={true}
        platforms={grassPlatforms}
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
    <GameContainer>
      <Header />
      <Routes>
        <Route path="/" element={<MainWithPlatforms />} />
        <Route path="/next" element={<PersonalInfo />} />
      </Routes>
    </GameContainer>
  );
}