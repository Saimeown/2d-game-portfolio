import React, { useRef, useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sprite } from './Sprite.jsx';
import PlayerPositionContext from '../PlayerPositionContext.js';
import PlayerMovementContext from '../PlayerMovementContext.jsx';
import { SoundEffectsContext } from '../MusicContext.js';

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
  idle: 200,
};

function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const onResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return size;
}

export function PlayerController({ leftRoute, rightRoute, showText, fallOnLoad, startAtLeft, platforms = [] }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { y: sharedY, setY: setSharedY } = useContext(PlayerPositionContext);
  const { setIsMoving } = useContext(PlayerMovementContext);
  const { muted: sfxMuted } = useContext(SoundEffectsContext);

  const isInitialRender = useRef(!fallOnLoad && rightRoute && location.pathname === rightRoute);
  const lastLandedPlatform = useRef(null); // Track last landed platform index

  let initialX;
  if (startAtLeft) {
    initialX = 0;
  } else if (!fallOnLoad && rightRoute && location.pathname === rightRoute) {
    initialX = 0;
  } else if (!fallOnLoad && leftRoute && location.pathname === leftRoute) {
    initialX = GAME_WIDTH - PLAYER_WIDTH;
  } else if (fallOnLoad && rightRoute && location.pathname === rightRoute) {
    initialX = GAME_WIDTH - PLAYER_WIDTH;
  } else if (fallOnLoad && leftRoute && location.pathname === leftRoute) {
    initialX = 0;
  } else {
    initialX = GAME_WIDTH / 2 - PLAYER_WIDTH / 2; // Approx 352.5
  }

  const initialY = (() => {
    if (fallOnLoad) return -PLAYER_HEIGHT;
    if (sharedY !== null && !fallOnLoad) return sharedY;
    return GROUND_Y - PLAYER_HEIGHT;
  })();

  const [player, setPlayer] = useState({
    x: initialX,
    y: initialY,
    vx: 0,
    vy: 0,
    onGround: !fallOnLoad,
    facing: (!fallOnLoad && rightRoute && location.pathname === rightRoute) ? 'right' : 'left',
    state: 'idle',
    frame: 0,
  });
  const [textDrop, setTextDrop] = useState(false);
  const [textY, setTextY] = useState(-80);
  const [letterBounces, setLetterBounces] = useState({});
  const [textBlinkingActive, setTextBlinkingActive] = useState(false);
  const [textBlink, setTextBlink] = useState(true);

  if (!window.__PLAYER_KEYS__) window.__PLAYER_KEYS__ = {};
  const keys = React.useMemo(() => ({ current: window.__PLAYER_KEYS__ }), []);
  const jumpPressed = useRef(false);
  const raf = useRef();
  const animationState = useRef({
    frame: 0,
    lastFrameTime: performance.now(),
    lastState: 'idle',
  });
  const landedOnce = useRef(false);
  const jumpAudioRef = useRef(null);
  const runAudioRef = useRef(null);
  const bumpAudioRef = useRef(null);
  const runningRef = useRef(false);

  useEffect(() => {
    jumpAudioRef.current = new Audio('/assets/jump-sfx.mp3');
    jumpAudioRef.current.volume = 0.7;
    runAudioRef.current = new Audio('/assets/run-sfx.mp3');
    runAudioRef.current.volume = 0.7;
    runAudioRef.current.loop = true;
    bumpAudioRef.current = new Audio('/public/assets/bump-sfx.wav');
    bumpAudioRef.current.volume = 0.8;
    console.log('Audio initialized');
  }, []);

  // Handle SFX muting - stop run audio immediately when muted
  useEffect(() => {
    if (sfxMuted && runAudioRef.current && runningRef.current) {
      runAudioRef.current.pause();
      runAudioRef.current.currentTime = 0;
      runningRef.current = false;
    }
  }, [sfxMuted]);

  useEffect(() => {
    const handleDown = (e) => {
      const key = e.key.toLowerCase();
      if (!window.__PLAYER_KEYS__[key]) {
        window.__PLAYER_KEYS__[key] = true;
        if (key === 'arrowup' || key === 'w' || key === ' ') {
          jumpPressed.current = true;
        }
      }
    };
    const handleUp = (e) => {
      const key = e.key.toLowerCase();
      window.__PLAYER_KEYS__[key] = false;
      if (key === 'arrowup' || key === 'w' || key === ' ') {
        jumpPressed.current = false;
      }
    };
    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
    };
  }, []);

  // Define text platforms
  const textString = "START YOUR QUEST >>>";
  const fontSize = 50;
  const letterSpacing = 2; // Normal spacing between letters
  const spaceWidth = fontSize * 0.3; // Width for space characters (reduced)
  const letterWidth = fontSize * 0.4; // Width for regular characters
  
  // Calculate positions taking into account different widths for spaces vs letters
  let currentX = 0;
  const charPositions = textString.split('').map((char, index) => {
    const width = char === ' ' ? spaceWidth : letterWidth;
    const x = currentX + 5;
    currentX += width + letterSpacing;
    return { char, x, width, index };
  });
  
  const totalTextWidth = currentX - letterSpacing;
  const textXStart = (GAME_WIDTH - totalTextWidth) / 2;
  
  const textPlatforms = textDrop
    ? charPositions.filter(charData => charData.char !== ' ').map((charData) => ({
        x: textXStart + charData.x,
        y: textY - 20,
        width: charData.width,
        height: fontSize * 0.8,
        letter: charData.char,
        index: charData.index,
      }))
    : [];

  // Handle letter bounce animation
  useEffect(() => {
    if (!textDrop || !textBlinkingActive) return;
    const bounceTimers = {};
    Object.keys(letterBounces).forEach((index) => {
      if (letterBounces[index] !== 0) {
        bounceTimers[index] = setTimeout(() => {
          setLetterBounces((prev) => ({ ...prev, [index]: 0 }));
        }, 200);
      }
    });
    return () => {
      Object.values(bounceTimers).forEach(clearTimeout);
    };
  }, [letterBounces, textDrop, textBlinkingActive]);

  useEffect(() => {
    if (!showText || !textDrop) {
      setTextY(-80);
      setTextBlinkingActive(false);
      return;
    }
    let running = true;
    let vy = 0;
    let y = -80;
    const targetY = GAME_HEIGHT / 2 - 40;
    function animate() {
      vy += 0.15;
      y += vy;
      if (y > targetY) {
        y = targetY;
        running = false;
        setTextBlinkingActive(true);
      }
      setTextY(y);
      if (running) requestAnimationFrame(animate);
    }
    animate();
    console.log('Text drop animation started');
  }, [textDrop, showText]);

  useEffect(() => {
    if (!showText || !textBlinkingActive) {
      setTextBlink(true);
      return;
    }
    setTextBlink(true);
    const interval = setInterval(() => {
      setTextBlink((b) => !b);
    }, 180);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setTextBlink(true);
    }, 2000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [textBlinkingActive, showText]);

  useEffect(() => {
    function loop(now) {
      setPlayer((prev) => {
        let { x, y, vx, vy, facing, onGround } = prev;
        let moving = false;
        if (keys.current['arrowleft'] || keys.current['a']) {
          vx = -MOVE_SPEED;
          facing = 'left';
          moving = true;
        } else if (keys.current['arrowright'] || keys.current['d']) {
          vx = MOVE_SPEED;
          facing = 'right';
          moving = true;
        } else {
          vx = 0;
        }
        
        // Update movement context
        setIsMoving(moving && prev.onGround);
        if (moving && prev.onGround) {
          if (!runningRef.current && runAudioRef.current && !sfxMuted) {
            runAudioRef.current.currentTime = 0;
            runAudioRef.current.play().catch((e) => console.error('Run audio error:', e));
            runningRef.current = true;
          }
        } else {
          if (runningRef.current && runAudioRef.current) {
            runAudioRef.current.pause();
            runAudioRef.current.currentTime = 0;
            runningRef.current = false;
          }
        }
        let nextOnGround = onGround;
        if ((keys.current['arrowup'] || keys.current['w'] || keys.current[' ']) && onGround && jumpPressed.current) {
          vy = JUMP_VELOCITY;
          nextOnGround = false;
          if (jumpAudioRef.current && !sfxMuted) {
            jumpAudioRef.current.currentTime = 0;
            jumpAudioRef.current.play().catch((e) => console.error('Jump audio error:', e));
          }
          if (runAudioRef.current) {
            runAudioRef.current.pause();
            runAudioRef.current.currentTime = 0;
            runningRef.current = false;
          }
        }
        vy += GRAVITY;
        let nextX = x + vx;
        if (!fallOnLoad && rightRoute && location.pathname === rightRoute && isInitialRender.current) {
          nextX = 0;
          isInitialRender.current = false;
        }
        if (!fallOnLoad && rightRoute && location.pathname === rightRoute) {
          nextX = 0;
        }
        let nextY = y + vy;

        // Combine grass and text platforms
        const allPlatforms = [...platforms, ...textPlatforms];

        // Platform collision detection
        let landedOnPlatform = false;
        let currentLandedPlatform = null;
        let currentlyStandingOnLetters = new Set(); // Track which letters player is currently on
        
        if (vy > 0) {
          for (const platform of allPlatforms) {
            const playerLeft = nextX;
            const playerRight = nextX + PLAYER_WIDTH;
            const playerBottom = nextY + PLAYER_HEIGHT;
            const playerTop = nextY;
            const platformLeft = platform.x;
            const platformRight = platform.x + platform.width;
            const platformTop = platform.y;
            const platformBottom = platform.y + platform.height;

            console.log(`Player: x=${nextX.toFixed(2)}, y=${nextY.toFixed(2)}, bottom=${playerBottom.toFixed(2)}`);
            console.log(`Platform ${platform.letter ? `Letter ${platform.letter}` : `Grass ${platforms.indexOf(platform)}`}: x=${platform.x}, y=${platform.y}, top=${platformTop}, bottom=${platformBottom}`);

            if (
              playerRight > platformLeft &&
              playerLeft < platformRight &&
              playerTop <= platformTop &&
              playerBottom >= platformTop &&
              playerBottom <= platformBottom + 10
            ) {
              console.log(`Collision detected with ${platform.letter ? `letter ${platform.letter}` : `grass platform ${platforms.indexOf(platform)}`} at x=${platform.x}, y=${platform.y}`);
              nextY = platformTop - PLAYER_HEIGHT;
              vy = 0;
              landedOnPlatform = true;
              nextOnGround = true;
              if (platform.letter && lastLandedPlatform.current !== platform.index) {
                setLetterBounces((prev) => ({ ...prev, [platform.index]: 10 }));
                lastLandedPlatform.current = platform.index;
                // Play bump sound when letter starts bouncing
                if (bumpAudioRef.current && !sfxMuted) {
                  bumpAudioRef.current.currentTime = 0;
                  bumpAudioRef.current.play().catch((e) => console.error('Bump audio error:', e));
                }
                console.log(`Bounce triggered for letter ${platform.letter} at index ${platform.index}`);
              }
              currentLandedPlatform = platform.index;
              if (platform.letter) {
                currentlyStandingOnLetters.add(platform.index);
              }
              break;
            }
          }
        }

        // Also check if player is standing on any text platforms (not just landing on them)
        for (const platform of textPlatforms) {
          const playerLeft = nextX;
          const playerRight = nextX + PLAYER_WIDTH;
          const playerBottom = nextY + PLAYER_HEIGHT;
          const platformLeft = platform.x;
          const platformRight = platform.x + platform.width;
          const platformTop = platform.y;
          const platformBottom = platform.y + platform.height;

          // Check if player is currently standing on this letter platform
          if (
            playerRight > platformLeft &&
            playerLeft < platformRight &&
            playerBottom >= platformTop &&
            playerBottom <= platformBottom + 5 // Small tolerance
          ) {
            currentlyStandingOnLetters.add(platform.index);
          }
        }

        // Stop bouncing for letters the player is no longer standing on
        setLetterBounces((prev) => {
          const newBounces = { ...prev };
          Object.keys(newBounces).forEach((index) => {
            const indexNum = parseInt(index);
            if (!currentlyStandingOnLetters.has(indexNum) && newBounces[index] > 0) {
              newBounces[index] = 0; // Stop bouncing immediately
              console.log(`Stopped bouncing for letter at index ${index}`);
            }
          });
          return newBounces;
        });

        // Reset lastLandedPlatform if not on a platform
        if (!landedOnPlatform) {
          lastLandedPlatform.current = null;
        } else if (currentLandedPlatform !== lastLandedPlatform.current) {
          lastLandedPlatform.current = currentLandedPlatform;
        }

        if (!landedOnPlatform && nextY + PLAYER_HEIGHT >= GROUND_Y) {
          nextY = GROUND_Y - PLAYER_HEIGHT;
          vy = 0;
          nextOnGround = true;
          lastLandedPlatform.current = null; // Reset when landing on ground
        } else if (!landedOnPlatform) {
          nextOnGround = false;
        }

        if (nextX < 0) {
          nextX = 0;
          if (leftRoute && location.pathname !== leftRoute) {
            if (setSharedY) setSharedY(nextY);
            if (runAudioRef.current) {
              runAudioRef.current.pause();
              runAudioRef.current.currentTime = 0;
              runningRef.current = false;
            }
            setTimeout(() => navigate(leftRoute), 0);
          }
        }
        if (nextX + PLAYER_WIDTH > GAME_WIDTH) {
          nextX = GAME_WIDTH - PLAYER_WIDTH;
          if (rightRoute && location.pathname !== rightRoute) {
            if (setSharedY) setSharedY(nextY);
            if (runAudioRef.current) {
              runAudioRef.current.pause();
              runAudioRef.current.currentTime = 0;
              runningRef.current = false;
            }
            setTimeout(() => navigate(rightRoute), 0);
          }
        }
        let nextState = nextOnGround ? (vx !== 0 ? 'run' : 'idle') : 'jump';
        if (nextState !== animationState.current.lastState) {
          animationState.current.frame = 0;
          animationState.current.lastFrameTime = now;
          animationState.current.lastState = nextState;
        }
        const animationSpeed = ANIMATION_SPEEDS[nextState];
        const frameCount = nextState === 'run' ? SPRITE_RUN.length : nextState === 'jump' ? SPRITE_JUMP.length : SPRITE_IDLE.length;
        if (now - animationState.current.lastFrameTime >= animationSpeed) {
          animationState.current.frame = (animationState.current.frame + 1) % frameCount;
          animationState.current.lastFrameTime = now - (now - animationState.current.lastFrameTime - animationSpeed);
        }
        if (showText && !landedOnce.current && !prev.onGround && nextOnGround && nextY + PLAYER_HEIGHT >= GROUND_Y - 1) {
          landedOnce.current = true;
          setTimeout(() => setTextDrop(true), 400);
          console.log('Player landed, triggering text drop');
        }
        return {
          x: nextX,
          y: nextY,
          vx,
          vy,
          onGround: nextOnGround,
          facing,
          state: nextState,
          frame: animationState.current.frame,
        };
      });
      raf.current = requestAnimationFrame(loop);
    }
    raf.current = requestAnimationFrame(loop);
    console.log('Game loop started');
    return () => {
      cancelAnimationFrame(raf.current);
      console.log('Game loop stopped');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, leftRoute, rightRoute, location.pathname, showText, setSharedY, fallOnLoad, sharedY, keys, platforms, textY, textDrop]);

  const { width, height } = useWindowSize();
  const scale = Math.min(width / GAME_WIDTH, height / GAME_HEIGHT);
  const offsetY = (height - GAME_HEIGHT * scale) / 2;

  console.log('Rendering PlayerController', { playerX: player.x, playerY: player.y, textDrop, textY, scale, offsetY });

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: offsetY,
        width: '100vw',
        height: GAME_HEIGHT * scale,
        backgroundColor: 'rgba(0,0,0,0)',
        pointerEvents: 'none',
      }}
    >
      <Sprite
        x={player.x * scale}
        y={player.y * scale}
        facing={player.facing}
        state={player.state}
        frame={player.frame}
        scale={scale}
      />
      {showText && textDrop && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            width: '100%',
            top: -100 + textY * scale,
            textAlign: 'center',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          {textString.split('').map((char, index) => (
            <span
              key={`letter-${index}`}
              style={{
                position: 'relative',
                display: 'inline-block',
                fontSize: 50 * scale,
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
                letterSpacing: `${2 * scale}px`, // Normal letter spacing
                fontFamily: 'PixelGameFont, monospace',
                userSelect: 'none',
                opacity: textBlink ? 1 : 0,
                transform: `translateY(${letterBounces[index] ? letterBounces[index] * scale : 0}px)`,
                transition: 'transform 0.1s ease-in-out',
                minWidth: char === ' ' ? `${15 * scale}px` : 'auto', // Give spaces a minimum width (reduced)
              }}
            >
              {char === ' ' ? '\u00A0' : char} {/* Replace spaces with non-breaking spaces */}
            </span>
          ))}
        </div>
      )}
      {/*}
      {[...platforms, ...textPlatforms].map((platform, index) => (
        <div
          key={`platform-${index}`}
          style={{
            position: 'absolute',
            left: platform.x * scale,
            top: (platform.y + (platform.letter && letterBounces[platform.index] ? letterBounces[platform.index] : 0)) * scale + offsetY,
            width: platform.width * scale,
            height: platform.height * scale,
            border: platform.letter ? '2px solid green' : '2px solid red',
            backgroundColor: platform.letter ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        />
      ))}
        */}
    </div>
  );
}