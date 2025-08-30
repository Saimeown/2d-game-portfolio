import React from 'react';
import { GameContainer } from '../components/GameContainer.jsx';
import { Header } from '../components/Header.jsx';
import { PlayerController } from '../components/PlayerController.jsx';
import { VIRTUAL_WIDTH, VIRTUAL_HEIGHT } from '../constants/gameConstants.js';

export default function PersonalInfo() {
  const STANDEE_X = 1500;
  const STANDEE_Y = 800 - 120;

  const grassPlatforms = [
    {
      x: 145,
      y: 649,  
      width: 300,
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
    <GameContainer>
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
          width: VIRTUAL_WIDTH,
          height: VIRTUAL_HEIGHT,
          objectFit: 'cover',
          zIndex: 0,
          pointerEvents: 'none',
        }}
        src="src/assets/background-image.mp4"
      />
      
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
        src="/assets/platforms/SHORT-STONE.png"
        alt="Brick"
        style={{
          position: 'absolute',
          left: STANDEE_X - 762,
          top: STANDEE_Y - 80,
          width: 80,
          height: 33,
          zIndex: 0,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        draggable={false}
      />

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