// src/context/ItemsContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useGame } from './GameContext';

const ItemsContext = createContext();

const ITEMS_STORAGE_KEY = 'business_samrajya_items';

const getStoredItems = () => {
  try {
    const data = localStorage.getItem(ITEMS_STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading items localStorage:', e);
  }
  return null;
};

const defaultItems = {
  ownedCars: [],
  ownedAircraft: [],
  ownedYachts: [],
  ownedCoins: [],
  ownedPaintings: [],
  ownedUniqueItems: [],
  ownedRetroCars: [],
  ownedJewels: [],
  ownedStamps: [],
  earnedInsignia: [],
  ownedNFTs: [],
  ownedIslands: []
};

export function ItemsProvider({ children }) {
  const [itemsState, setItemsState] = useState(() => {
    const stored = getStoredItems();
    return { ...defaultItems, ...stored };
  });

  // FIXED: Actually use deductBalance to subtract money
  const { deductBalance } = useGame();

  useEffect(() => {
    try {
      localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(itemsState));
    } catch (e) {
      console.error('Error saving items:', e);
    }
  }, [itemsState]);

  // FIXED: buyItem now deducts balance
  const buyItem = useCallback((category, item, totalPrice, extraData = {}) => {
    const success = deductBalance(totalPrice);
    if (!success) return false;

    setItemsState(prev => {
      const key = `owned${category}`;
      return {
        ...prev,
        [key]: [...(prev[key] || []), {
          ...item,
          ...extraData,
          ownId: Date.now(),
          purchasePrice: totalPrice,
          purchasedAt: new Date().toISOString()
        }]
      };
    });
    return true;
  }, [deductBalance]);

  const isOwned = useCallback((category, itemId) => {
    const key = `owned${category}`;
    return (itemsState[key] || []).some(item => item.id === itemId);
  }, [itemsState]);

  const earnInsignia = useCallback((insigniaId) => {
    setItemsState(prev => {
      if (prev.earnedInsignia.includes(insigniaId)) return prev;
      return {
        ...prev,
        earnedInsignia: [...prev.earnedInsignia, insigniaId]
      };
    });
  }, []);

  const getTotalItemsValue = useCallback(() => {
    let total = 0;
    Object.keys(itemsState).forEach(key => {
      if (Array.isArray(itemsState[key]) && key !== 'earnedInsignia') {
        itemsState[key].forEach(item => {
          total += item.purchasePrice || item.price || 0;
        });
      }
    });
    return total;
  }, [itemsState]);

  const resetItems = useCallback(() => {
    setItemsState(defaultItems);
    localStorage.removeItem(ITEMS_STORAGE_KEY);
  }, []);

  const value = {
    ...itemsState,
    buyItem,
    isOwned,
    earnInsignia,
    getTotalItemsValue,
    resetItems
  };

  return (
    <ItemsContext.Provider value={value}>
      {children}
    </ItemsContext.Provider>
  );
}

export function useItems() {
  const context = useContext(ItemsContext);
  if (!context) throw new Error('useItems must be used within ItemsProvider');
  return context;
}