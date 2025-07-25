import { useRef, useEffect, useState } from 'react';

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

const GAME_WIDTH = 740;
const GAME_HEIGHT = 367;
const GROUND_Y = 300;
const GRAVITY = 0.36;
const JUMP_VELOCITY = -8;
const MOVE_SPEED = 1.7;
const PLAYER_WIDTH = 35;
const PLAYER_HEIGHT = 35;

const ANIMATION_SPEEDS = {
  run: 120,
  jump: 100,
  idle: 200
};

const PLATFORMS = [
  { x: 20, y: 220, width: 80, height: 15 },
  { x: -30, y: 160, width: 90, height: 15 },
  { x: 100, y: 180, width: 60, height: 15 },
];

function preloadImages(srcArray) {
  return Promise.all(
    srcArray.map(src => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = () => reject(`Failed to load image: ${src}`);
      });
    })
  );
}

function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const onResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return size;
}

function useImages(srcArr) {
  const [images, setImages] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    preloadImages(srcArr)
      .then(loadedImages => {
        if (isMounted) {
          setImages(loadedImages);
          setLoaded(true);
        }
      })
      .catch(error => {
        console.error('Image loading error:', error);
        if (isMounted) setLoaded(true);
      });

    return () => { isMounted = false; };
  }, [srcArr]);

  return { images, loaded };
}

