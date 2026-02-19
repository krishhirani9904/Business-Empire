// ============================================
// 📄 FILE: src/context/ItemsContext.jsx
// 🎯 PURPOSE: Items State Manager
// 🔧 FIXES:
//    Bug #12: Debounced save (2s delay)
//    Bug #14: sellItem uses useRef to avoid recreating
// ============================================

import { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';

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

  const buyingRef = useRef(false);
  // 🔧 FIX Bug #12: Save timer ref for debouncing
  const saveTimerRef = useRef(null);
  // 🔧 FIX Bug #14: State ref for sellItem
  const itemsStateRef = useRef(itemsState);

  // Keep ref in sync with state
  useEffect(() => {
    itemsStateRef.current = itemsState;
  }, [itemsState]);

  // 🔧 FIX Bug #12: Debounced auto-save
  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(itemsState));
      } catch (e) {
        console.error('Error saving items:', e);
      }
    }, 2000);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [itemsState]);

  // Save on page close
  useEffect(() => {
    const handleBeforeUnload = () => {
      try {
        localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(itemsStateRef.current));
      } catch (e) {
        console.error('Error saving items on unload:', e);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Buy item
  const buyItem = useCallback((category, item, totalPrice, extraData = {}) => {
    if (buyingRef.current) return false;
    buyingRef.current = true;

    setItemsState(prev => {
      const key = `owned${category}`;
      return {
        ...prev,
        [key]: [...(prev[key] || []), {
          ...item,
          ...extraData,
          ownId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          purchasePrice: totalPrice,
          purchasedAt: new Date().toISOString()
        }]
      };
    });

    setTimeout(() => { buyingRef.current = false; }, 500);
    return true;
  }, []);

  // 🔧 FIX Bug #14: sellItem uses ref, no itemsState dependency
  const sellItem = useCallback((category, identifierId) => {
    if (buyingRef.current) return 0;
    buyingRef.current = true;

    const key = `owned${category}`;
    const currentItems = itemsStateRef.current[key] || [];

    const item = currentItems.find(i => i.ownId === identifierId)
              || currentItems.find(i => i.id === identifierId);

    if (!item) {
      buyingRef.current = false;
      return 0;
    }

    const sellPrice = Math.floor((item.purchasePrice || item.price || 0) * 0.7);

    setItemsState(prev => {
      const items = prev[key] || [];
      return {
        ...prev,
        [key]: items.filter(i => i.ownId !== item.ownId)
      };
    });

    setTimeout(() => { buyingRef.current = false; }, 500);
    return sellPrice;
  }, []); // No dependencies — uses ref

  // Check if owned by original id
  const isOwned = useCallback((category, itemId) => {
    const key = `owned${category}`;
    return (itemsStateRef.current[key] || []).some(item => item.id === itemId);
  }, []);

  // Earn insignia
  const earnInsignia = useCallback((insigniaId) => {
    setItemsState(prev => {
      if (prev.earnedInsignia.includes(insigniaId)) return prev;
      return {
        ...prev,
        earnedInsignia: [...prev.earnedInsignia, insigniaId]
      };
    });
  }, []);

  // Get total items value
  const getTotalItemsValue = useCallback(() => {
    const state = itemsStateRef.current;
    let total = 0;
    Object.keys(state).forEach(key => {
      if (Array.isArray(state[key]) && key !== 'earnedInsignia') {
        state[key].forEach(item => {
          total += item.purchasePrice || item.price || 0;
        });
      }
    });
    return total;
  }, []);

  // Get count for any category
  const getItemCount = useCallback((category) => {
    const key = `owned${category}`;
    return (itemsStateRef.current[key] || []).length;
  }, []);

  // Reset all items
  const resetItems = useCallback(() => {
    setItemsState({ ...defaultItems });
    localStorage.removeItem(ITEMS_STORAGE_KEY);
  }, []);

  // 🔧 FIX Bug #13 (partial): useMemo for value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    ...itemsState,
    buyItem,
    sellItem,
    isOwned,
    earnInsignia,
    getTotalItemsValue,
    getItemCount,
    resetItems
  }), [itemsState, buyItem, sellItem, isOwned, earnInsignia, getTotalItemsValue, getItemCount, resetItems]);

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