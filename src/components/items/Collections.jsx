import React, { useState, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useGame } from '../../context/GameContext';
import { useItems } from '../../context/ItemsContext';
import {
  COINS_COLLECTION, PAINTINGS_COLLECTION, UNIQUE_ITEMS,
  RETRO_CARS, JEWELS_COLLECTION, STAMPS_COLLECTION, formatCurrency
} from './itemsData';
import { ShoppingCart, X, Package, Trash2 } from 'lucide-react';

function Collections() {
  const { isDarkTheme } = useTheme();
  const { balance, addBonus } = useGame();
  const { buyItem, sellItem, isOwned } = useItems();

  const [activeTab, setActiveTab] = useState(null);
  const [viewMode, setViewMode] = useState('market');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sellConfirm, setSellConfirm] = useState(null);
  const buyingRef = useRef(false);

  const c = isDarkTheme
    ? { cardBg: 'bg-gray-900', border: 'border-gray-700/50', text: 'text-white',
        textSec: 'text-gray-400', innerBg: 'bg-gray-800', innerBorder: 'border-gray-700',
        overlay: 'bg-black/70', tabActive: 'bg-amber-500 text-white',
        tabInactive: 'bg-gray-800 text-gray-400' }
    : { cardBg: 'bg-white', border: 'border-gray-200', text: 'text-gray-900',
        textSec: 'text-gray-500', innerBg: 'bg-gray-100', innerBorder: 'border-gray-200',
        overlay: 'bg-black/50', tabActive: 'bg-amber-500 text-white',
        tabInactive: 'bg-gray-100 text-gray-500' };

  const collectionTabs = [
    { id: 'coins', label: '🪙 Coins', emoji: '🪙' },
    { id: 'paintings', label: '🖼️ Paintings', emoji: '🖼️' },
    { id: 'unique', label: '⚔️ Unique', emoji: '⚔️' },
    { id: 'retro', label: '🚗 Retro Cars', emoji: '🚗' },
    { id: 'jewels', label: '💎 Jewels', emoji: '💎' },
    { id: 'stamps', label: '📮 Stamps', emoji: '📮' }
  ];

  const getCollectionData = () => {
    switch (activeTab) {
      case 'coins': return { items: COINS_COLLECTION, category: 'Coins' };
      case 'paintings': return { items: PAINTINGS_COLLECTION, category: 'Paintings' };
      case 'unique': return { items: UNIQUE_ITEMS, category: 'UniqueItems' };
      case 'retro': return { items: RETRO_CARS, category: 'RetroCars' };
      case 'jewels': return { items: JEWELS_COLLECTION, category: 'Jewels' };
      case 'stamps': return { items: STAMPS_COLLECTION, category: 'Stamps' };
      default: return { items: [], category: '' };
    }
  };

  const { items, category } = getCollectionData();
  const ownedItems = items.filter(item => isOwned(category, item.id));

  const handleBuy = (item) => {
    if (buyingRef.current || balance < item.price || isOwned(category, item.id)) return;
    buyingRef.current = true;

    const success = buyItem(category, item, item.price);
    if (success) {
      addBonus(-item.price);
    }

    setShowSuccess(true);
    setSelectedItem(null);
    setTimeout(() => {
      setShowSuccess(false);
      buyingRef.current = false;
    }, 1500);
  };

  const handleSell = (item) => {
    const price = sellItem(category, item.id);
    if (price > 0) {
      addBonus(price);
    }
    setSellConfirm(null);
  };

  // Main grid (no tab selected)
  if (!activeTab) {
    return (
      <div className="mb-4">
        <p className={`text-xs font-bold ${c.textSec} uppercase tracking-wider mb-2 px-1`}>
          🎨 Collections
        </p>
        <div className="grid grid-cols-3 gap-2">
          {collectionTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setViewMode('market'); }}
              className={`${c.cardBg} border ${c.border} rounded-2xl p-3 text-center
                transition-all hover:scale-[1.03] active:scale-95`}
            >
              <div className="text-2xl mb-1">{tab.emoji}</div>
              <p className={`text-[10px] font-bold ${c.text}`}>
                {tab.id.charAt(0).toUpperCase() + tab.id.slice(1)}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="mb-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className={`text-xs font-bold ${c.textSec} uppercase tracking-wider px-1`}>
          🎨 Collections
        </p>
        <button
          onClick={() => { setActiveTab(null); setSelectedItem(null); setSellConfirm(null); }}
          className={`px-3 py-1 rounded-lg text-xs font-medium ${c.innerBg} ${c.textSec}`}
        >
          ← Back
        </button>
      </div>

      {/* Sub-tabs */}
      <div className={`${c.innerBg} rounded-xl p-1 overflow-x-auto`}
        style={{ scrollbarWidth: 'none' }}>
        <div className="flex gap-1 min-w-max">
          {collectionTabs.map(tab => (
            <button key={tab.id}
              onClick={() => { setActiveTab(tab.id); setViewMode('market'); setSellConfirm(null); setSelectedItem(null); }}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all whitespace-nowrap
                ${activeTab === tab.id ? c.tabActive : c.tabInactive}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Market / My Collection */}
      <div className="flex gap-2">
        <button onClick={() => setViewMode('market')}
          className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5
            ${viewMode === 'market' ? 'bg-amber-500 text-white' : `${c.innerBg} ${c.textSec}`}`}>
          <ShoppingCart className="w-3.5 h-3.5" /> Market
        </button>
        <button onClick={() => setViewMode('collection')}
          className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5
            ${viewMode === 'collection' ? 'bg-amber-500 text-white' : `${c.innerBg} ${c.textSec}`}`}>
          <Package className="w-3.5 h-3.5" /> My Collection ({ownedItems.length})
        </button>
      </div>

      {/* Success */}
      {showSuccess && (
        <div className="text-center py-2 bg-green-500/20 rounded-xl">
          <p className="text-green-500 font-bold text-sm">✅ Added to Collection!</p>
        </div>
      )}

      {/* Market View */}
      {viewMode === 'market' && (
        <div className="space-y-2">
          {items.map(item => {
            const owned = isOwned(category, item.id);
            return (
              <button
                key={item.id}
                onClick={() => !owned && setSelectedItem(item)}
                disabled={owned}
                className={`w-full ${c.cardBg} border ${c.border} rounded-2xl p-3
                  flex items-center gap-3 text-left transition-all
                  ${owned ? 'opacity-60' : 'hover:scale-[1.01] active:scale-[0.99]'}`}
              >
                <div className="text-3xl w-10 text-center">
                  {owned ? item.image : '🔒'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-bold ${c.text} truncate`}>
                    {owned ? item.name : '???'}
                  </p>
                  {owned && item.description && (
                    <p className={`text-[10px] ${c.textSec} truncate`}>{item.description}</p>
                  )}
                  <p className="text-xs font-bold text-green-500 mt-0.5">
                    {formatCurrency(item.price)}
                  </p>
                </div>
                {owned ? (
                  <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-lg shrink-0">
                    ✓ Owned
                  </span>
                ) : (
                  <span className={`text-[10px] font-medium ${c.textSec} shrink-0`}>Tap to buy</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Collection View */}
      {viewMode === 'collection' && (
        <div>
          {ownedItems.length === 0 ? (
            <div className={`${c.cardBg} border ${c.border} rounded-2xl p-8 text-center`}>
              <Package className={`w-10 h-10 mx-auto mb-2 ${c.textSec}`} />
              <p className={`${c.textSec} text-sm`}>No items yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {ownedItems.map(item => (
                <div key={item.id} className={`${c.cardBg} border ${c.border} rounded-2xl p-3 flex items-center gap-3`}>
                  <div className="text-3xl">{item.image}</div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold ${c.text} truncate`}>{item.name}</p>
                    {item.description && (
                      <p className={`text-[10px] ${c.textSec} truncate`}>{item.description}</p>
                    )}
                    <p className="text-xs font-bold text-green-500">{formatCurrency(item.price)}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setSellConfirm(item); }}
                    className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Buy Popup */}
      {selectedItem && (
        <div className={`fixed inset-0 ${c.overlay} z-[100] flex items-center justify-center p-4`}>
          <div className={`${isDarkTheme ? 'bg-gray-900' : 'bg-white'} rounded-2xl p-5 max-w-sm w-full space-y-4`}>
            <div className="flex items-center justify-between">
              <h4 className={`font-bold ${c.text}`}>Buy Item</h4>
              <button onClick={() => setSelectedItem(null)} className={`p-1.5 rounded-full ${c.innerBg}`}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-3">{selectedItem.image}</div>
              <p className={`font-bold ${c.text}`}>{selectedItem.name}</p>
              <p className={`text-xs ${c.textSec} mt-1`}>{selectedItem.description}</p>
              {selectedItem.year && (
                <p className={`text-xs ${c.textSec} mt-0.5`}>Year: {selectedItem.year}</p>
              )}
              <p className="text-xl font-bold text-green-500 mt-3">
                {formatCurrency(selectedItem.price)}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setSelectedItem(null)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium ${c.innerBg} ${c.text}`}>
                Cancel
              </button>
              <button onClick={() => handleBuy(selectedItem)}
                disabled={balance < selectedItem.price}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all
                  ${balance >= selectedItem.price
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white active:scale-95'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}>
                {balance >= selectedItem.price ? 'Buy Now' : 'No Balance'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sell Popup */}
      {sellConfirm && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className={`${isDarkTheme ? 'bg-gray-900' : 'bg-white'} rounded-2xl p-5 max-w-sm w-full space-y-4`}>
            <div className="flex items-center justify-between">
              <h4 className={`font-bold ${c.text}`}>Sell Item?</h4>
              <button onClick={() => setSellConfirm(null)} className={`p-1.5 rounded-full ${c.innerBg}`}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-2">{sellConfirm.image}</div>
              <p className={`font-bold ${c.text}`}>{sellConfirm.name}</p>
              <p className={`text-xs ${c.textSec} mt-1`}>
                Value: {formatCurrency(sellConfirm.price)}
              </p>
              <p className="text-lg font-bold text-green-500 mt-2">
                Sell for {formatCurrency(Math.floor(sellConfirm.price * 0.7))}
              </p>
              <p className={`text-[10px] ${c.textSec}`}>(70% of value)</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setSellConfirm(null)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium ${c.innerBg} ${c.text}`}>
                Cancel
              </button>
              <button onClick={() => handleSell(sellConfirm)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-red-500 text-white active:scale-95 transition-all">
                Sell
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Collections;