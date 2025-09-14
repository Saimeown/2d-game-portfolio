import React, { createContext, useState, useContext } from 'react';

const CoinContext = createContext();

export function CoinProvider({ children }) {
  const [coinCount, setCoinCount] = useState(0);
  const [touchedExclamation, setTouchedExclamation] = useState(false);

  const collectCoin = () => {
    setCoinCount(prev => prev + 1);
  };

  const touchExclamation = () => {
    setTouchedExclamation(true);
  };

  return (
    <CoinContext.Provider 
      value={{ 
        coinCount, 
        collectCoin, 
        touchedExclamation, 
        touchExclamation 
      }}
    >
      {children}
    </CoinContext.Provider>
  );
}

export function useCoin() {
  const context = useContext(CoinContext);
  if (!context) {
    throw new Error('useCoin must be used within a CoinProvider');
  }
  return context;
}

export default CoinContext;
