import React, { useState } from 'react';
import {
  User, Crown, IndianRupee, Briefcase, TrendingUp, Home,
  Car, Plane, Ship, ShoppingBag, Award, Trash2, X,
  ChevronDown, ChevronUp, BarChart3, Trophy, Star,
  Coins, Image, Gem, Stamp, Globe, Palette
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useGame } from '../context/GameContext';
import { useItems } from '../context/ItemsContext';
import { formatCurrency } from '../utils/formatCurrency';
import { BUSINESSES } from '../components/business/businessData';
import { STOCKS, PROPERTIES, CRYPTOCURRENCIES } from '../components/investing/investingData';

// Forbes Dummy Data — Top players list
const FORBES_LIST = [
  { rank: 1, name: 'Mukesh Dhirubhai', netWorth: 9500000000, avatar: '👑', industry: 'Oil & Gas' },
  { rank: 2, name: 'Gautam Shantilal', netWorth: 8200000000, avatar: '⚡', industry: 'Infrastructure' },
  { rank: 3, name: 'Shiv Nadar Ji', netWorth: 3100000000, avatar: '💻', industry: 'IT Services' },
  { rank: 4, name: 'Radhakishan Sir', netWorth: 2900000000, avatar: '🏪', industry: 'Retail' },
  { rank: 5, name: 'Cyrus Poonawalla', netWorth: 2400000000, avatar: '💉', industry: 'Pharma' },
  { rank: 6, name: 'Kumar Birla Ji', netWorth: 1800000000, avatar: '🏭', industry: 'Manufacturing' },
  { rank: 7, name: 'Lakshmi Mittal', netWorth: 1700000000, avatar: '⚙️', industry: 'Steel' },
  { rank: 8, name: 'Uday Kotak Ji', netWorth: 1500000000, avatar: '🏦', industry: 'Banking' },
  { rank: 9, name: 'Azim Premji Ji', netWorth: 1100000000, avatar: '🖥️', industry: 'Software' },
  { rank: 10, name: 'Dilip Shanghvi', netWorth: 950000000, avatar: '💊', industry: 'Pharma' },
];

