import React from 'react';

export function Header({ muted, toggleMute, player, jumpPressed, textDrop, landedOnce }) {
  return (
    <>
      {/* Mute/unmute button */}
      <button
        onClick={toggleMute}
        style={{
          position: 'absolute',
          top: 18,
          right: 18,
          zIndex: 100,
          background: 'rgba(0,0,0,0.6)',
          border: 'none',
          borderRadius: '50%',
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#fff',
          fontSize: 22,
          pointerEvents: 'auto',
        }}
        aria-label={muted ? 'Unmute music' : 'Mute music'}
      >
        {muted ? (
          // Muted icon (simple SVG)
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M4 8v6h4l5 5V3l-5 5H4z" fill="currentColor" opacity="0.5"/>
            <line x1="16" y1="6" x2="21" y2="16" stroke="currentColor" strokeWidth="2"/>
            <line x1="21" y1="6" x2="16" y2="16" stroke="currentColor" strokeWidth="2"/>
          </svg>
        ) : (
          // Sound icon (simple SVG)
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M4 8v6h4l5 5V3l-5 5H4z" fill="currentColor"/>
            <path d="M17 7a6 6 0 010 8" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M19 5a9 9 0 010 12" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
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
