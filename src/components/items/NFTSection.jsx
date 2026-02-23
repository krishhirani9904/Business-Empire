import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useGame } from '../../context/GameContext';
import { useItems } from '../../context/ItemsContext';
import { NFTS, formatCurrency } from './itemsData';
import { X, ShoppingCart, Trash2 } from 'lucide-react';

function NFTSection() {
  const { isDarkTheme } = useTheme();
  const { balance, addBonus } = useGame();
  const { buyItem, sellItem, isOwned, ownedNFTs } = useItems();

  const [viewMode, setViewMode] = useState('market');
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sellConfirm, setSellConfirm] = useState(null);

  const buyingRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const c = isDarkTheme
    ? {
        cardBg: 'bg-gray-900', border: 'border-gray-700/50',
        text: 'text-white', textSec: 'text-gray-400',
        innerBg: 'bg-gray-800', overlay: 'bg-black/70'
      }
    : {
        cardBg: 'bg-white', border: 'border-gray-200',
        text: 'text-gray-900', textSec: 'text-gray-500',
        innerBg: 'bg-gray-100', overlay: 'bg-black/50'
      };

  const rarityColors = {
    Common: 'bg-gray-500/20 text-gray-400',
    Rare: 'bg-blue-500/20 text-blue-400',
    Epic: 'bg-purple-500/20 text-purple-400',
    Legendary: 'bg-yellow-500/20 text-yellow-400'
  };

  const handleBuy = (nft) => {
    if (buyingRef.current || balance < nft.price || isOwned('NFTs', nft.id)) return;
    buyingRef.current = true;

    const success = buyItem('NFTs', nft, nft.price);
    if (success) {
      addBonus(-nft.price);
    }

    setShowSuccess(true);
    setSelectedNFT(null);
    setTimeout(() => {
      if (mountedRef.current) {
        setShowSuccess(false);
      }
      buyingRef.current = false;
    }, 1500);
  };

  const handleSell = (nft) => {
    const price = sellItem('NFTs', nft.id);
    if (price > 0) addBonus(price);
    setSellConfirm(null);
  };

  return (
    <div className="space-y-3">

      {/* Market / Owned Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setViewMode('market')}
          className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all 
            flex items-center justify-center gap-1.5
            ${viewMode === 'market'
              ? 'bg-purple-500 text-white'
              : `${c.innerBg} ${c.textSec}`}`}
        >
          <ShoppingCart className="w-3.5 h-3.5" /> Market
        </button>
        <button
          onClick={() => setViewMode('owned')}
          className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all 
            flex items-center justify-center gap-1.5
            ${viewMode === 'owned'
              ? 'bg-purple-500 text-white'
              : `${c.innerBg} ${c.textSec}`}`}
        >
          🎨 My NFTs ({ownedNFTs.length})
        </button>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="text-center py-2 bg-green-500/20 rounded-xl">
          <p className="text-green-500 font-bold text-sm">✅ NFT Purchased!</p>
        </div>
      )}

      {/* MARKET VIEW */}
      {viewMode === 'market' && (
        <div className="space-y-2">
          {NFTS.map(nft => {
            const owned = isOwned('NFTs', nft.id);
            return (
              <div
                key={nft.id}
                className={`${c.cardBg} border ${c.border} rounded-2xl p-3
                  flex items-center gap-3 transition-all`}
              >
                <div className="text-3xl w-10 text-center">{nft.image}</div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-bold ${c.text} truncate`}>
                    {nft.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded 
                      ${rarityColors[nft.rarity]}`}>
                      {nft.rarity}
                    </span>
                    <span className={`text-[10px] ${c.textSec}`}>
                      {nft.collection}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-green-500 mt-0.5">
                    {formatCurrency(nft.price)}
                  </p>
                </div>
                {owned ? (
                  <span className="text-[10px] font-bold text-green-500 
                    bg-green-500/10 px-2 py-1 rounded-lg shrink-0">
                    ✓ Owned
                  </span>
                ) : (
                  <button
                    onClick={() => setSelectedNFT(nft)}
                    className={`p-1.5 rounded-lg ${c.innerBg} shrink-0`}
                  >
                    <ShoppingCart className={`w-4 h-4 ${c.textSec}`} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* OWNED VIEW */}
      {viewMode === 'owned' && (
        <div>
          {ownedNFTs.length === 0 ? (
            <div className={`${c.cardBg} border ${c.border} rounded-2xl p-8 text-center`}>
              <p className="text-3xl mb-2">🎨</p>
              <p className={`${c.textSec} text-sm font-medium`}>No NFTs yet</p>
              <p className={`${c.textSec} text-xs mt-1`}>
                Switch to Market to buy NFTs!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {ownedNFTs.map(nft => (
                <div
                  key={nft.ownId}
                  className={`${c.cardBg} border ${c.border} rounded-2xl p-3
                    flex items-center gap-3`}
                >
                  <div className="text-3xl">{nft.image}</div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold ${c.text} truncate`}>
                      {nft.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded 
                        ${rarityColors[nft.rarity]}`}>
                        {nft.rarity}
                      </span>
                      <span className={`text-[10px] ${c.textSec}`}>
                        {nft.collection}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-green-500 mt-0.5">
                      {formatCurrency(nft.purchasePrice)}
                    </p>
                  </div>
                  <button
                    onClick={() => setSellConfirm(nft)}
                    className="p-1.5 rounded-lg bg-red-500/10 text-red-500 
                      hover:bg-red-500/20 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* BUY POPUP */}
      {selectedNFT && (
        <div className={`fixed inset-0 ${c.overlay} z-[100] 
          flex items-center justify-center p-4`}>
          <div className={`${isDarkTheme ? 'bg-gray-900' : 'bg-white'} 
            rounded-2xl p-5 max-w-sm w-full space-y-4`}>
            <div className="flex items-center justify-between">
              <h4 className={`font-bold ${c.text}`}>Buy NFT</h4>
              <button
                onClick={() => setSelectedNFT(null)}
                className={`p-1.5 rounded-full ${c.innerBg}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-3">{selectedNFT.image}</div>
              <p className={`font-bold ${c.text}`}>{selectedNFT.name}</p>
              <span className={`text-xs font-bold px-2 py-0.5 rounded 
                ${rarityColors[selectedNFT.rarity]} inline-block mt-1`}>
                {selectedNFT.rarity}
              </span>
              <p className={`text-xs ${c.textSec} mt-2`}>
                {selectedNFT.description}
              </p>
              <p className={`text-xs ${c.textSec} mt-1`}>
                Collection: {selectedNFT.collection}
              </p>
              <p className="text-xl font-bold text-green-500 mt-3">
                {formatCurrency(selectedNFT.price)}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedNFT(null)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium 
                  ${c.innerBg} ${c.text}`}
              >
                Cancel
              </button>
              <button
                onClick={() => handleBuy(selectedNFT)}
                disabled={balance < selectedNFT.price}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all
                  ${balance >= selectedNFT.price
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white active:scale-95'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}
              >
                {balance >= selectedNFT.price ? 'Buy Now' : 'No Balance'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SELL POPUP */}
      {sellConfirm && (
        <div className="fixed inset-0 bg-black/60 z-[100] 
          flex items-center justify-center p-4">
          <div className={`${isDarkTheme ? 'bg-gray-900' : 'bg-white'} 
            rounded-2xl p-5 max-w-sm w-full space-y-4`}>
            <div className="flex items-center justify-between">
              <h4 className={`font-bold ${c.text}`}>Sell NFT?</h4>
              <button
                onClick={() => setSellConfirm(null)}
                className={`p-1.5 rounded-full ${c.innerBg}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-2">{sellConfirm.image}</div>
              <p className={`font-bold ${c.text}`}>{sellConfirm.name}</p>
              <p className={`text-xs ${c.textSec} mt-1`}>
                Purchased for {formatCurrency(sellConfirm.purchasePrice)}
              </p>
              <p className="text-lg font-bold text-green-500 mt-2">
                Sell for {formatCurrency(
                  Math.floor((sellConfirm.purchasePrice || sellConfirm.price) * 0.7)
                )}
              </p>
              <p className={`text-[10px] ${c.textSec}`}>(70% of value)</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSellConfirm(null)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium 
                  ${c.innerBg} ${c.text}`}
              >
                Cancel
              </button>
              <button
                onClick={() => handleSell(sellConfirm)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold 
                  bg-red-500 text-white active:scale-95 transition-all"
              >
                Sell
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NFTSection;