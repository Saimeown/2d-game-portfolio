import React, { useContext } from 'react';
import MusicContext, { SoundEffectsContext } from '../MusicContext.js';
import PlayerMovementContext from '../PlayerMovementContext.jsx';

export function Header({ player, jumpPressed, textDrop, landedOnce }) {
  const { muted, toggleMute } = useContext(MusicContext);
  const { muted: sfxMuted, toggleMute: toggleSfxMute } = useContext(SoundEffectsContext);
  const { isMoving } = useContext(PlayerMovementContext);
  return (
    <>
      {/* Music Mute/unmute button */}
      <button
        onClick={toggleMute}
        style={{
          position: 'absolute',
          top: 30,
          right: 60,
          zIndex: 100,
          background: 'rgba(255,255,255,1)',
          borderRadius: '50%',
          width: 60,
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#fff',
          fontSize: 22,
          pointerEvents: 'auto',
          border: '2px solid #000',
        }}
        aria-label={muted ? 'Unmute music' : 'Mute music'}
      >
        {muted ? (
          <img
            src="/assets/header/mute.png"
            alt="Muted"
            style={{ width: 40, height: 40, objectFit: 'contain' }}
            draggable={false}
          />
        ) : (
          <img
            src="/assets/header/unmute.png"
            alt="Unmuted"
            style={{ width: 40, height: 40, objectFit: 'contain' }}
            draggable={false}
          />
        )}
      </button>
      {/* SFX Mute/unmute button */}
      <button
        onClick={isMoving ? undefined : toggleSfxMute}
        disabled={isMoving}
        style={{
          position: 'absolute',
          top: 30,
          right: 140, // 70px to the left of the music mute button
          zIndex: 100,
          background: isMoving ? 'rgba(150,150,150,0.5)' : 'rgba(255,255,255,1)',
          borderRadius: '50%',
          width: 60,
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isMoving ? 'not-allowed' : 'pointer',
          color: '#fff',
          fontSize: 22,
          pointerEvents: 'auto',
          border: '2px solid #000',
          opacity: isMoving ? 0.5 : 1,
        }}
        aria-label={sfxMuted ? 'Unmute sound effects' : 'Mute sound effects'}
      >
        {sfxMuted ? (
          <img
            src="/assets/header/sfx-mute.png"
            alt="SFX Muted"
            style={{ width: 35, height: 35, objectFit: 'contain' }}
            draggable={false}
          />
        ) : (
          <img
            src="/assets/header/sfx-unmute.png"
            alt="SFX Unmuted"
            style={{ width: 35, height: 35, objectFit: 'contain' }}
            draggable={false}
          />
        )}
      </button>
      {/* State indicator */}
      {player && (
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
          {player.state === 'run' ? 5 : player.state === 'jump' ? 6 : 0} |
          JumpPressed: {jumpPressed?.toString()} | OnGround: {player.onGround?.toString()} |
          TextDrop: {textDrop?.toString()} | LandedOnce: {landedOnce?.toString()}
        </div>
      )}
    </>
  );
}
