// src/components/profile/useProfileData.js

import { useMemo } from 'react';
import { useGame } from '../../context/GameContext';
import { BADGES, FORBES_LIST } from './profileData';
import { STOCKS, CRYPTOCURRENCIES } from '../investing/investingData';

export const useProfileData = () => {
  const {
    balance,
    level,
    baseClickRate,
    totalClicks,
    upgradeCost,
    ownedBusinesses,
    mergedBusinesses,
    ownedStocks,
    ownedProperties,
    ownedCrypto,
    stockPriceHistory,
    cryptoPriceHistory,
    calculateTotalIncome,
    isBoostActive,
    resetGame,
  } = useGame();

  const totalIncomePerHour = useMemo(() => calculateTotalIncome(), [calculateTotalIncome]);

  const netWorth = useMemo(() => {
    let total = balance;

    ownedStocks.forEach(owned => {
      const currentPrice = stockPriceHistory[owned.stockId] || owned.avgBuyPrice;
      total += currentPrice * owned.quantity;
    });

    ownedProperties.forEach(prop => {
      total += prop.price || 0;
      if (prop.improvements) {
        prop.improvements.forEach(imp => {
          total += imp.cost || 0;
        });
      }
    });

    ownedCrypto.forEach(owned => {
      const currentPrice = cryptoPriceHistory[owned.cryptoId] || owned.avgBuyPrice;
      total += currentPrice * owned.quantity;
    });

    return Math.floor(total);
  }, [balance, ownedStocks, ownedProperties, ownedCrypto, stockPriceHistory, cryptoPriceHistory]);

  const currentBadge = useMemo(() => {
    let badge = BADGES[0];
    for (let i = BADGES.length - 1; i >= 0; i--) {
      if (netWorth >= BADGES[i].minWealth) {
        badge = BADGES[i];
        break;
      }
    }
    return badge;
  }, [netWorth]);

  const nextBadge = useMemo(() => {
    const idx = BADGES.findIndex(b => b.name === currentBadge.name);
    return idx < BADGES.length - 1 ? BADGES[idx + 1] : null;
  }, [currentBadge]);

  const badgeProgress = useMemo(() => {
    if (!nextBadge) return 100;
    const currentMin = currentBadge.minWealth;
    const nextMin = nextBadge.minWealth;
    return Math.min(100, Math.max(0, ((netWorth - currentMin) / (nextMin - currentMin)) * 100));
  }, [netWorth, currentBadge, nextBadge]);

  const stocksSummary = useMemo(() => {
    let totalValue = 0;
    let totalInvested = 0;
    ownedStocks.forEach(owned => {
      const currentPrice = stockPriceHistory[owned.stockId] || owned.avgBuyPrice;
      totalValue += currentPrice * owned.quantity;
      totalInvested += owned.avgBuyPrice * owned.quantity;
    });
    return {
      totalValue: Math.floor(totalValue),
      totalInvested: Math.floor(totalInvested),
      profitLoss: Math.floor(totalValue - totalInvested),
      count: ownedStocks.length,
    };
  }, [ownedStocks, stockPriceHistory]);

  const cryptoSummary = useMemo(() => {
    let totalValue = 0;
    let totalInvested = 0;
    ownedCrypto.forEach(owned => {
      const currentPrice = cryptoPriceHistory[owned.cryptoId] || owned.avgBuyPrice;
      totalValue += currentPrice * owned.quantity;
      totalInvested += owned.avgBuyPrice * owned.quantity;
    });
    return {
      totalValue: Math.floor(totalValue),
      totalInvested: Math.floor(totalInvested),
      profitLoss: Math.floor(totalValue - totalInvested),
      count: ownedCrypto.length,
    };
  }, [ownedCrypto, cryptoPriceHistory]);

  const propertiesSummary = useMemo(() => {
    let totalValue = 0;
    let totalRentalIncome = 0;
    ownedProperties.forEach(prop => {
      totalValue += prop.price || 0;
      let rental = prop.rentalIncomePerHour || 0;
      if (prop.improvements) {
        prop.improvements.forEach(imp => {
          totalValue += imp.cost || 0;
          rental += imp.bonusIncome || 0;
        });
      }
      totalRentalIncome += rental;
    });
    return {
      totalValue: Math.floor(totalValue),
      rentalIncome: Math.floor(totalRentalIncome),
      count: ownedProperties.length,
    };
  }, [ownedProperties]);

  const businessSummary = useMemo(() => {
    const totalIncome = ownedBusinesses.reduce((sum, b) => sum + (b.incomePerHour || 0), 0);
    const uniqueTypes = [...new Set(ownedBusinesses.map(b => b.businessName))];
    return {
      totalIncome: Math.floor(totalIncome),
      count: ownedBusinesses.length,
      uniqueTypes: uniqueTypes.length,
      mergers: mergedBusinesses.length,
    };
  }, [ownedBusinesses, mergedBusinesses]);

  const forbesRank = useMemo(() => {
    const playerWealthCr = netWorth / 10000000;
    for (let i = 0; i < FORBES_LIST.length; i++) {
      const forbesWealth = parseFloat(FORBES_LIST[i].wealth.replace(/[₹, Cr]/g, ''));
      if (playerWealthCr >= forbesWealth) return i + 1;
    }
    return FORBES_LIST.length + 1;
  }, [netWorth]);

  return {
    balance,
    level,
    baseClickRate,
    totalClicks,
    upgradeCost,
    totalIncomePerHour,
    netWorth,
    currentBadge,
    nextBadge,
    badgeProgress,
    stocksSummary,
    cryptoSummary,
    propertiesSummary,
    businessSummary,
    forbesRank,
    isBoostActive,
    ownedBusinesses,
    ownedStocks,
    ownedProperties,
    ownedCrypto,
    stockPriceHistory,
    cryptoPriceHistory,
    mergedBusinesses,
    resetGame,
  };
};