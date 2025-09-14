import React, { useRef, useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sprite } from "./Sprite.jsx";
import PlayerPositionContext from "../PlayerPositionContext.js";
import PlayerMovementContext from "../PlayerMovementContext.jsx";
import { SoundEffectsContext } from "../MusicContext.js";
import { VIRTUAL_WIDTH, VIRTUAL_HEIGHT } from "../constants/gameConstants.js";

const SPRITE_IDLE = [
  "/assets/sprite/Idle/frame_1.png",
  "/assets/sprite/Idle/frame_2.png",
  "/assets/sprite/Idle/frame_3.png",
  "/assets/sprite/Idle/frame_4.png",
];
const SPRITE_RUN = [
  "/assets/sprite/Jump/frame_8.png",
  "/assets/sprite/Run/frame_2.png",
  "/assets/sprite/Run/frame_3.png",
  "/assets/sprite/Run/frame_4.png",
  "/assets/sprite/Run/frame_5.png",
  "/assets/sprite/Run/frame_6.png",
];
const SPRITE_JUMP = [
  "/assets/sprite/Jump/frame_1.png",
  "/assets/sprite/Jump/frame_2.png",
  "/assets/sprite/Jump/frame_3.png",
  "/assets/sprite/Jump/frame_4.png",
  "/assets/sprite/Jump/frame_6.png",
  "/assets/sprite/Jump/frame_7.png",
  "/assets/sprite/Jump/frame_8.png",
];

const GAME_WIDTH = VIRTUAL_WIDTH;
const GAME_HEIGHT = VIRTUAL_HEIGHT;
const GROUND_Y = 800;
const GRAVITY = 0.8;
const JUMP_VELOCITY = -17;
const MOVE_SPEED = 4;
const PLAYER_WIDTH = 80;
const PLAYER_HEIGHT = 80;

const ANIMATION_SPEEDS = {
  run: 120,
  jump: 100,
  idle: 200,
};

