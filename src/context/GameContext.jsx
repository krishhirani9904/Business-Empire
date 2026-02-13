// src/context/GameContext.jsx
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { MERGER_OPTIONS } from '../components/business/businessData';
import { STOCKS, CRYPTOCURRENCIES } from '../components/investing/investingData';

const GameContext = createContext();

const STORAGE_KEY = 'business_samrajya_save';

const getStoredData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);

      // Basic validation
      if (typeof parsed.balance !== 'number' || isNaN(parsed.balance)) {
        parsed.balance = 0;
      }

      if (parsed.lastSaved && parsed.ownedBusinesses?.length > 0) {
        const now = Date.now();
        const elapsed = now - parsed.lastSaved;
        const hoursElapsed = elapsed / (1000 * 60 * 60);

        if (hoursElapsed > 0) {
          let totalIncomePerHour = parsed.ownedBusinesses.reduce(
            (sum, b) => sum + (b.incomePerHour || 0), 0
          );

          if (parsed.mergedBusinesses) {
            let mergerBonus = 0;
            parsed.mergedBusinesses.forEach(mergerId => {
              const merger = MERGER_OPTIONS.find(m => m.id === mergerId);
              if (merger) mergerBonus += merger.bonus;
            });
            totalIncomePerHour = totalIncomePerHour * (1 + mergerBonus / 100);
          }

          // Add rental income
          if (parsed.ownedProperties) {
            parsed.ownedProperties.forEach(prop => {
              let rental = prop.rentalIncomePerHour || 0;
              if (prop.improvements) {
                prop.improvements.forEach(imp => {
                  rental += imp.bonusIncome || 0;
                });
              }
              totalIncomePerHour += rental;
            });
          }

          // FIXED: Add dividend income offline
          if (parsed.ownedStocks && parsed.stockPriceHistory) {
            parsed.ownedStocks.forEach(owned => {
              const stock = STOCKS.find(s => s.id === owned.stockId);
              if (stock) {
                const price = parsed.stockPriceHistory[stock.id] || stock.price;
                const annualDividend = price * owned.quantity * (stock.dividendYield / 100);
                totalIncomePerHour += annualDividend / 8760;
              }
            });
          }

          const offlineEarnings = Math.floor(totalIncomePerHour * hoursElapsed);
          parsed.balance = (parsed.balance || 0) + offlineEarnings;
          parsed.offlineEarnings = offlineEarnings;
        }
      }
      return parsed;
    }
  } catch (e) {
    console.error('Error reading localStorage:', e);
  }
  return null;
};

const defaultState = {
  balance: 1000000000000,
  level: 1,
  baseClickRate: 1,
  upgradeCost: 100,
  ownedBusinesses: [],
  mergedBusinesses: [],
  totalClicks: 0,
  offlineEarnings: 0,
  ownedStocks: [],
  ownedProperties: [],
  ownedCrypto: [],
  stockPriceHistory: {},
  cryptoPriceHistory: {}
};

