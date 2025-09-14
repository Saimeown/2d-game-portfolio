import React, { createContext, useContext, useState } from 'react';

const CoinContext = createContext();

export function CoinProvider({ children }) {
  const [coinCount, setCoinCount] = useState(0);
  const [touchedExclamation, setTouchedExclamation] = useState(false);
  const [collectedCoins, setCollectedCoins] = useState(new Set());

  const collectCoin = (coinId = 'personalInfo-coin-1') => {
    if (!collectedCoins.has(coinId)) {
      setCoinCount(prev => prev + 1);
      setCollectedCoins(prev => new Set([...prev, coinId]));
    }
  };

  const touchExclamation = () => {
    setTouchedExclamation(true);
  };

  const isCoinCollected = (coinId) => {
    return collectedCoins.has(coinId);
  };

  return (
    <CoinContext.Provider 
      value={{ 
        coinCount, 
        collectCoin, 
        touchedExclamation, 
        touchExclamation,
        isCoinCollected,
        collectedCoins
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