export function PlayerController({
  leftRoute,
  rightRoute,
  showText,
  fallOnLoad,
  startAtLeft,
  platforms = [],
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { y: sharedY, setY: setSharedY } = useContext(PlayerPositionContext);
  const { setIsMoving } = useContext(PlayerMovementContext);
  const { muted: sfxMuted } = useContext(SoundEffectsContext);

  const isInitialRender = useRef(
    !fallOnLoad && rightRoute && location.pathname === rightRoute
  );
  const lastLandedPlatform = useRef(null); 

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
    initialX = GAME_WIDTH / 2 - PLAYER_WIDTH / 2; 
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
    facing:
      !fallOnLoad && rightRoute && location.pathname === rightRoute
        ? "right"
        : "left",
    state: "idle",
    frame: 0,
  });
  const [textDrop, setTextDrop] = useState(false);
  const [textY, setTextY] = useState(-200);
  const [letterBounces, setLetterBounces] = useState({});
  const [textBlinkingActive, setTextBlinkingActive] = useState(false);
  const [textBlink, setTextBlink] = useState(true);
  const [showDots, setShowDots] = useState(false);
  const [dots, setDots] = useState("");

  if (!window.__PLAYER_KEYS__) window.__PLAYER_KEYS__ = {};
  const keys = React.useMemo(() => ({ current: window.__PLAYER_KEYS__ }), []);
  const jumpPressed = useRef(false);
  const raf = useRef();
  const animationState = useRef({
    frame: 0,
    lastFrameTime: performance.now(),
    lastState: "idle",
  });
  const landedOnce = useRef(false);
  const jumpAudioRef = useRef(null);
  const runAudioRef = useRef(null);
  const bumpAudioRef = useRef(null);
  const runningRef = useRef(false);

  useEffect(() => {
    jumpAudioRef.current = new Audio("/assets/jump-sfx.mp3");
    jumpAudioRef.current.volume = 0.7;
    runAudioRef.current = new Audio("/assets/run-sfx.mp3");
    runAudioRef.current.volume = 0.7;
    runAudioRef.current.loop = true;
    bumpAudioRef.current = new Audio("/public/assets/bump-sfx.wav");
    bumpAudioRef.current.volume = 0.8;
  }, []);

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
        if (key === "arrowup" || key === "w" || key === " ") {
          jumpPressed.current = true;
        }
      }
    };
    const handleUp = (e) => {
      const key = e.key.toLowerCase();
      window.__PLAYER_KEYS__[key] = false;
      if (key === "arrowup" || key === "w" || key === " ") {
        jumpPressed.current = false;
      }
    };
    window.addEventListener("keydown", handleDown);
    window.addEventListener("keyup", handleUp);
    return () => {
      window.removeEventListener("keydown", handleDown);
      window.removeEventListener("keyup", handleUp);
    };
  }, []);

  const textString = "TO THE NEXT SCENE >>>";
  const fontSize = 120;
  const letterSpacing = 5;
  const spaceWidth = fontSize * 0.3;
  const letterWidth = fontSize * 0.4;

  let currentX = 0;
  const charPositions = textString.split("").map((char, index) => {
    const width = char === " " ? spaceWidth : letterWidth;
    const x = currentX + 10;
    currentX += width + letterSpacing;
    return { char, x, width, index };
  });

  const totalTextWidth = currentX - letterSpacing;
  const textXStart = (GAME_WIDTH - totalTextWidth) / 2;

  const textPlatforms = textDrop
    ? charPositions
        .filter((charData) => charData.char !== " ")
        .map((charData) => ({
          x: textXStart + charData.x,
          y: textY - 50,
          width: charData.width,
          height: fontSize * 0.8,
          letter: charData.char,
          index: charData.index,
        }))
    : [];

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
      setTextY(-200);
      setTextBlinkingActive(false);
      return;
    }
    let running = true;
    let vy = 0;
    let y = -200;
    const targetY = GAME_HEIGHT / 2 - 100;
    function animate() {
      vy += 0.4;
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

  useEffect(() => {
    if (!showDots) return;

    let dotCount = 0;
    const interval = setInterval(() => {
      dotCount = (dotCount + 1) % 4;
      setDots(".".repeat(dotCount));
    }, 500);

    return () => clearInterval(interval);
  }, [showDots]);

  useEffect(() => {
    if (!showText || !textBlinkingActive) {
      setTextBlink(true);
      setShowDots(false);
      return;
    }
    setTextBlink(true);
    const interval = setInterval(() => {
      setTextBlink((b) => !b);
    }, 180);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setTextBlink(true);
      setShowDots(true); 
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
        if (keys.current["arrowleft"] || keys.current["a"]) {
          vx = -MOVE_SPEED;
          facing = "left";
          moving = true;
        } else if (keys.current["arrowright"] || keys.current["d"]) {
          vx = MOVE_SPEED;
          facing = "right";
          moving = true;
        } else {
          vx = 0;
        }

        setIsMoving(moving && prev.onGround);
        if (moving && prev.onGround) {
          if (!runningRef.current && runAudioRef.current && !sfxMuted) {
            runAudioRef.current.currentTime = 0;
            runAudioRef.current
              .play()
              .catch((e) => console.error("Run audio error:", e));
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
        if (
          (keys.current["arrowup"] || keys.current["w"] || keys.current[" "]) &&
          onGround &&
          jumpPressed.current
        ) {
          vy = JUMP_VELOCITY;
          nextOnGround = false;
          if (jumpAudioRef.current && !sfxMuted) {
            jumpAudioRef.current.currentTime = 0;
            jumpAudioRef.current
              .play()
              .catch((e) => console.error("Jump audio error:", e));
          }
          if (runAudioRef.current) {
            runAudioRef.current.pause();
            runAudioRef.current.currentTime = 0;
            runningRef.current = false;
          }
        }
        vy += GRAVITY;
        let nextX = x + vx;
        if (
          !fallOnLoad &&
          rightRoute &&
          location.pathname === rightRoute &&
          isInitialRender.current
        ) {
          nextX = 0;
          isInitialRender.current = false;
        }
        if (!fallOnLoad && rightRoute && location.pathname === rightRoute) {
          nextX = 0;
        }
        let nextY = y + vy;

        const allPlatforms = [...platforms, ...textPlatforms];

        let landedOnPlatform = false;
        let currentLandedPlatform = null;
        let currentlyStandingOnLetters = new Set();

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

            if (
              playerRight > platformLeft &&
              playerLeft < platformRight &&
              playerTop <= platformTop &&
              playerBottom >= platformTop &&
              playerBottom <= platformBottom + 20
            ) {
              nextY = platformTop - PLAYER_HEIGHT;
              vy = 0;
              landedOnPlatform = true;
              nextOnGround = true;
              if (
                platform.letter &&
                lastLandedPlatform.current !== platform.index
              ) {
                setLetterBounces((prev) => ({ ...prev, [platform.index]: 25 }));
                lastLandedPlatform.current = platform.index;
                if (bumpAudioRef.current && !sfxMuted) {
                  bumpAudioRef.current.currentTime = 0;
                  bumpAudioRef.current
                    .play()
                    .catch((e) => console.error("Bump audio error:", e));
                }
              }
              currentLandedPlatform = platform.index;
              if (platform.letter) {
                currentlyStandingOnLetters.add(platform.index);
              }
              break;
            }
          }
        }

        if (vy < 0) {
          for (const platform of allPlatforms) {
            if (platform.letter) continue;

            const playerLeft = nextX;
            const playerRight = nextX + PLAYER_WIDTH;
            const playerBottom = nextY + PLAYER_HEIGHT;
            const playerTop = nextY;
            const platformLeft = platform.x;
            const platformRight = platform.x + platform.width;
            const platformTop = platform.y;
            const platformBottom = platform.y + platform.height;

            if (
              playerRight > platformLeft &&
              playerLeft < platformRight &&
              playerTop <= platformBottom &&
              playerBottom >= platformBottom &&
              playerTop >= platformTop
            ) {
              nextY = platformBottom;
              vy = 0;
              break;
            }
          }
        }

        for (const platform of allPlatforms) {
          if (platform.letter) continue;

          const playerLeft = nextX;
          const playerRight = nextX + PLAYER_WIDTH;
          const playerBottom = nextY + PLAYER_HEIGHT;
          const playerTop = nextY;
          const platformLeft = platform.x;
          const platformRight = platform.x + platform.width;
          const platformTop = platform.y;
          const platformBottom = platform.y + platform.height;

          if (
            playerRight > platformLeft &&
            playerLeft < platformRight &&
            playerBottom > platformTop &&
            playerTop < platformBottom
          ) {
            const leftOverlap = playerRight - platformLeft;
            const rightOverlap = platformRight - playerLeft;
            const topOverlap = playerBottom - platformTop;
            const bottomOverlap = platformBottom - playerTop;

            const overlaps = [
              { side: "left", value: leftOverlap },
              { side: "right", value: rightOverlap },
              { side: "top", value: topOverlap },
              { side: "bottom", value: bottomOverlap },
            ];

            const smallestOverlap = overlaps.reduce((min, current) =>
              current.value < min.value ? current : min
            );

            if (smallestOverlap.side === "left") {
              nextX = platformLeft - PLAYER_WIDTH;
            } else if (smallestOverlap.side === "right") {
              nextX = platformRight;
            } else if (smallestOverlap.side === "top") {
              nextY = platformTop - PLAYER_HEIGHT;
              vy = 0;
            } else if (smallestOverlap.side === "bottom") {
              nextY = platformBottom;
              vy = 0;
            }
          }
        }

        for (const platform of textPlatforms) {
          const playerLeft = nextX;
          const playerRight = nextX + PLAYER_WIDTH;
          const playerBottom = nextY + PLAYER_HEIGHT;
          const platformLeft = platform.x;
          const platformRight = platform.x + platform.width;
          const platformTop = platform.y;
          const platformBottom = platform.y + platform.height;

          if (
            playerRight > platformLeft &&
            playerLeft < platformRight &&
            playerBottom >= platformTop &&
            playerBottom <= platformBottom + 5
          ) {
            currentlyStandingOnLetters.add(platform.index);
          }
        }

        setLetterBounces((prev) => {
          const newBounces = { ...prev };
          Object.keys(newBounces).forEach((index) => {
            const indexNum = parseInt(index);
            if (
              !currentlyStandingOnLetters.has(indexNum) &&
              newBounces[index] > 0
            ) {
              newBounces[index] = 0;
            }
          });
          return newBounces;
        });

        if (!landedOnPlatform) {
          lastLandedPlatform.current = null;
        } else if (currentLandedPlatform !== lastLandedPlatform.current) {
          lastLandedPlatform.current = currentLandedPlatform;
        }

        if (!landedOnPlatform && nextY + PLAYER_HEIGHT >= GROUND_Y) {
          nextY = GROUND_Y - PLAYER_HEIGHT;
          vy = 0;
          nextOnGround = true;
          lastLandedPlatform.current = null;
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
        let nextState = nextOnGround ? (vx !== 0 ? "run" : "idle") : "jump";
        if (nextState !== animationState.current.lastState) {
          animationState.current.frame = 0;
          animationState.current.lastFrameTime = now;
          animationState.current.lastState = nextState;
        }
        const animationSpeed = ANIMATION_SPEEDS[nextState];
        const frameCount =
          nextState === "run"
            ? SPRITE_RUN.length
            : nextState === "jump"
            ? SPRITE_JUMP.length
            : SPRITE_IDLE.length;
        if (now - animationState.current.lastFrameTime >= animationSpeed) {
          animationState.current.frame =
            (animationState.current.frame + 1) % frameCount;
          animationState.current.lastFrameTime =
            now - (now - animationState.current.lastFrameTime - animationSpeed);
        }
        if (
          showText &&
          !landedOnce.current &&
          !prev.onGround &&
          nextOnGround &&
          nextY + PLAYER_HEIGHT >= GROUND_Y - 2
        ) {
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
    return () => {
      cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    navigate,
    leftRoute,
    rightRoute,
    location.pathname,
    showText,
    setSharedY,
    fallOnLoad,
    sharedY,
    keys,
    platforms,
    textY,
    textDrop,
    setIsMoving,
    sfxMuted,
  ]);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        pointerEvents: "none",
      }}
    >
      <Sprite
        x={player.x}
        y={player.y}
        facing={player.facing}
        state={player.state}
        frame={player.frame}
      />

      {showText && textDrop && (
        <>
          <div
            style={{
              position: "absolute",
              left: 0,
              width: GAME_WIDTH,
              top: textY - 100,
              textAlign: "center",
              pointerEvents: "none",
              zIndex: 10,
            }}
          >
            {textString.split("").map((char, index) => (
              <span
                key={`letter-${index}`}
                style={{
                  position: "relative",
                  display: "inline-block",
                  fontSize: fontSize,
                  fontWeight: "normal",
                  color: "#fff",
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
                  letterSpacing: `${letterSpacing}px`,
                  fontFamily: "PixelGameFont, monospace",
                  userSelect: "none",
                  opacity: textBlink ? 1 : 0,
                  transform: `translateY(${
                    letterBounces[index] ? letterBounces[index] : 0
                  }px)`,
                  transition: "transform 0.1s ease-in-out",
                  minWidth: char === " " ? `${30}px` : "auto",
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </div>

          <div
            style={{
              position: "absolute",
              left: 0,
              width: GAME_WIDTH,
              top: textY + 50,
              textAlign: "center",
              pointerEvents: "none",
              zIndex: 10,
            }}
          >
            <span
              style={{
                fontSize: 50,
                fontWeight: "normal",
                color: "#fff",
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
                fontFamily: "PixelGameFont, monospace",
                userSelect: "none",
                opacity: textBlink ? 1 : 0,
              }}
            >
              [ Explore me ]
            </span>
          </div>
        </>
      )}

      {showText && textDrop && showDots && (
        <div
          style={{
            position: "absolute",
            left: 0,
            width: GAME_WIDTH,
            top: textY + 40,
            textAlign: "center",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          <span
            style={{
              fontSize: 120,
              fontWeight: "normal",
              color: "#fff",
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
              fontFamily: "PixelGameFont, monospace",
              userSelect: "none",
            }}
          >
            {dots}
          </span>
        </div>
      )}
    </div>
  );
}
