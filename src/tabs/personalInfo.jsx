import React from 'react';
import { GameContainer } from '../components/GameContainer.jsx';
import { Header } from '../components/Header.jsx';
import { PlayerController } from '../components/PlayerController.jsx';
import { VIRTUAL_WIDTH, VIRTUAL_HEIGHT } from '../constants/gameConstants.js';

export default function PersonalInfo() {
  // Use virtual coordinates directly
  const STANDEE_X = 1500;
  const STANDEE_Y = 800 - 120; // 680

  // Example platforms using virtual coordinates
  const grassPlatforms = [
    {
      x: 145, // horizontal position
      y: 649, // vertical position  
      width: 300, // width of the platform
      height: 15, // height of the platform
    },
  ];

  return (
    <GameContainer>
      <Header />
      
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
      
   
      
   
      
      {/* Billboard image */}
      <img
        src="/assets/BILLBOARD.png"
        alt="Billboard"
        style={{
          position: 'absolute',
          left: 100,
          top: STANDEE_Y - 280,
          width: 375,
          height: 375,
          zIndex: 2,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        draggable={false}
      />
      
      {/* Under Development Text */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          width: VIRTUAL_WIDTH,
          top: VIRTUAL_HEIGHT / 2 - 100,
          textAlign: 'center',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 'bold',
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
            fontFamily: 'PixelGameFont, monospace',
            userSelect: 'none',
            marginBottom: '20px',
          }}
        >
          🚧🚧🚧
        </div>
        <div
          style={{
            fontSize: 40,
            fontWeight: 'normal',
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
            fontFamily: 'PixelGameFont, monospace',
            userSelect: 'none',
          }}
        >
        </div>
      </div>
      
      <PlayerController
        leftRoute="/"
        rightRoute={null}
        showText={false}
        fallOnLoad={false}
        startAtLeft={true}
        platforms={grassPlatforms}
      />
    </GameContainer>
  );
}