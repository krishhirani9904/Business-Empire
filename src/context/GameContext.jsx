import { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { BUSINESSES, MERGER_OPTIONS, getSellPrice } from '../components/business/businessData';
import { STOCKS, CRYPTOCURRENCIES } from '../components/investing/investingData';

const GameContext = createContext();
const STORAGE_KEY = 'business_samrajya_save';

function useBoostTimerLogic(initialStatus, initialTimer, type, setGameState) {
  const [isActive, setIsActive] = useState(initialStatus === 'boosted');
  const [adStatus, setAdStatus] = useState(initialStatus);
  const [timer, setTimer] = useState(initialTimer);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            timerRef.current = null;

            if (adStatus === 'watching') {
              setAdStatus('boosted');
              setIsActive(true);
              const boostEnd = Date.now() + (60 * 1000);
              setGameState(gs => ({
                ...gs,
                [`${type}BoostEndTime`]: boostEnd,
                [`${type}AdWatchingEndTime`]: null,
              }));
              return 60;
            } else if (adStatus === 'boosted') {
              setAdStatus('idle');
              setIsActive(false);
              setGameState(gs => ({
                ...gs,
                [`${type}BoostEndTime`]: null,
                [`${type}AdWatchingEndTime`]: null,
              }));
              return 0;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [adStatus, timer > 0, type, setGameState]);

  const startAd = useCallback(() => {
    if (adStatus !== 'idle') return;
    const watchEnd = Date.now() + (30 * 1000);
    setAdStatus('watching');
    setTimer(30);
    setGameState(gs => ({
      ...gs,
      [`${type}AdWatchingEndTime`]: watchEnd,
      [`${type}BoostEndTime`]: null,
    }));
  }, [adStatus, type, setGameState]);

  // For restoring boost from offline
  const restoreBoost = useCallback((status, remaining) => {
    setAdStatus(status);
    setIsActive(status === 'boosted');
    setTimer(remaining);
  }, []);

  return {
    isActive,
    adStatus,
    timer,
    startAd,
    restoreBoost,
    setIsActive,
    setAdStatus,
    setTimer
  };
}

// localStorage thi data read kare
const getStoredData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (typeof parsed === 'object' && parsed !== null) {
        return {
          balance: typeof parsed.balance === 'number' ? parsed.balance : 0,
          level: typeof parsed.level === 'number' ? parsed.level : 1,
          baseClickRate: typeof parsed.baseClickRate === 'number' ? parsed.baseClickRate : 1,
          upgradeCost: typeof parsed.upgradeCost === 'number' ? parsed.upgradeCost : 100,
          totalClicks: typeof parsed.totalClicks === 'number' ? parsed.totalClicks : 0,
          lastSaved: parsed.lastSaved || null,

          earningsBoostEndTime: typeof parsed.earningsBoostEndTime === 'number' ? parsed.earningsBoostEndTime : null,
          earningsAdWatchingEndTime: typeof parsed.earningsAdWatchingEndTime === 'number' ? parsed.earningsAdWatchingEndTime : null,
          businessBoostEndTime: typeof parsed.businessBoostEndTime === 'number' ? parsed.businessBoostEndTime : null,
          businessAdWatchingEndTime: typeof parsed.businessAdWatchingEndTime === 'number' ? parsed.businessAdWatchingEndTime : null,

          ownedBusinesses: Array.isArray(parsed.ownedBusinesses) ? parsed.ownedBusinesses : [],
          mergedBusinesses: Array.isArray(parsed.mergedBusinesses) ? parsed.mergedBusinesses : [],

          ownedStocks: Array.isArray(parsed.ownedStocks) ? parsed.ownedStocks : [],
          ownedProperties: Array.isArray(parsed.ownedProperties) ? parsed.ownedProperties : [],
          ownedCrypto: Array.isArray(parsed.ownedCrypto) ? parsed.ownedCrypto : [],
          stockPriceHistory: typeof parsed.stockPriceHistory === 'object' && parsed.stockPriceHistory !== null
            ? parsed.stockPriceHistory : {},
          cryptoPriceHistory: typeof parsed.cryptoPriceHistory === 'object' && parsed.cryptoPriceHistory !== null
            ? parsed.cryptoPriceHistory : {},
        };
      }
    }
  } catch (e) {
    console.error('Corrupt save data, resetting:', e);
    localStorage.removeItem(STORAGE_KEY);
  }
  return null;
};

