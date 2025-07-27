import React, { useRef, useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sprite } from './Sprite.jsx';
import PlayerPositionContext from '../PlayerPositionContext.js';

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
  idle: 200
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

export function PlayerController({ leftRoute, rightRoute, showText, fallOnLoad, startAtLeft }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { y: sharedY, setY: setSharedY } = useContext(PlayerPositionContext);

  // Track initial render for rightRoute
  const isInitialRender = useRef(!fallOnLoad && rightRoute && location.pathname === rightRoute);

  // --- CRITICAL: Set initialX to 0 for rightRoute (next page) ---
  let initialX;
  if (startAtLeft) {
    initialX = 0;
  } else if (!fallOnLoad && rightRoute && location.pathname === rightRoute) {
    initialX = 0; // Always start at left edge for next page
  } else if (!fallOnLoad && leftRoute && location.pathname === leftRoute) {
    initialX = GAME_WIDTH - PLAYER_WIDTH; // Start at right edge for previous page
  } else if (fallOnLoad && rightRoute && location.pathname === rightRoute) {
    initialX = GAME_WIDTH - PLAYER_WIDTH; // Start at right for fall on rightRoute
  } else if (fallOnLoad && leftRoute && location.pathname === leftRoute) {
    initialX = 0; // Start at left for fall on leftRoute
  } else {
    initialX = GAME_WIDTH / 2 - PLAYER_WIDTH / 2; // Default center
  }

  // --- CRITICAL: Fix initialY logic to only use sharedY if present and not falling ---
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
  // Use global key state to persist across page transitions
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
  const runningRef = useRef(false);

  useEffect(() => {
    jumpAudioRef.current = new Audio('/assets/jump-sfx.mp3');
    jumpAudioRef.current.volume = 0.7;
    runAudioRef.current = new Audio('/assets/run-sfx.mp3');
    runAudioRef.current.volume = 0.7;
    runAudioRef.current.loop = true;
  }, []);

  // Fix: Listen to both lower and upper case keys for WASD
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

  useEffect(() => {
    function loop(now) {
      setPlayer((prev) => {
        let { x, y, vx, vy, facing, onGround } = prev;
        let moving = false;
        // Fix: Use lower case for WASD keys
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
        // Play/stop run sound effect
        if (moving && prev.onGround) {
          if (!runningRef.current && runAudioRef.current) {
            runAudioRef.current.currentTime = 0;
            runAudioRef.current.play();
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
          // Play jump sound
          if (jumpAudioRef.current) {
            jumpAudioRef.current.currentTime = 0;
            jumpAudioRef.current.play();
          }
          // Stop run sound while in air
          if (runAudioRef.current) {
            runAudioRef.current.pause();
            runAudioRef.current.currentTime = 0;
            runningRef.current = false;
          }
        }
        vy += GRAVITY;
        let nextX = x + vx;

        // --- CRITICAL: Force sprite to left edge on initial render for rightRoute ---
        if (!fallOnLoad && rightRoute && location.pathname === rightRoute && isInitialRender.current) {
          nextX = 0; // Force to left edge
          isInitialRender.current = false; // Disable after first update
        }
        // Always clamp to left edge if on rightRoute and not falling
        if (!fallOnLoad && rightRoute && location.pathname === rightRoute) {
          nextX = 0;
        }

        let nextY = y + vy;
        // Platform collision detection only on main page
        let landedOnPlatform = false;
        
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
        // Navigation logic
        if (nextX < 0) {
          nextX = 0;
          if (leftRoute && location.pathname !== leftRoute) {
            // Save Y before navigating
            if (setSharedY) setSharedY(nextY);
            // Stop run SFX
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
            // Save Y before navigating
            if (setSharedY) setSharedY(nextY);
            // Stop run SFX
            if (runAudioRef.current) {
              runAudioRef.current.pause();
              runAudioRef.current.currentTime = 0;
              runningRef.current = false;
            }
            setTimeout(() => navigate(rightRoute), 0);
          }
        }
        let nextState = nextOnGround ? (vx !== 0 ? 'run' : 'idle') : 'jump';
        // Animation frame logic
        if (nextState !== animationState.current.lastState) {
          animationState.current.frame = 0;
          animationState.current.lastFrameTime = now;
          animationState.current.lastState = nextState;
        }
        // Update frames for all states, including idle
        const animationSpeed = ANIMATION_SPEEDS[nextState];
        const frameCount = nextState === 'run' ? SPRITE_RUN.length : nextState === 'jump' ? SPRITE_JUMP.length : SPRITE_IDLE.length;
        if (now - animationState.current.lastFrameTime >= animationSpeed) {
          animationState.current.frame = (animationState.current.frame + 1) % frameCount;
          animationState.current.lastFrameTime = now - (now - animationState.current.lastFrameTime - animationSpeed);
        }
        // Text drop logic (only on first landing, if showText)
        if (showText && !landedOnce.current && !prev.onGround && nextOnGround && nextY + PLAYER_HEIGHT >= GROUND_Y - 1) {
          landedOnce.current = true;
          setTimeout(() => setTextDrop(true), 400);
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
    return () => cancelAnimationFrame(raf.current);
  }, [navigate, leftRoute, rightRoute, location.pathname, showText, setSharedY, fallOnLoad, sharedY, keys]);

  // Animate text falling after sprite lands (if showText)
  const [textBlinkingActive, setTextBlinkingActive] = useState(false);
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
  }, [textDrop, showText]);

  // Blinking effect for falling text (only after fall is done)
  const [textBlink, setTextBlink] = useState(true);
  useEffect(() => {
    if (!showText || !textBlinkingActive) {
      setTextBlink(true);
      return;
    }
    setTextBlink(true);
    const interval = setInterval(() => {
      setTextBlink(b => !b);
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

  // Responsive scale and offset
  const { width, height } = useWindowSize();
  const scale = Math.min(width / GAME_WIDTH, height / GAME_HEIGHT);
  const offsetY = (height - GAME_HEIGHT * scale) / 2;

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
      {showText && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            width: '100%',
            top: -100 + textY * scale,
            textAlign: 'center',
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
            pointerEvents: 'none',
            transition: 'opacity 0.1s',
            zIndex: 10,
            letterSpacing: 1,
            fontFamily: 'PixelGameFont, monospace',
            userSelect: 'none',
            opacity: textBlink ? 1 : 0,
          }}
        >
          {textDrop && "START YOUR QUEST >>>"}
        </div>
      )}
    </div>
  );
}