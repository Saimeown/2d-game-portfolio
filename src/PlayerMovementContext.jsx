import React, { createContext, useState } from 'react';

const PlayerMovementContext = createContext();

export function PlayerMovementProvider({ children }) {
  const [isMoving, setIsMoving] = useState(false);

  return (
    <PlayerMovementContext.Provider value={{ isMoving, setIsMoving }}>
      {children}
    </PlayerMovementContext.Provider>
  );
}

export default PlayerMovementContext;
