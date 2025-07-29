import React from 'react';

const MusicContext = React.createContext({
  muted: false,
  toggleMute: () => {},
});

// New context for sound effects mute state
const SoundEffectsContext = React.createContext({
  muted: false,
  toggleMute: () => {},
});

export default MusicContext;
export { SoundEffectsContext };