const defaultState = {
  balance: 0,
  level: 1,
  baseClickRate: 1,
  upgradeCost: 100,
  totalClicks: 0,
  offlineEarnings: 0,

  earningsBoostEndTime: null,
  earningsAdWatchingEndTime: null,
  businessBoostEndTime: null,
  businessAdWatchingEndTime: null,

  ownedBusinesses: [],
  mergedBusinesses: [],

  ownedStocks: [],
  ownedProperties: [],
  ownedCrypto: [],
  stockPriceHistory: {},
  cryptoPriceHistory: {},
};

const calculateBoostStatusForType = (stored, type) => {
  if (!stored) return { isActive: false, remaining: 0, status: 'idle' };

  const now = Date.now();
  const boostEnd = stored[`${type}BoostEndTime`];
  const adEnd = stored[`${type}AdWatchingEndTime`];

  if (boostEnd && boostEnd > now) {
    return {
      isActive: true,
      remaining: Math.floor((boostEnd - now) / 1000),
      status: 'boosted',
    };
  }

  if (adEnd && adEnd > now) {
    return {
      isActive: false,
      remaining: Math.floor((adEnd - now) / 1000),
      status: 'watching',
    };
  }

  if (adEnd && adEnd <= now && !boostEnd) {
    return {
      isActive: true,
      remaining: 60,
      status: 'boosted',
      needsBoostStart: true,
    };
  }

  return { isActive: false, remaining: 0, status: 'idle' };
};

const computeInitialState = () => {
  const stored = getStoredData();

  const earningsBoost = calculateBoostStatusForType(stored, 'earnings');
  const businessBoost = calculateBoostStatusForType(stored, 'business');

  let initGameState = { ...defaultState, ...stored };

  if (stored?.lastSaved) {
    const timeDiff = (Date.now() - stored.lastSaved) / 1000;
    const MAX_OFFLINE_SECONDS = 24 * 60 * 60;
    const cappedTimeDiff = Math.min(timeDiff, MAX_OFFLINE_SECONDS);

    const offlineRate = (stored.baseClickRate || 1) * 0.1;
    let earned = Math.floor(cappedTimeDiff * offlineRate);

    const hoursElapsed = cappedTimeDiff / 3600;

    // Business income with boost consideration
    if (stored.ownedBusinesses && stored.ownedBusinesses.length > 0) {
      let totalIncomePerHour = stored.ownedBusinesses.reduce(
        (sum, owned) => sum + (owned.incomePerHour || 0), 0
      );

      if (stored.mergedBusinesses) {
        stored.mergedBusinesses.forEach(mergerId => {
          const merger = MERGER_OPTIONS.find(m => m.id === mergerId);
          if (merger) {
            totalIncomePerHour = totalIncomePerHour * (1 + merger.bonus / 100);
          }
        });
      }

      if (stored.businessBoostEndTime && stored.businessBoostEndTime > stored.lastSaved) {
        const boostSecondsRemaining = Math.max(0, (stored.businessBoostEndTime - stored.lastSaved) / 1000);
        const boostHours = Math.min(boostSecondsRemaining / 3600, hoursElapsed);
        const normalHours = hoursElapsed - boostHours;
        earned += Math.floor(totalIncomePerHour * boostHours * 2);
        earned += Math.floor(totalIncomePerHour * normalHours);
      } else {
        earned += Math.floor(totalIncomePerHour * hoursElapsed);
      }
    }

    // Property rental income
    if (stored.ownedProperties && stored.ownedProperties.length > 0) {
      let totalRentalPerHour = stored.ownedProperties.reduce((sum, prop) => {
        let rental = prop.rentalIncomePerHour || 0;
        if (prop.improvements && prop.improvements.length > 0) {
          prop.improvements.forEach(imp => {
            rental += imp.bonusIncome || 0;
          });
        }
        return sum + rental;
      }, 0);

      earned += Math.floor(totalRentalPerHour * hoursElapsed);
    }

    if (earned > 0) {
      initGameState.offlineEarnings = earned;
      initGameState.balance = (initGameState.balance || 0) + earned;
    }
  }

  return { initGameState, earningsBoost, businessBoost };
};

