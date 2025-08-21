import React from 'react';

const MusicContext = React.createContext({
  muted: false,
  toggleMute: () => {},
});

const SoundEffectsContext = React.createContext({
  muted: false,
  toggleMute: () => {},
});

export default MusicContext;
export { SoundEffectsContext };