function Profile() {
  const { isDarkTheme } = useTheme();

  const {
    balance, level, totalClicks, baseClickRate, currentPerClick,
    ownedBusinesses, mergedBusinesses, calculateTotalIncome,
    ownedStocks, ownedProperties, ownedCrypto,
    stockPriceHistory, cryptoPriceHistory,
    resetGame
  } = useGame();

  const {
    ownedCars, ownedAircraft, ownedYachts,
    ownedCoins, ownedPaintings, ownedUniqueItems,
    ownedRetroCars, ownedJewels, ownedStamps,
    earnedInsignia, ownedNFTs, ownedIslands,
    getTotalItemsValue, resetItems
  } = useItems();

  //  Forbes list toggle
  const [showForbes, setShowForbes] = useState(false);
  //  Reset confirmation
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState('');

  //CALCULATIONS
  // Stock portfolio value
  const stockPortfolioValue = ownedStocks.reduce((sum, owned) => {
    const price = stockPriceHistory[owned.stockId] || 0;
    return sum + (price * owned.quantity);
  }, 0);

  // Crypto portfolio value
  const cryptoPortfolioValue = ownedCrypto.reduce((sum, owned) => {
    const price = cryptoPriceHistory[owned.cryptoId] || 0;
    return sum + (price * owned.quantity);
  }, 0);

  // Property total value
  const propertyTotalValue = ownedProperties.reduce((sum, prop) => {
    return sum + (prop.price || 0);
  }, 0);

  // Items total value
  const itemsTotalValue = getTotalItemsValue();

  // Business income
  const businessIncome = calculateTotalIncome();

  // Property rental income
  const rentalIncome = ownedProperties.reduce((sum, prop) => {
    let rental = prop.rentalIncomePerHour || 0;
    if (prop.improvements) {
      prop.improvements.forEach(imp => {
        rental += imp.bonusIncome || 0;
      });
    }
    return sum + rental;
  }, 0);

  // Total Net Worth — everything combined
  const totalNetWorth = balance + stockPortfolioValue + cryptoPortfolioValue
    + propertyTotalValue + itemsTotalValue;

  // Player's Forbes rank calculation
  const getPlayerForbesRank = () => {
    for (let i = 0; i < FORBES_LIST.length; i++) {
      if (totalNetWorth >= FORBES_LIST[i].netWorth) return i + 1;
    }
    return FORBES_LIST.length + 1;
  };
  const playerRank = getPlayerForbesRank();

  //  Level titles
  const getLevelTitle = (lvl) => {
    const titles = [
      'Beginner', 'Hustler', 'Trader', 'Investor', 'Businessman',
      'Entrepreneur', 'Mogul', 'Tycoon', 'Baron', 'Legend'
    ];
    return titles[Math.min(lvl - 1, titles.length - 1)];
  };

  //  Unique business types count
  const uniqueBusinessTypes = [...new Set(ownedBusinesses.map(b => b.businessId))].length;

  //  Total collections count
  const totalCollections = ownedCoins.length + ownedPaintings.length
    + ownedUniqueItems.length + ownedRetroCars.length
    + ownedJewels.length + ownedStamps.length;

  // Full reset handler
  const handleFullReset = () => {
    if (resetConfirmText !== 'RESET') return;
    resetGame();
    resetItems();
    setShowResetConfirm(false);
    setResetConfirmText('');
  };

  const c = isDarkTheme
    ? {
        bg: 'bg-gray-950', cardBg: 'bg-gray-900', border: 'border-gray-700/50',
        text: 'text-white', textSec: 'text-gray-400', innerBg: 'bg-gray-800',
        innerBorder: 'border-gray-700', gradient: 'from-gray-800 to-gray-900',
        dangerBg: 'bg-red-900/20', dangerBorder: 'border-red-800'
      }
    : {
        bg: 'bg-gray-50', cardBg: 'bg-white', border: 'border-gray-200',
        text: 'text-gray-900', textSec: 'text-gray-500', innerBg: 'bg-gray-100',
        innerBorder: 'border-gray-200', gradient: 'from-blue-50 to-indigo-50',
        dangerBg: 'bg-red-50', dangerBorder: 'border-red-200'
      };

  const StatCard = ({ icon: Icon, label, value, subValue, color, iconBg }) => (
    <div className={`${c.cardBg} border ${c.border} rounded-2xl p-3 transition-colors duration-300`}>
      <div className="flex items-center gap-2 mb-1.5">
        <div className={`p-1.5 rounded-lg ${iconBg || 'bg-blue-500/10'}`}>
          <Icon className={`w-3.5 h-3.5 ${color || 'text-blue-500'}`} />
        </div>
        <span className={`text-[10px] font-medium ${c.textSec}`}>{label}</span>
      </div>
      <p className={`text-sm font-bold ${c.text}`}>{value}</p>
      {subValue && (
        <p className={`text-[10px] ${c.textSec} mt-0.5`}>{subValue}</p>
      )}
    </div>
  );

  // Progress stat helper — "5 out of 10" style
  const ProgressStat = ({ emoji, label, owned, total, color }) => (
    <div className={`flex items-center justify-between py-2.5 border-b ${c.innerBorder} last:border-b-0`}>
      <div className="flex items-center gap-2.5">
        <span className="text-lg">{emoji}</span>
        <span className={`text-xs font-medium ${c.text}`}>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-20 h-1.5 rounded-full bg-gray-700/50 overflow-hidden">
          <div
            className={`h-full rounded-full ${color || 'bg-blue-500'} transition-all duration-500`}
            style={{ width: `${total > 0 ? Math.min((owned / total) * 100, 100) : 0}%` }}
          />
        </div>
        <span className={`text-[11px] font-bold ${c.textSec} min-w-[45px] text-right`}>
          {owned}/{total}
        </span>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${c.bg} transition-colors duration-300 pb-2`}>
      <div className="max-w-full mx-auto pt-2">

        <div className={`mx-2 mb-4 p-5 rounded-2xl border bg-gradient-to-br ${c.gradient} ${c.border}`}>
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500
              flex items-center justify-center shadow-lg shadow-orange-500/20 flex-shrink-0">
              <Crown className="w-8 h-8 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <h2 className={`text-xl font-bold ${c.text}`}>
                Navo Udyogpati
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                <span className={`text-xs font-medium ${c.textSec}`}>
                  Level {level} — {getLevelTitle(level)}
                </span>
              </div>
              {playerRank <= FORBES_LIST.length && (
                <div className="flex items-center gap-1.5 mt-1">
                  <Trophy className="w-3 h-3 text-amber-500" />
                  <span className="text-[10px] font-bold text-amber-500">
                    Forbes Rank #{playerRank}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Net Worth */}
          <div className={`mt-4 p-3 rounded-xl ${c.innerBg} border ${c.innerBorder}`}>
            <p className={`text-[10px] ${c.textSec} mb-0.5`}>Total Net Worth</p>
            <p className="text-2xl font-black text-green-500">
              {formatCurrency(totalNetWorth)}
            </p>
          </div>
        </div>

        <div className="mx-2 mb-4">
          <p className={`text-xs font-bold ${c.textSec} uppercase tracking-wider mb-2 px-1`}>
            💰 Wealth Breakdown
          </p>
          <div className="grid grid-cols-2 gap-2">
            <StatCard
              icon={IndianRupee}
              label="Cash Balance"
              value={formatCurrency(balance)}
              color="text-green-500"
              iconBg="bg-green-500/10"
            />
            <StatCard
              icon={Briefcase}
              label="Business Value"
              value={`${formatCurrency(businessIncome)}/hr`}
              subValue={`${ownedBusinesses.length} businesses`}
              color="text-blue-500"
              iconBg="bg-blue-500/10"
            />
            <StatCard
              icon={TrendingUp}
              label="Stock Portfolio"
              value={formatCurrency(stockPortfolioValue)}
              subValue={`${ownedStocks.length} stocks`}
              color="text-emerald-500"
              iconBg="bg-emerald-500/10"
            />
            <StatCard
              icon={Home}
              label="Real Estate"
              value={formatCurrency(propertyTotalValue)}
              subValue={`${formatCurrency(rentalIncome)}/hr rental`}
              color="text-orange-500"
              iconBg="bg-orange-500/10"
            />
            <StatCard
              icon={Coins}
              label="Crypto Holdings"
              value={formatCurrency(cryptoPortfolioValue)}
              subValue={`${ownedCrypto.length} coins`}
              color="text-purple-500"
              iconBg="bg-purple-500/10"
            />
            <StatCard
              icon={ShoppingBag}
              label="Items & Assets"
              value={formatCurrency(itemsTotalValue)}
              subValue={`${ownedCars.length + ownedAircraft.length + ownedYachts.length} vehicles`}
              color="text-pink-500"
              iconBg="bg-pink-500/10"
            />
          </div>
        </div>

        <div className="mx-2 mb-4">
          <button
            onClick={() => setShowForbes(!showForbes)}
            className={`w-full ${c.cardBg} border ${c.border} rounded-2xl p-4
              flex items-center justify-between transition-all
              hover:scale-[1.01] active:scale-[0.99]`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <h3 className={`text-sm font-bold ${c.text}`}>Forbes Rich List</h3>
                <p className={`text-[11px] ${c.textSec}`}>
                  {playerRank <= FORBES_LIST.length
                    ? `You're ranked #${playerRank}!`
                    : 'Climb the leaderboard!'
                  }
                </p>
              </div>
            </div>
            {showForbes
              ? <ChevronUp className={`w-5 h-5 ${c.textSec}`} />
              : <ChevronDown className={`w-5 h-5 ${c.textSec}`} />
            }
          </button>

          {showForbes && (
            <div className={`mt-2 ${c.cardBg} border ${c.border} rounded-2xl overflow-hidden`}>
              {/* Player's entry if ranked */}
              {playerRank <= FORBES_LIST.length && (
                <div className={`p-3 border-b ${c.innerBorder} bg-gradient-to-r
                  ${isDarkTheme ? 'from-yellow-900/20 to-amber-900/20' : 'from-yellow-50 to-amber-50'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-black text-amber-500 w-7 text-center">
                        #{playerRank}
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500
                        flex items-center justify-center">
                        <Crown className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${c.text}`}>You (Navo Udyogpati)</p>
                        <p className={`text-[10px] ${c.textSec}`}>Business Empire</p>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-green-500">
                      {formatCurrency(totalNetWorth)}
                    </p>
                  </div>
                </div>
              )}

              {/* Forbes entries */}
              <div className="max-h-[350px] overflow-y-auto">
                {FORBES_LIST.map(person => {
                  //  Check if player should appear before/at this rank
                  const isPlayerAbove = playerRank === person.rank;

                  return (
                    <React.Fragment key={person.rank}>
                      {isPlayerAbove && playerRank > 0 && (
                        <div className={`px-3 py-1 text-center ${isDarkTheme ? 'bg-yellow-900/10' : 'bg-yellow-50'}`}>
                          <span className="text-[9px] font-bold text-amber-500">
                            ↑ YOU ARE HERE ↑
                          </span>
                        </div>
                      )}
                      <div className={`p-3 border-b ${c.innerBorder} last:border-b-0
                        flex items-center justify-between
                        ${person.rank <= 3 ? (isDarkTheme ? 'bg-gray-800/50' : 'bg-gray-50') : ''}`}>
                        <div className="flex items-center gap-3">
                          <span className={`text-sm font-black w-7 text-center
                            ${person.rank === 1 ? 'text-yellow-500' :
                              person.rank === 2 ? 'text-gray-400' :
                              person.rank === 3 ? 'text-amber-700' : c.textSec}`}>
                            #{person.rank}
                          </span>
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-600 to-gray-700
                            flex items-center justify-center text-lg">
                            {person.avatar}
                          </div>
                          <div>
                            <p className={`text-xs font-bold ${c.text}`}>{person.name}</p>
                            <p className={`text-[10px] ${c.textSec}`}>{person.industry}</p>
                          </div>
                        </div>
                        <p className={`text-xs font-bold ${c.text}`}>
                          {formatCurrency(person.netWorth)}
                        </p>
                      </div>
                    </React.Fragment>
                  );
                })}

                {/* Player at bottom if not ranked */}
                {playerRank > FORBES_LIST.length && (
                  <div className={`p-3 ${isDarkTheme ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-black w-7 text-center ${c.textSec}`}>
                          #{playerRank}
                        </span>
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500
                          flex items-center justify-center">
                          <Crown className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${c.text}`}>You (Navo Udyogpati)</p>
                          <p className={`text-[10px] text-amber-500`}>Keep growing!</p>
                        </div>
                      </div>
                      <p className="text-xs font-bold text-green-500">
                        {formatCurrency(totalNetWorth)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mx-2 mb-4">
          <p className={`text-xs font-bold ${c.textSec} uppercase tracking-wider mb-2 px-1`}>
            📊 Statistics
          </p>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className={`${c.cardBg} border ${c.border} rounded-xl p-2.5 text-center`}>
              <p className="text-lg font-black text-yellow-500">{level}</p>
              <p className={`text-[9px] ${c.textSec}`}>Level</p>
            </div>
            <div className={`${c.cardBg} border ${c.border} rounded-xl p-2.5 text-center`}>
              <p className="text-lg font-black text-blue-500">{totalClicks.toLocaleString()}</p>
              <p className={`text-[9px] ${c.textSec}`}>Total Taps</p>
            </div>
            <div className={`${c.cardBg} border ${c.border} rounded-xl p-2.5 text-center`}>
              <p className="text-lg font-black text-green-500">₹{currentPerClick}</p>
              <p className={`text-[9px] ${c.textSec}`}>Per Tap</p>
            </div>
          </div>

          {/* Detailed Progress Stats */}
          <div className={`${c.cardBg} border ${c.border} rounded-2xl p-4`}>
            <h4 className={`text-xs font-bold ${c.text} mb-3 flex items-center gap-1.5`}>
              <BarChart3 className="w-3.5 h-3.5 text-blue-500" />
              Progress Overview
            </h4>

            <ProgressStat emoji="🏢" label="Business Types"
              owned={uniqueBusinessTypes} total={BUSINESSES.length} color="bg-blue-500" />
            <ProgressStat emoji="🏠" label="Properties"
              owned={ownedProperties.length} total={PROPERTIES.length} color="bg-orange-500" />
            <ProgressStat emoji="📈" label="Stocks Owned"
              owned={ownedStocks.length} total={STOCKS.length} color="bg-green-500" />
            <ProgressStat emoji="₿" label="Crypto Coins"
              owned={ownedCrypto.length} total={CRYPTOCURRENCIES.length} color="bg-purple-500" />
            <ProgressStat emoji="🚗" label="Cars"
              owned={ownedCars.length} total={8} color="bg-red-500" />
            <ProgressStat emoji="✈️" label="Aircraft"
              owned={ownedAircraft.length} total={6} color="bg-indigo-500" />
            <ProgressStat emoji="🚢" label="Yachts"
              owned={ownedYachts.length} total={5} color="bg-cyan-500" />
            <ProgressStat emoji="🎨" label="Collections"
              owned={totalCollections} total={42} color="bg-amber-500" />
            <ProgressStat emoji="🖼️" label="NFTs"
              owned={ownedNFTs.length} total={8} color="bg-pink-500" />
            <ProgressStat emoji="🏝️" label="Islands"
              owned={ownedIslands.length} total={7} color="bg-emerald-500" />
            <ProgressStat emoji="🏆" label="Insignia"
              owned={earnedInsignia.length} total={8} color="bg-yellow-500" />
            <ProgressStat emoji="🤝" label="Mergers"
              owned={mergedBusinesses.length} total={8} color="bg-violet-500" />
          </div>
        </div>

        <div className="mx-2 mb-4">
          <p className={`text-xs font-bold ${c.textSec} uppercase tracking-wider mb-2 px-1`}>
            💵 Income Sources
          </p>
          <div className={`${c.cardBg} border ${c.border} rounded-2xl p-4 space-y-2.5`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">🖱️</span>
                <span className={`text-xs ${c.text}`}>Click Income</span>
              </div>
              <span className="text-xs font-bold text-yellow-500">₹{currentPerClick}/click</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">🏢</span>
                <span className={`text-xs ${c.text}`}>Business Income</span>
              </div>
              <span className="text-xs font-bold text-blue-500">{formatCurrency(businessIncome)}/hr</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">🏠</span>
                <span className={`text-xs ${c.text}`}>Rental Income</span>
              </div>
              <span className="text-xs font-bold text-orange-500">{formatCurrency(rentalIncome)}/hr</span>
            </div>
            <div className={`flex items-center justify-between pt-2 border-t ${c.innerBorder}`}>
              <span className={`text-xs font-bold ${c.text}`}>Total Passive</span>
              <span className="text-sm font-bold text-green-500">
                {formatCurrency(businessIncome + rentalIncome)}/hr
              </span>
            </div>
          </div>
        </div>

        <div className="mx-2 mb-4">
          <p className={`text-xs font-bold text-red-500 uppercase tracking-wider mb-2 px-1`}>
            ⚠️ Danger Zone
          </p>
          <div className={`${c.dangerBg} border ${c.dangerBorder} rounded-2xl p-4`}>
            <div className="flex items-start gap-3 mb-3">
              <Trash2 className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-red-500">Reset Everything</h4>
                <p className={`text-[10px] ${c.textSec} mt-0.5`}>
                  This will permanently delete all your progress — balance, businesses,
                  investments, items, everything. This cannot be undone.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full py-2.5 rounded-xl text-sm font-bold
                bg-red-500/10 text-red-500 border border-red-500/30
                hover:bg-red-500/20 active:scale-[0.98] transition-all"
            >
              Reset All Progress
            </button>
          </div>
        </div>

        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4">
            <div className={`${isDarkTheme ? 'bg-gray-900' : 'bg-white'} rounded-2xl p-5
              max-w-sm w-full border ${c.border}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-red-500">Confirm Reset</h3>
                <button
                  onClick={() => { setShowResetConfirm(false); setResetConfirmText(''); }}
                  className={`p-1.5 rounded-full ${c.innerBg}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className={`p-3 rounded-xl mb-4 ${c.dangerBg} border ${c.dangerBorder}`}>
                <p className={`text-xs ${c.textSec}`}>
                  You will lose:
                </p>
                <ul className={`text-xs ${c.text} mt-1.5 space-y-0.5`}>
                  <li>• Balance: {formatCurrency(balance)}</li>
                  <li>• {ownedBusinesses.length} businesses</li>
                  <li>• {ownedStocks.length} stocks, {ownedCrypto.length} crypto</li>
                  <li>• {ownedProperties.length} properties</li>
                  <li>• All cars, aircraft, yachts, collections</li>
                  <li>• All insignia and achievements</li>
                </ul>
              </div>

              <div className="mb-4">
                <label className={`text-xs font-medium ${c.textSec} mb-1.5 block`}>
                  Type <span className="font-bold text-red-500">RESET</span> to confirm:
                </label>
                <input
                  type="text"
                  value={resetConfirmText}
                  onChange={(e) => setResetConfirmText(e.target.value.toUpperCase())}
                  className={`w-full px-4 py-2.5 rounded-xl border-2 text-sm font-mono
                    ${c.innerBg} ${c.innerBorder} ${c.text}
                    focus:border-red-500 focus:outline-none transition-colors`}
                  placeholder="Type RESET"
                  maxLength={5}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowResetConfirm(false); setResetConfirmText(''); }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium
                    ${c.innerBg} ${c.text}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleFullReset}
                  disabled={resetConfirmText !== 'RESET'}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all
                    ${resetConfirmText === 'RESET'
                      ? 'bg-red-500 text-white hover:bg-red-600 active:scale-95'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}
                >
                  Delete Everything
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Profile;