export function GameProvider({ children }) {
  const [initialData] = useState(computeInitialState);
  const [gameState, setGameState] = useState(initialData.initGameState);

  const earningsBoostHook = useBoostTimerLogic(
    initialData.earningsBoost.status,
    initialData.earningsBoost.remaining,
    'earnings',
    setGameState
  );

  const businessBoostHook = useBoostTimerLogic(
    initialData.businessBoost.status,
    initialData.businessBoost.remaining,
    'business',
    setGameState
  );

  // Timer refs for income
  const incomeTimerRef = useRef(null);
  const saveTimerRef = useRef(null);
  const incomeAccumulatorRef = useRef(0);

  const [isInvestingActive, setIsInvestingActive] = useState(false);
  const priceUpdateRef = useRef(null);

  // Destructure
  const {
    balance, level, baseClickRate, upgradeCost,
    totalClicks, offlineEarnings,
    ownedBusinesses, mergedBusinesses,
    ownedStocks, ownedProperties, ownedCrypto,
    stockPriceHistory, cryptoPriceHistory,
  } = gameState;

  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          ...gameState,
          lastSaved: Date.now(),
        }));
      } catch (e) {
        console.error('Error saving:', e);
      }
    }, 2000);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [gameState]);

  // Save on page close
  useEffect(() => {
    const handleBeforeUnload = () => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          ...gameState,
          lastSaved: Date.now(),
        }));
      } catch (e) {
        console.error('Error saving on unload:', e);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [gameState]);

  // Handle offline boost edge case
  useEffect(() => {
    if (initialData.earningsBoost.needsBoostStart) {
      const boostEnd = Date.now() + (60 * 1000);
      setGameState(gs => ({ ...gs, earningsBoostEndTime: boostEnd, earningsAdWatchingEndTime: null }));
      earningsBoostHook.restoreBoost('boosted', 60);
    }
    if (initialData.businessBoost.needsBoostStart) {
      const boostEnd = Date.now() + (60 * 1000);
      setGameState(gs => ({ ...gs, businessBoostEndTime: boostEnd, businessAdWatchingEndTime: null }));
      businessBoostHook.restoreBoost('boosted', 60);
    }
  }, []);

  useEffect(() => {
    // Initialize prices first time
    const needsStockInit = Object.keys(stockPriceHistory).length === 0;
    const needsCryptoInit = Object.keys(cryptoPriceHistory).length === 0;

    if (needsStockInit || needsCryptoInit) {
      setGameState(prev => {
        const newStockPrices = { ...prev.stockPriceHistory };
        const newCryptoPrices = { ...prev.cryptoPriceHistory };

        if (needsStockInit) {
          STOCKS.forEach(stock => {
            newStockPrices[stock.id] = stock.price;
          });
        }

        if (needsCryptoInit) {
          CRYPTOCURRENCIES.forEach(crypto => {
            newCryptoPrices[crypto.id] = crypto.price;
          });
        }

        return {
          ...prev,
          stockPriceHistory: newStockPrices,
          cryptoPriceHistory: newCryptoPrices,
        };
      });
    }
  }, []);

  // Price simulation — only runs when investing is active
  useEffect(() => {
    if (priceUpdateRef.current) {
      clearInterval(priceUpdateRef.current);
      priceUpdateRef.current = null;
    }

    // Only update prices if investing page is being viewed
    if (isInvestingActive) {
      priceUpdateRef.current = setInterval(() => {
        setGameState(prev => {
          const newStockPrices = { ...prev.stockPriceHistory };
          const newCryptoPrices = { ...prev.cryptoPriceHistory };

          STOCKS.forEach(stock => {
            const currentPrice = newStockPrices[stock.id] || stock.price;
            const changePercent = (Math.random() - 0.48) * 2 * (stock.volatility / 100);
            let newPrice = currentPrice * (1 + changePercent);
            const minPrice = stock.price * 0.5;
            const maxPrice = stock.price * 2.0;
            newPrice = Math.max(minPrice, Math.min(maxPrice, newPrice));
            newStockPrices[stock.id] = Math.round(newPrice * 100) / 100;
          });

          CRYPTOCURRENCIES.forEach(crypto => {
            const currentPrice = newCryptoPrices[crypto.id] || crypto.price;
            const changePercent = (Math.random() - 0.48) * 2 * (crypto.volatility / 100);
            let newPrice = currentPrice * (1 + changePercent);
            const minPrice = crypto.price * 0.3;
            const maxPrice = crypto.price * 3.0;
            newPrice = Math.max(minPrice, Math.min(maxPrice, newPrice));
            newCryptoPrices[crypto.id] = Math.round(newPrice * 100) / 100;
          });

          return {
            ...prev,
            stockPriceHistory: newStockPrices,
            cryptoPriceHistory: newCryptoPrices,
          };
        });
      }, 30000);
    }

    return () => {
      if (priceUpdateRef.current) {
        clearInterval(priceUpdateRef.current);
        priceUpdateRef.current = null;
      }
    };
  }, [isInvestingActive]);

  const calculateTotalIncome = useCallback(() => {
    let total = ownedBusinesses.reduce(
      (sum, owned) => sum + (owned.incomePerHour || 0), 0
    );

    mergedBusinesses.forEach(mergerId => {
      const merger = MERGER_OPTIONS.find(m => m.id === mergerId);
      if (merger) {
        total = total * (1 + merger.bonus / 100);
      }
    });

    if (businessBoostHook.isActive) {
      total = total * 2;
    }

    ownedProperties.forEach(prop => {
      let rental = prop.rentalIncomePerHour || 0;
      if (prop.improvements) {
        prop.improvements.forEach(imp => {
          rental += imp.bonusIncome || 0;
        });
      }
      total += rental;
    });

    return Math.floor(total);
  }, [ownedBusinesses, mergedBusinesses, businessBoostHook.isActive, ownedProperties]);

  useEffect(() => {
    if (incomeTimerRef.current) clearInterval(incomeTimerRef.current);

    const totalIncome = calculateTotalIncome();

    if (totalIncome > 0) {
      const incomePerTick = totalIncome / 360;

      incomeTimerRef.current = setInterval(() => {
        incomeAccumulatorRef.current += incomePerTick;

        if (incomeAccumulatorRef.current >= 1) {
          const toAdd = Math.floor(incomeAccumulatorRef.current);
          incomeAccumulatorRef.current -= toAdd;

          setGameState(prev => ({
            ...prev,
            balance: prev.balance + toAdd
          }));
        }
      }, 10000);
    }

    return () => {
      if (incomeTimerRef.current) clearInterval(incomeTimerRef.current);
    };
  }, [calculateTotalIncome]);

  const currentPerClick = useMemo(() => {
    return earningsBoostHook.isActive ? baseClickRate * 2 : baseClickRate;
  }, [earningsBoostHook.isActive, baseClickRate]);

  const handleTap = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      balance: prev.balance + (earningsBoostHook.isActive ? prev.baseClickRate * 2 : prev.baseClickRate),
      totalClicks: prev.totalClicks + 1
    }));
  }, [earningsBoostHook.isActive]);

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

  const addBonus = useCallback((amount) => {
    setGameState(prev => ({ ...prev, balance: prev.balance + amount }));
  }, []);

  const clearOfflineEarnings = useCallback(() => {
    setGameState(prev => ({ ...prev, offlineEarnings: 0 }));
  }, []);

  const handleBuyBusiness = useCallback((business, size, customName) => {
    setGameState(prev => {
      if (prev.balance < size.cost) return prev;
      return {
        ...prev,
        balance: prev.balance - size.cost,
        ownedBusinesses: [...prev.ownedBusinesses, {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          businessId: business.id,
          businessName: business.name,
          customName: customName || `${size.type} ${business.name}`,
          sizeType: size.type,
          incomePerHour: size.incomePerHour,
          purchaseCost: size.cost,
          purchasedAt: new Date().toISOString()
        }]
      };
    });
  }, []);

  const handleSellBusiness = useCallback((ownedId) => {
    setGameState(prev => {
      const businessToSell = prev.ownedBusinesses.find(o => o.id === ownedId);
      if (!businessToSell) return prev;
      const sellPrice = getSellPrice(businessToSell);
      return {
        ...prev,
        balance: prev.balance + sellPrice,
        ownedBusinesses: prev.ownedBusinesses.filter(o => o.id !== ownedId)
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

  const getOwnedCount = useCallback((businessId) => {
    return ownedBusinesses.filter(o => o.businessId === businessId).length;
  }, [ownedBusinesses]);

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
          avgBuyPrice: Math.round((totalValue / totalQty) * 100) / 100
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

  const buyProperty = useCallback((property) => {
    setGameState(prev => {
      if (prev.balance < property.price) return prev;

      return {
        ...prev,
        balance: prev.balance - property.price,
        ownedProperties: [...prev.ownedProperties, {
          ...property,
          ownId: `prop-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          improvements: [],
          purchasedAt: new Date().toISOString()
        }]
      };
    });
  }, []);

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

  const sellProperty = useCallback((ownId) => {
    setGameState(prev => {
      const propIndex = prev.ownedProperties.findIndex(p => p.ownId === ownId);
      if (propIndex < 0) return prev;

      const prop = prev.ownedProperties[propIndex];
      const baseSellPrice = (prop.price || 0) * 0.7;
      const improvementValue = (prop.improvements || []).reduce(
        (sum, imp) => sum + (imp.cost || 0) * 0.5, 0
      );
      const totalSellPrice = Math.floor(baseSellPrice + improvementValue);

      const newProps = [...prev.ownedProperties];
      newProps.splice(propIndex, 1);

      return {
        ...prev,
        balance: prev.balance + totalSellPrice,
        ownedProperties: newProps
      };
    });
  }, []);

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

  const getStockPrice = useCallback((stockId) => {
    return stockPriceHistory[stockId] || 0;
  }, [stockPriceHistory]);

  const getCryptoPrice = useCallback((cryptoId) => {
    return cryptoPriceHistory[cryptoId] || 0;
  }, [cryptoPriceHistory]);

  const resetGame = useCallback(() => {
    setGameState({ ...defaultState });
    earningsBoostHook.restoreBoost('idle', 0);
    businessBoostHook.restoreBoost('idle', 0);
    incomeAccumulatorRef.current = 0;
    localStorage.removeItem(STORAGE_KEY);
  }, [earningsBoostHook, businessBoostHook]);

  const value = useMemo(() => ({
    // Earnings
    balance, level, baseClickRate, upgradeCost,
    totalClicks, currentPerClick, offlineEarnings,

    // Earnings boost
    earningsBoostActive: earningsBoostHook.isActive,
    earningsAdStatus: earningsBoostHook.adStatus,
    earningsBoostTimer: earningsBoostHook.timer,
    startEarningsAd: earningsBoostHook.startAd,

    // Business boost
    businessBoostActive: businessBoostHook.isActive,
    businessAdStatus: businessBoostHook.adStatus,
    businessBoostTimer: businessBoostHook.timer,
    startBusinessAd: businessBoostHook.startAd,

    // Core actions
    handleTap, handleUpgrade, addBonus,
    clearOfflineEarnings, resetGame,

    // Business
    ownedBusinesses, mergedBusinesses,
    calculateTotalIncome, getOwnedCount,
    handleBuyBusiness, handleMerge, handleSellBusiness,

    // Investing
    ownedStocks, ownedProperties, ownedCrypto,
    stockPriceHistory, cryptoPriceHistory,
    getStockPrice, getCryptoPrice,
    buyStock, sellStock,
    buyProperty, improveProperty, sellProperty,
    buyCrypto, sellCrypto,

    setIsInvestingActive,
  }), [
    balance, level, baseClickRate, upgradeCost, totalClicks, currentPerClick, offlineEarnings,
    earningsBoostHook.isActive, earningsBoostHook.adStatus, earningsBoostHook.timer, earningsBoostHook.startAd,
    businessBoostHook.isActive, businessBoostHook.adStatus, businessBoostHook.timer, businessBoostHook.startAd,
    handleTap, handleUpgrade, addBonus, clearOfflineEarnings, resetGame,
    ownedBusinesses, mergedBusinesses, calculateTotalIncome, getOwnedCount,
    handleBuyBusiness, handleMerge, handleSellBusiness,
    ownedStocks, ownedProperties, ownedCrypto, stockPriceHistory, cryptoPriceHistory,
    getStockPrice, getCryptoPrice, buyStock, sellStock, buyProperty, improveProperty, sellProperty,
    buyCrypto, sellCrypto
  ]);

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