export function GameProvider({ children }) {
  const [gameState, setGameState] = useState(() => {
    const stored = getStoredData();
    return { ...defaultState, ...stored };
  });

  const [isBoostActive, setIsBoostActive] = useState(false);
  const incomeTimerRef = useRef(null);
  const priceTimerRef = useRef(null);
  const incomeCalcRef = useRef(null);

  const {
    balance,
    level,
    baseClickRate,
    upgradeCost,
    ownedBusinesses,
    mergedBusinesses,
    totalClicks,
    offlineEarnings,
    ownedStocks,
    ownedProperties,
    ownedCrypto,
    stockPriceHistory,
    cryptoPriceHistory
  } = gameState;

  // Save to localStorage
  useEffect(() => {
    try {
      const dataToSave = { ...gameState, lastSaved: Date.now() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }, [gameState]);

  // Initialize prices and simulate fluctuations
  useEffect(() => {
    setGameState(prev => {
      const newStockPrices = { ...prev.stockPriceHistory };
      const newCryptoPrices = { ...prev.cryptoPriceHistory };
      let changed = false;

      STOCKS.forEach(s => {
        if (!newStockPrices[s.id]) {
          newStockPrices[s.id] = s.price;
          changed = true;
        }
      });
      CRYPTOCURRENCIES.forEach(c => {
        if (!newCryptoPrices[c.id]) {
          newCryptoPrices[c.id] = c.price;
          changed = true;
        }
      });

      if (changed) {
        return {
          ...prev,
          stockPriceHistory: newStockPrices,
          cryptoPriceHistory: newCryptoPrices
        };
      }
      return prev;
    });

    // FIXED: Mean-reverting price simulation (no infinite inflation)
    priceTimerRef.current = setInterval(() => {
      setGameState(prev => {
        const newStockPrices = { ...prev.stockPriceHistory };
        const newCryptoPrices = { ...prev.cryptoPriceHistory };

        STOCKS.forEach(s => {
          const current = newStockPrices[s.id] || s.price;
          const meanReversion = (s.price - current) * 0.02;
          const randomChange = (Math.random() - 0.5) * (s.volatility / 50) * current;
          const newPrice = current + meanReversion + randomChange;
          newStockPrices[s.id] = Math.max(
            s.price * 0.3,
            Math.min(s.price * 3, Math.round(newPrice))
          );
        });

        CRYPTOCURRENCIES.forEach(c => {
          const current = newCryptoPrices[c.id] || c.price;
          const meanReversion = (c.price - current) * 0.015;
          const randomChange = (Math.random() - 0.5) * (c.volatility / 40) * current;
          const newPrice = current + meanReversion + randomChange;
          const bounded = Math.max(c.price * 0.1, Math.min(c.price * 5, newPrice));
          newCryptoPrices[c.id] = c.price < 1
            ? Math.round(bounded * 10000) / 10000
            : Math.round(bounded);
        });

        return {
          ...prev,
          stockPriceHistory: newStockPrices,
          cryptoPriceHistory: newCryptoPrices
        };
      });
    }, 30000);

    return () => {
      if (priceTimerRef.current) clearInterval(priceTimerRef.current);
    };
  }, []);

  // FIXED: Separate income calculation from price history to avoid timer restart
  const calculateTotalIncome = useCallback(() => {
    let total = ownedBusinesses.reduce(
      (sum, owned) => sum + (owned.incomePerHour || 0),
      0
    );

    // FIXED: Additive merger bonuses instead of multiplicative
    let mergerBonus = 0;
    mergedBusinesses.forEach(mergerId => {
      const merger = MERGER_OPTIONS.find(m => m.id === mergerId);
      if (merger) mergerBonus += merger.bonus;
    });
    total = total * (1 + mergerBonus / 100);

    ownedProperties.forEach(prop => {
      let rental = prop.rentalIncomePerHour || 0;
      if (prop.improvements) {
        prop.improvements.forEach(imp => {
          rental += imp.bonusIncome || 0;
        });
      }
      total += rental;
    });

    ownedStocks.forEach(owned => {
      const stock = STOCKS.find(s => s.id === owned.stockId);
      if (stock) {
        const currentPrice = stockPriceHistory[stock.id] || stock.price;
        const annualDividend = currentPrice * owned.quantity * (stock.dividendYield / 100);
        total += annualDividend / 8760;
      }
    });

    if (isBoostActive) {
      total = total * 2;
    }

    return Math.floor(total);
  }, [ownedBusinesses, mergedBusinesses, ownedProperties, ownedStocks, stockPriceHistory, isBoostActive]);

  // FIXED: Store income value in ref so timer doesn't restart on price changes
  useEffect(() => {
    incomeCalcRef.current = calculateTotalIncome;
  }, [calculateTotalIncome]);

  // FIXED: Income timer runs independently, reads from ref
  useEffect(() => {
    if (incomeTimerRef.current) clearInterval(incomeTimerRef.current);

    incomeTimerRef.current = setInterval(() => {
      const totalIncome = incomeCalcRef.current ? incomeCalcRef.current() : 0;
      if (totalIncome > 0) {
        const incomePerMinute = Math.max(1, Math.floor(totalIncome / 60));
        setGameState(prev => ({
          ...prev,
          balance: prev.balance + incomePerMinute
        }));
      }
    }, 60000);

    return () => {
      if (incomeTimerRef.current) clearInterval(incomeTimerRef.current);
    };
  }, []);

  const currentPerClick = isBoostActive ? baseClickRate * 2 : baseClickRate;

  const handleTap = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      balance: prev.balance + (isBoostActive ? prev.baseClickRate * 2 : prev.baseClickRate),
      totalClicks: prev.totalClicks + 1
    }));
  }, [isBoostActive]);

  const handleUpgrade = useCallback(() => {
    setGameState(prev => {
      if (prev.balance < prev.upgradeCost) return prev;
      return {
        ...prev,
        balance: prev.balance - prev.upgradeCost,
        level: prev.level + 1,
        baseClickRate: prev.baseClickRate + 2,
        upgradeCost: Math.floor(prev.upgradeCost * 2.5)
      };
    });
  }, []);

  const handleBuyBusiness = useCallback((business, size) => {
    setGameState(prev => {
      if (prev.balance < size.cost) return prev;
      return {
        ...prev,
        balance: prev.balance - size.cost,
        ownedBusinesses: [...prev.ownedBusinesses, {
          id: Date.now(),
          businessId: business.id,
          businessName: business.name,
          sizeType: size.type,
          incomePerHour: size.incomePerHour,
          purchasedAt: new Date().toISOString()
        }]
      };
    });
  }, []);

  const handleMerge = useCallback((merger) => {
    setGameState(prev => {
      if (prev.mergedBusinesses.includes(merger.id)) return prev;
      const canMerge = merger.requirements.every(req => {
        const count = prev.ownedBusinesses.filter(
          o => o.businessId === req.businessId
        ).length;
        return count >= req.minCount;
      });
      if (!canMerge) return prev;
      return {
        ...prev,
        mergedBusinesses: [...prev.mergedBusinesses, merger.id]
      };
    });
  }, []);

  const addBonus = useCallback((amount) => {
    setGameState(prev => ({
      ...prev,
      balance: prev.balance + amount
    }));
  }, []);

  const handleBoostChange = useCallback((status) => {
    setIsBoostActive(status);
  }, []);

  const getOwnedCount = useCallback((businessId) => {
    return ownedBusinesses.filter(o => o.businessId === businessId).length;
  }, [ownedBusinesses]);

  const clearOfflineEarnings = useCallback(() => {
    setGameState(prev => ({ ...prev, offlineEarnings: 0 }));
  }, []);

  // Buy Stock
  const buyStock = useCallback((stockId, quantity, pricePerUnit) => {
    const totalCost = quantity * pricePerUnit;
    setGameState(prev => {
      if (prev.balance < totalCost) return prev;

      const existingIndex = prev.ownedStocks.findIndex(s => s.stockId === stockId);
      let newOwnedStocks;

      if (existingIndex >= 0) {
        newOwnedStocks = [...prev.ownedStocks];
        const existing = newOwnedStocks[existingIndex];
        const totalQty = existing.quantity + quantity;
        const totalValue = (existing.avgBuyPrice * existing.quantity) + (pricePerUnit * quantity);
        newOwnedStocks[existingIndex] = {
          ...existing,
          quantity: totalQty,
          avgBuyPrice: Math.round(totalValue / totalQty)
        };
      } else {
        newOwnedStocks = [...prev.ownedStocks, {
          stockId,
          quantity,
          avgBuyPrice: pricePerUnit,
          purchasedAt: new Date().toISOString()
        }];
      }

      return {
        ...prev,
        balance: prev.balance - totalCost,
        ownedStocks: newOwnedStocks
      };
    });
  }, []);

  // Sell Stock
  const sellStock = useCallback((stockId, quantity, pricePerUnit) => {
    setGameState(prev => {
      const existingIndex = prev.ownedStocks.findIndex(s => s.stockId === stockId);
      if (existingIndex < 0) return prev;

      const existing = prev.ownedStocks[existingIndex];
      if (existing.quantity < quantity) return prev;

      const totalRevenue = quantity * pricePerUnit;
      let newOwnedStocks = [...prev.ownedStocks];

      if (existing.quantity === quantity) {
        newOwnedStocks.splice(existingIndex, 1);
      } else {
        newOwnedStocks[existingIndex] = {
          ...existing,
          quantity: existing.quantity - quantity
        };
      }

      return {
        ...prev,
        balance: prev.balance + totalRevenue,
        ownedStocks: newOwnedStocks
      };
    });
  }, []);

  // Buy Property
  const buyProperty = useCallback((property) => {
    setGameState(prev => {
      if (prev.balance < property.price) return prev;
      return {
        ...prev,
        balance: prev.balance - property.price,
        ownedProperties: [...prev.ownedProperties, {
          ...property,
          ownId: Date.now(),
          improvements: [],
          purchasedAt: new Date().toISOString()
        }]
      };
    });
  }, []);

  // FIXED: Sell Property (NEW)
  const sellProperty = useCallback((ownId) => {
    setGameState(prev => {
      const propIndex = prev.ownedProperties.findIndex(p => p.ownId === ownId);
      if (propIndex < 0) return prev;

      const prop = prev.ownedProperties[propIndex];
      // Sell at 70% of purchase price + 50% of improvement costs
      let sellPrice = prop.price * 0.7;
      if (prop.improvements) {
        prop.improvements.forEach(imp => {
          sellPrice += imp.cost * 0.5;
        });
      }
      sellPrice = Math.floor(sellPrice);

      const newProps = [...prev.ownedProperties];
      newProps.splice(propIndex, 1);

      return {
        ...prev,
        balance: prev.balance + sellPrice,
        ownedProperties: newProps
      };
    });
  }, []);

  // Improve Property
  const improveProperty = useCallback((ownId, improvement) => {
    setGameState(prev => {
      const propIndex = prev.ownedProperties.findIndex(p => p.ownId === ownId);
      if (propIndex < 0) return prev;

      const prop = prev.ownedProperties[propIndex];
      if (prev.balance < improvement.cost) return prev;
      if (prop.improvements.find(i => i.id === improvement.id)) return prev;

      const newProps = [...prev.ownedProperties];
      newProps[propIndex] = {
        ...prop,
        improvements: [...prop.improvements, improvement]
      };

      return {
        ...prev,
        balance: prev.balance - improvement.cost,
        ownedProperties: newProps
      };
    });
  }, []);

  // Buy Crypto
  const buyCrypto = useCallback((cryptoId, quantity, pricePerUnit) => {
    const totalCost = quantity * pricePerUnit;
    setGameState(prev => {
      if (prev.balance < totalCost) return prev;

      const existingIndex = prev.ownedCrypto.findIndex(c => c.cryptoId === cryptoId);
      let newOwnedCrypto;

      if (existingIndex >= 0) {
        newOwnedCrypto = [...prev.ownedCrypto];
        const existing = newOwnedCrypto[existingIndex];
        const totalQty = existing.quantity + quantity;
        const totalValue = (existing.avgBuyPrice * existing.quantity) + (pricePerUnit * quantity);
        newOwnedCrypto[existingIndex] = {
          ...existing,
          quantity: totalQty,
          avgBuyPrice: totalValue / totalQty
        };
      } else {
        newOwnedCrypto = [...prev.ownedCrypto, {
          cryptoId,
          quantity,
          avgBuyPrice: pricePerUnit,
          purchasedAt: new Date().toISOString()
        }];
      }

      return {
        ...prev,
        balance: prev.balance - totalCost,
        ownedCrypto: newOwnedCrypto
      };
    });
  }, []);

  // Sell Crypto
  const sellCrypto = useCallback((cryptoId, quantity, pricePerUnit) => {
    setGameState(prev => {
      const existingIndex = prev.ownedCrypto.findIndex(c => c.cryptoId === cryptoId);
      if (existingIndex < 0) return prev;

      const existing = prev.ownedCrypto[existingIndex];
      if (existing.quantity < quantity) return prev;

      const totalRevenue = quantity * pricePerUnit;
      let newOwnedCrypto = [...prev.ownedCrypto];

      if (existing.quantity === quantity) {
        newOwnedCrypto.splice(existingIndex, 1);
      } else {
        newOwnedCrypto[existingIndex] = {
          ...existing,
          quantity: existing.quantity - quantity
        };
      }

      return {
        ...prev,
        balance: prev.balance + totalRevenue,
        ownedCrypto: newOwnedCrypto
      };
    });
  }, []);

  // FIXED: Returns fallback price when not yet initialized
  const getStockPrice = useCallback((stockId) => {
    if (stockPriceHistory[stockId]) return stockPriceHistory[stockId];
    const stock = STOCKS.find(s => s.id === stockId);
    return stock ? stock.price : 0;
  }, [stockPriceHistory]);

  const getCryptoPrice = useCallback((cryptoId) => {
    if (cryptoPriceHistory[cryptoId]) return cryptoPriceHistory[cryptoId];
    const crypto = CRYPTOCURRENCIES.find(c => c.id === cryptoId);
    return crypto ? crypto.price : 0;
  }, [cryptoPriceHistory]);

  // Deduct balance externally (for Items)
  const deductBalance = useCallback((amount) => {
    setGameState(prev => {
      if (prev.balance < amount) return prev;
      return { ...prev, balance: prev.balance - amount };
    });
    return true;
  }, []);

  const resetGame = useCallback(() => {
    setGameState(defaultState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = {
    balance,
    level,
    baseClickRate,
    upgradeCost,
    ownedBusinesses,
    mergedBusinesses,
    totalClicks,
    isBoostActive,
    currentPerClick,
    offlineEarnings,
    ownedStocks,
    ownedProperties,
    ownedCrypto,
    stockPriceHistory,
    cryptoPriceHistory,

    calculateTotalIncome,
    getOwnedCount,
    getStockPrice,
    getCryptoPrice,

    handleTap,
    handleUpgrade,
    handleBuyBusiness,
    handleMerge,
    addBonus,
    handleBoostChange,
    clearOfflineEarnings,
    buyStock,
    sellStock,
    buyProperty,
    sellProperty,
    improveProperty,
    buyCrypto,
    sellCrypto,
    deductBalance,
    resetGame
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
}