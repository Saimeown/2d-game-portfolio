import React, { useState, useEffect, useRef, useContext } from 'react';
import { SoundEffectsContext } from '../MusicContext.js';

const COIN_FRAMES = [
  "/assets/coin/frame_1.png",
  "/assets/coin/frame_2.png",
  "/assets/coin/frame_3.png",
  "/assets/coin/frame_4.png",
  "/assets/coin/frame_5.png",
  "/assets/coin/frame_6.png",
  "/assets/coin/frame_7.png",
  "/assets/coin/frame_8.png",
  "/assets/coin/frame_9.png",
];

export function Coin({ x, y, collected, onAnimationEnd }) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [bounce, setBounce] = useState(0);
  const coinSfxRef = useRef(null);
  const { muted: sfxMuted } = useContext(SoundEffectsContext);

  useEffect(() => {
    coinSfxRef.current = new Audio("/assets/coin-sfx.mp3");
    coinSfxRef.current.volume = 0.8;
  }, []);

  useEffect(() => {
    if (collected) return;
    
    const interval = setInterval(() => {
      setFrameIndex(prev => (prev + 1) % COIN_FRAMES.length);
    }, 100);

    return () => clearInterval(interval);
  }, [collected]);

  useEffect(() => {
    if (!collected) return;

    if (coinSfxRef.current && !sfxMuted) {
      coinSfxRef.current.currentTime = 0;
      coinSfxRef.current.play().catch(e => console.error('Coin sound error:', e));
    }

    let bounceHeight = 0;
    let velocity = -15;
    const gravity = 0.8;
    let opacity = 1;

    const animateCollect = () => {
      velocity += gravity;
      bounceHeight += velocity;
      opacity -= 0.05;

      setBounce(bounceHeight);

      if (opacity > 0) {
        requestAnimationFrame(animateCollect);
      } else {
        onAnimationEnd();
      }
    };

    animateCollect();
  }, [collected, onAnimationEnd, sfxMuted]);

  if (collected && bounce === 0) return null;

  return (
    <img
      src={COIN_FRAMES[frameIndex]}
      alt="Coin"
      style={{
        position: 'absolute',
        left: x,
        top: y + bounce,
        width: 40,
        height: 40,
        objectFit: 'contain',
        opacity: collected ? Math.max(0, 1 - Math.abs(bounce) / 100) : 1,
        transform: collected ? `scale(${Math.max(0.5, 1 - Math.abs(bounce) / 200)})` : 'none',
        zIndex: 15,
        pointerEvents: 'none',
      }}
      draggable={false}
    />
  );
}
