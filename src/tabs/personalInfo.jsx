import React, { useState, useRef } from 'react';
import { GameContainer } from '../components/GameContainer.jsx';
import { Header } from '../components/Header.jsx';
import { PlayerController } from '../components/PlayerController.jsx';
import TextType from '../components/TextType.jsx';
import { Coin } from '../components/Coin.jsx';
import { useCoin } from '../CoinContext.jsx';
import { VIRTUAL_WIDTH, VIRTUAL_HEIGHT } from '../constants/gameConstants.js';

export default function PersonalInfo() {
  const { touchedExclamation, touchExclamation, collectCoin, isCoinCollected } = useCoin();
  const [hasTounchedExclamation, setHasTouchedExclamation] = useState(false);
  const coinCollectionRef = useRef(false);
  
  const STANDEE_X = 1500;
  const STANDEE_Y = 800 - 120;
  const COIN_ID = 'personalInfo-coin-1';
  
  const coinCollected = isCoinCollected(COIN_ID);

  // Collision detection for coin and exclamation standee
  const handleSpriteCollision = (spriteX, spriteY) => {
    const SPRITE_WIDTH = 80;
    const SPRITE_HEIGHT = 80;
    
    // Check coin collision (first standee position) - only if not already collected globally
    if (!coinCollected && !coinCollectionRef.current &&
        spriteX + SPRITE_WIDTH > 70 && 
        spriteX < 70 + 63 && 
        spriteY + SPRITE_HEIGHT > STANDEE_Y - 463 && 
        spriteY < STANDEE_Y - 463 + 63) {
      coinCollectionRef.current = true;
      collectCoin(COIN_ID);
    }
    
    // Check exclamation standee collision (second standee position)
    if (!hasTounchedExclamation &&
        spriteX + SPRITE_WIDTH > 155 && 
        spriteX < 155 + 63 && 
        spriteY + SPRITE_HEIGHT > STANDEE_Y - 463 && 
        spriteY < STANDEE_Y - 463 + 63) {
      setHasTouchedExclamation(true);
      touchExclamation();
    }
  };

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

      <Coin 
        x={70}
        y={STANDEE_Y - 463}
        collected={coinCollected}
        onAnimationEnd={() => {}}
      />

      <img
        src="/assets/standee-exclamation.png"
        alt="Exclamation"
        style={{
          position: 'absolute',
          left: 155,
          top: STANDEE_Y - 463,
          width: 63,
          height: 63,
          zIndex: 0,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
        draggable={false}
      />

      {/* Typing Text Effect - Upper Part - Always show bubble, dots first, then text when standee touched */}
      <div
        style={{
          position: 'absolute',
          left: '170px',
          top: 80,
          zIndex: 15,
          textAlign: 'left',
        }}
      >
        {!touchedExclamation ? (
          <TextType 
            text={["..."]}
            typingSpeed={500}
            pauseDuration={1000}
            showCursor={false}
            cursorCharacter=""
            initialDelay={1000}
            textColors={['#FFF']}
            className="game-text"
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              fontFamily: 'PixelGameFont, monospace',
            }}
          />
        ) : (
          <TextType 
            text={["Collect coins to receive an amazing reward <3"]}
            typingSpeed={75}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="|"
            initialDelay={500}
            textColors={['#FFF']}
            className="game-text"
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              fontFamily: 'PixelGameFont, monospace',
            }}
          />
        )}
      </div>
    
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
        onSpriteMove={handleSpriteCollision}
      />
    </GameContainer>
  );
}