import { createContext } from 'react';

const PlayerPositionContext = createContext({
  y: null,
  setY: () => {},
});

export default PlayerPositionContext;