function Character({ x, y, facing, state, frame, scale }) {
  const { images: runImgs, loaded: runLoaded } = useImages(SPRITE_RUN);
  const { images: jumpImgs, loaded: jumpLoaded } = useImages(SPRITE_JUMP);

  if (!runLoaded || !jumpLoaded) {
    return <div style={{ position: 'absolute', left: x, top: y, width: PLAYER_WIDTH * scale, height: PLAYER_HEIGHT * scale, backgroundColor: 'red' }} />;
  }

  let img = null;
  if (state === 'jump' && jumpImgs.length > 0) {
    img = jumpImgs[frame % jumpImgs.length];
  } else if (state === 'run' && runImgs.length > 0) {
    img = runImgs[frame % runImgs.length];
  } else if (runImgs.length > 0) {
    img = runImgs[0];
  }

  if (!img) return null;

  // Calculate shadow properties based on height above ground
  const heightAboveGround = GROUND_Y - (y / scale + PLAYER_HEIGHT);
  const maxHeight = 100; // Max height for shadow scaling
  const shadowOpacity = Math.max(0.2, 0.3 - heightAboveGround / maxHeight);
  const shadowScale = Math.max(0.4, 0.8 - heightAboveGround / maxHeight);

  return (
    <>
      {/* Shadow */}
      <div
        style={{
          position: 'absolute',
          left: x + (PLAYER_WIDTH * scale * 0.5),
          top: GROUND_Y * scale,
          width: PLAYER_WIDTH * scale * 0.8 * shadowScale,
          height: PLAYER_HEIGHT * scale * 0.3 * shadowScale,
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
          width: PLAYER_WIDTH * scale,
          height: PLAYER_HEIGHT * scale,
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

function Game() {
  const [player, setPlayer] = useState({
    x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2,
    y: -PLAYER_HEIGHT, // Start above the screen so sprite falls
    vx: 0,
    vy: 0,
    onGround: false, // Not on ground at start
    facing: 'right',
    state: 'idle',
    frame: 0,
  });
  const [textDrop, setTextDrop] = useState(false);
  const [textY, setTextY] = useState(-80); // Start above the screen
  const keys = useRef({});
  const jumpPressed = useRef(false); // Track if jump key is pressed
  const raf = useRef();
  const animationState = useRef({
    frame: 0,
    lastFrameTime: performance.now(),
    lastState: 'idle',
  });
  const landedOnce = useRef(false);

  useEffect(() => {
    const handleDown = (e) => {
      if (!keys.current[e.key]) {
        keys.current[e.key] = true;
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') {
          jumpPressed.current = true;
          console.log('Keydown:', e.key, { jumpPressed: jumpPressed.current });
        }
      }
    };
    const handleUp = (e) => {
      keys.current[e.key] = false;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') {
        jumpPressed.current = false;
        console.log('Keyup:', e.key, { jumpPressed: jumpPressed.current });
      }
    };
    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
    };
  }, []);

  useEffect(() => {
    function loop(now) {
      setPlayer((prev) => {
        let { x, y, vx, vy, facing, onGround } = prev;

        // Controls
        let moving = false;
        if (keys.current['ArrowLeft'] || keys.current['a']) {
          vx = -MOVE_SPEED;
          facing = 'left';
          moving = true;
        } else if (keys.current['ArrowRight'] || keys.current['d']) {
          vx = MOVE_SPEED;
          facing = 'right';
          moving = true;
        } else {
          vx = 0;
        }

        // Jump: Trigger only if on ground and jump key is newly pressed
        let nextOnGround = onGround;
        if ((keys.current['ArrowUp'] || keys.current['w'] || keys.current[' ']) && onGround && jumpPressed.current) {
          vy = JUMP_VELOCITY;
          nextOnGround = false;
          console.log('Jump triggered:', { jumpKey: keys.current['ArrowUp'] || keys.current['w'] || keys.current[' '], onGround, jumpPressed: jumpPressed.current });
        }

        // Gravity
        vy += GRAVITY;
        let nextX = x + vx;
        let nextY = y + vy;

        // Platform collision detection
        let landedOnPlatform = false;
        for (const plat of PLATFORMS) {
          // Check horizontal overlap
          const horizontallyOver = nextX + PLAYER_WIDTH > plat.x && nextX < plat.x + plat.width;
          // Check if falling and crossing the platform top between frames
          const prevBottom = y + PLAYER_HEIGHT;
          const nextBottom = nextY + PLAYER_HEIGHT;
          const crossesPlatform = prevBottom <= plat.y && nextBottom >= plat.y;
          if (horizontallyOver && crossesPlatform && vy > 0) {
            // Land on platform
            nextY = plat.y - PLAYER_HEIGHT;
            vy = 0;
            landedOnPlatform = true;
            break;
          }
        }

        // Ground collision (only if not on a platform)
        if (!landedOnPlatform && nextY + PLAYER_HEIGHT >= GROUND_Y) {
          nextY = GROUND_Y - PLAYER_HEIGHT;
          vy = 0;
          nextOnGround = true;
        } else if (landedOnPlatform) {
          nextOnGround = true;
        } else {
          nextOnGround = false;
        }

        // Boundaries
        if (nextX < 0) nextX = 0;
        if (nextX + PLAYER_WIDTH > GAME_WIDTH) nextX = GAME_WIDTH - PLAYER_WIDTH;

        // Animation state
        let nextState = nextOnGround ? (moving ? 'run' : 'idle') : 'jump';

        // Animation frame logic
        if (nextState !== animationState.current.lastState) {
          animationState.current.frame = 0;
          animationState.current.lastFrameTime = now;
          animationState.current.lastState = nextState;
        } else if (nextState === 'run' || nextState === 'jump') {
          const animationSpeed = ANIMATION_SPEEDS[nextState];
          const frameCount = nextState === 'run' ? SPRITE_RUN.length : SPRITE_JUMP.length;
          if (now - animationState.current.lastFrameTime >= animationSpeed) {
            animationState.current.frame = (animationState.current.frame + 1) % frameCount;
            animationState.current.lastFrameTime = now - (now - animationState.current.lastFrameTime - animationSpeed);
          }
        } else {
          animationState.current.frame = 0;
        }

        // Detect first landing on ground (not platform) - FIXED CONDITION
        if (!landedOnce.current && !prev.onGround && nextOnGround && nextY + PLAYER_HEIGHT >= GROUND_Y - 1) {
          landedOnce.current = true;
          console.log('First landing detected! Triggering text drop.');
          setTimeout(() => setTextDrop(true), 400); // Delay before text falls
        }

        return {
          x: nextX,
          y: nextY,
          vx,
          vy,
          onGround: nextOnGround,
          facing,
          state: nextOnGround ? (vx !== 0 ? 'run' : 'idle') : 'jump',
          frame: animationState.current.frame,
        };
      });

      raf.current = requestAnimationFrame(loop);
    }

    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  // Animate text falling after sprite lands
  useEffect(() => {
    if (!textDrop) {
      setTextY(-80);
      return;
    }
    console.log('Text drop animation starting!');
    let running = true;
    let vy = 0;
    let y = -80;
    const targetY = GAME_HEIGHT / 2 - 40; // Centered in game area
    function animate() {
      vy += 0.15; // gravity for text (was 0.7, now slower)
      y += vy;
      if (y > targetY) {
        y = targetY;
        running = false;
      }
      setTextY(y);
      if (running) requestAnimationFrame(animate);
    }
    animate();
  }, [textDrop]);

  const { width, height } = useWindowSize();
  const scale = Math.min(width / GAME_WIDTH, height / GAME_HEIGHT);
  const offsetX = (width - GAME_WIDTH * scale) / 2;
  const offsetY = (height - GAME_HEIGHT * scale) / 2;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 2,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: offsetX,
          top: offsetY,
          width: GAME_WIDTH * scale,
          height: GAME_HEIGHT * scale,
          backgroundColor: 'rgba(0,0,0,0)',
        }}
      >
        {/* Render platforms */}
        {PLATFORMS.map((plat, idx) => (
          <img
            key={idx}
            src="/assets/platform.png"
            alt="platform"
            style={{
              position: 'absolute',
              left: plat.x * scale,
              top: plat.y * scale,
              width: plat.width * scale,
              height: plat.height * scale,
              zIndex: 0,
              pointerEvents: 'none',
              userSelect: 'none',
            }}
            draggable={false}
          />
        ))}
        <Character
          x={player.x * scale}
          y={player.y * scale}
          facing={player.facing}
          state={player.state}
          frame={player.frame}
          scale={scale}
        />
        {/* Falling text - use local pixel-game font */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            width: '100%',
            top: textY * scale,
            textAlign: 'center',
            fontSize: 32 * scale,
            fontWeight: 'normal', // Pixel fonts are usually normal weight
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
            pointerEvents: 'none',
            transition: 'none',
            zIndex: 10,
            letterSpacing: 1,
            fontFamily: 'PixelGameFont, monospace', // Use your local pixel-game font
            userSelect: 'none',
          }}
        >
          {textDrop && "Walk right to explore!"}
        </div>
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            color: 'white',
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: '5px',
            fontSize: '12px',
            fontFamily: 'monospace',
          }}
        >
          State: {player.state} | Frame: {player.frame}/
          {player.state === 'run' ? SPRITE_RUN.length - 1 : player.state === 'jump' ? SPRITE_JUMP.length - 1 : 0} |
          JumpPressed: {jumpPressed.current.toString()} | OnGround: {player.onGround.toString()} |
          TextDrop: {textDrop.toString()} | LandedOnce: {landedOnce.current.toString()}
        </div>
      </div>
    </div>
  );
}

function App() {
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
      <Game />
    </div>
  );
}

export default App;