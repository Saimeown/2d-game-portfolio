import React from 'react';

const SPRITE_IDLE = [
  '/assets/sprite/Idle/frame_1.png',
  '/assets/sprite/Idle/frame_2.png',
  '/assets/sprite/Idle/frame_3.png',
  '/assets/sprite/Idle/frame_4.png',
];
const SPRITE_RUN = [
  '/assets/sprite/Jump/frame_8.png',
  '/assets/sprite/Run/frame_2.png',
  '/assets/sprite/Run/frame_3.png',
  '/assets/sprite/Run/frame_4.png',
  '/assets/sprite/Run/frame_5.png',
  '/assets/sprite/Run/frame_6.png',
];
const SPRITE_JUMP = [
  '/assets/sprite/Jump/frame_1.png',
  '/assets/sprite/Jump/frame_2.png',
  '/assets/sprite/Jump/frame_3.png',
  '/assets/sprite/Jump/frame_4.png',
  '/assets/sprite/Jump/frame_6.png',
  '/assets/sprite/Jump/frame_7.png',
  '/assets/sprite/Jump/frame_8.png',
];

const PLAYER_WIDTH = 80;
const PLAYER_HEIGHT = 80;
const GROUND_Y = 800;

function preloadImages(srcArray) {
  return Promise.all(
    srcArray.map(src => {
      return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = () => reject(`Failed to load image: ${src}`);
      });
    })
  );
}

function useImages(srcArr) {
  const [images, setImages] = React.useState([]);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    preloadImages(srcArr)
      .then(loadedImages => {
        if (isMounted) {
          setImages(loadedImages);
          setLoaded(true);
        }
      })
      .catch(() => {
        if (isMounted) setLoaded(true);
      });
    return () => { isMounted = false; };
  }, [srcArr]);

  return { images, loaded };
}

export function Sprite({ x, y, facing, state, frame }) {
  const { images: idleImgs, loaded: idleLoaded } = useImages(SPRITE_IDLE);
  const { images: runImgs, loaded: runLoaded } = useImages(SPRITE_RUN);
  const { images: jumpImgs, loaded: jumpLoaded } = useImages(SPRITE_JUMP);

  if (!idleLoaded || !runLoaded || !jumpLoaded) {
    return (
      <div 
        style={{ 
          position: 'absolute', 
          left: x, 
          top: y, 
          width: PLAYER_WIDTH, 
          height: PLAYER_HEIGHT, 
          backgroundColor: 'red' 
        }} 
      />
    );
  }

  let img = null;
  if (state === 'idle' && idleImgs.length > 0) {
    img = idleImgs[frame % idleImgs.length];
  } else if (state === 'run' && runImgs.length > 0) {
    img = runImgs[frame % runImgs.length];
  } else if (state === 'jump' && jumpImgs.length > 0) {
    img = jumpImgs[frame % jumpImgs.length];
  } else if (idleImgs.length > 0) {
    img = idleImgs[0]; // Fallback to first idle frame
  }

  if (!img) return null;

  // Calculate shadow properties
  const heightAboveGround = GROUND_Y - (y + PLAYER_HEIGHT);
  const maxHeight = 200;
  const shadowOpacity = Math.max(0.2, 0.3 - heightAboveGround / maxHeight);
  const shadowScale = Math.max(0.4, 0.8 - heightAboveGround / maxHeight);

  return (
    <>
      {/* Shadow */}
      <div
        style={{
          position: 'absolute',
          left: x + (PLAYER_WIDTH * 0.5),
          top: GROUND_Y,
          width: PLAYER_WIDTH * 0.8 * shadowScale,
          height: PLAYER_HEIGHT * 0.3 * shadowScale,
          backgroundColor: `rgba(0, 0, 0, ${shadowOpacity})`,
          borderRadius: '50%',
          zIndex: 1,
          pointerEvents: 'none',
          transform: 'translateX(-50%)',
        }}
      />
      {/* Character Sprite */}
      <img
        src={img.src}
        alt="character"
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: PLAYER_WIDTH,
          height: PLAYER_HEIGHT,
          imageRendering: 'pixelated',
          transform: facing === 'left' ? 'scaleX(-1)' : 'none',
          zIndex: 2,
          pointerEvents: 'none',
          transition: 'none',
        }}
      />
    </>
  );
}