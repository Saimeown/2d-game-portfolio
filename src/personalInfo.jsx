import React from 'react';

export default function PersonalInfo() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'PixelGameFont, monospace',
        fontSize: 32,
        letterSpacing: 1,
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
      }}
    >
      <h1 style={{ marginBottom: 24 }}>Personal Info</h1>
      <p>Hello! This is the next page.</p>
      <p>Put your personal information or portfolio details here.</p>
    </div>
  );
}
