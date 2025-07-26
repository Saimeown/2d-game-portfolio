import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sprite } from './Sprite.jsx';

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

export function PlayerController({ leftRoute, rightRoute, showText }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [player, setPlayer] = useState({
    x: location.pathname === rightRoute ? GAME_WIDTH - PLAYER_WIDTH : GAME_WIDTH / 2 - PLAYER_WIDTH / 2,
    y: -PLAYER_HEIGHT,
    vx: 0,
    vy: 0,
    onGround: false,
    facing: 'right',
    state: 'idle',
    frame: 0,
  });
  const [textDrop, setTextDrop] = useState(false);
  const [textY, setTextY] = useState(-80);
  const keys = useRef({});
  const jumpPressed = useRef(false);
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
        }
      }
    };
    const handleUp = (e) => {
      keys.current[e.key] = false;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') {
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
        if (keys.current['ArrowLeft'] || keys.current['a']) {
          vx = -MOVE_SPEED;
          facing = 'left';
        } else if (keys.current['ArrowRight'] || keys.current['d']) {
          vx = MOVE_SPEED;
          facing = 'right';
        } else {
          vx = 0;
        }
        let nextOnGround = onGround;
        if ((keys.current['ArrowUp'] || keys.current['w'] || keys.current[' ']) && onGround && jumpPressed.current) {
          vy = JUMP_VELOCITY;
          nextOnGround = false;
        }
        vy += GRAVITY;
        let nextX = x + vx;
        let nextY = y + vy;
        if (nextY + PLAYER_HEIGHT >= GROUND_Y) {
          nextY = GROUND_Y - PLAYER_HEIGHT;
          vy = 0;
          nextOnGround = true;
        } else {
          nextOnGround = false;
        }
        // Navigation logic
        if (nextX < 0) {
          nextX = 0;
          if (leftRoute && location.pathname !== leftRoute) {
            setTimeout(() => navigate(leftRoute), 0);
          }
        }
        if (nextX + PLAYER_WIDTH > GAME_WIDTH) {
          nextX = GAME_WIDTH - PLAYER_WIDTH;
          if (rightRoute && location.pathname !== rightRoute) {
            setTimeout(() => navigate(rightRoute), 0);
          }
        }
        let nextState = nextOnGround ? (vx !== 0 ? 'run' : 'idle') : 'jump';
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
          state: nextOnGround ? (vx !== 0 ? 'run' : 'idle') : 'jump',
          frame: animationState.current.frame,
        };
      });
      raf.current = requestAnimationFrame(loop);
    }
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [navigate, leftRoute, rightRoute, location.pathname, showText]);

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
  const offsetX = (width - GAME_WIDTH * scale) / 2;
  const offsetY = (height - GAME_HEIGHT * scale) / 2;

  return (
    <div
      style={{
        position: 'absolute',
        left: offsetX,
        top: offsetY,
        width: GAME_WIDTH * scale,
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
            top: textY * scale,
            textAlign: 'center',
            fontSize: 32 * scale,
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
          {textDrop && "Walk right :)"}
        </div>
      )}
    </div>
  );
}
