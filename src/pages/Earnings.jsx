import React, { useState, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import StatsDisplay from '../components/earnings/StatsDisplay';
import LevelSystem from '../components/earnings/LevelSystem';
import AdBooster from '../components/earnings/AdBooster';
import ClickerZone from '../components/earnings/ClickerZone';
import AdBanner from '../components/earnings/AdBanner';

function Earnings() {
  const { isDarkTheme } = useTheme();

  // Game State
  const [balance, setBalance] = useState(0);
  const [level, setLevel] = useState(1);
  const [baseClickRate, setBaseClickRate] = useState(1);
  const [upgradeCost, setUpgradeCost] = useState(100);

  // Boost State
  const [isBoostActive, setIsBoostActive] = useState(false);

  // Current earnings calculation
  const currentPerClick = isBoostActive ? baseClickRate * 2 : baseClickRate;

  // Handle Tap
  const handleTap = () => {
    setBalance(prev => prev + currentPerClick);
  };

  // Handle Level Up
  const handleUpgrade = () => {
    if (balance >= upgradeCost) {
      setBalance(prev => prev - upgradeCost);
      setLevel(prev => prev + 1);
      setBaseClickRate(prev => prev + 2);
      setUpgradeCost(prev => Math.floor(prev * 2.5));
    }
  };

  // Handle Boost
  const handleBoostChange = useCallback((status) => {
    setIsBoostActive(status);
  }, []);

  // Handle Ad Complete - Bonus reward
  const handleAdComplete = () => {
    setBalance(prev => prev + 50);
  };

  // Theme colors
  const colors = {
    dark: {
      bg: 'bg-gray-950',
      textPrimary: 'text-white'
    },
    light: {
      bg: 'bg-gray-0',
      textPrimary: 'text-gray-900'
    }
  };

  const c = isDarkTheme ? colors.dark : colors.light;

  return (
    <div className={`min-h-screen ${c.bg} transition-colors duration-300`}>
      <div className="w-full max-w-full mx-auto pt-2">
        
        {/* Page Title */}
        <div className="mb-4 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
            <span className={c.textPrimary}>Navo </span>
            <span className="text-yellow-500">Udyogpati</span>
          </h2>
          <p className={`text-xs sm:text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
            Tap, Earn & Grow Your Empire
          </p>
        </div>

        {/* Stats Display */}
        <StatsDisplay
          balance={balance}
          perClick={currentPerClick}
          isBoosted={isBoostActive}
        />

        {/* Level System */}
        <LevelSystem
          level={level}
          balance={balance}
          upgradeCost={upgradeCost}
          onUpgrade={handleUpgrade}
        />

        {/* Clicker Zone */}
        <ClickerZone
          onClick={handleTap}
          isBoosted={isBoostActive}
          perClick={currentPerClick}
        />

        {/* Ad Booster */}
        <AdBooster
          onBoostActivate={handleBoostChange}
        />
      </div>

      {/* Fixed Full Width Ad Banner - Above Navbar */}
      <AdBanner 
        onAdComplete={handleAdComplete}
        adDuration={5}
      />
    </div>
  );
}

export default Earnings;