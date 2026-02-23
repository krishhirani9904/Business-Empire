import { useTheme } from '../context/ThemeContext';
import { useGame } from '../context/GameContext';
import StatsDisplay from '../components/earnings/StatsDisplay';
import LevelSystem from '../components/earnings/LevelSystem';
import AdBooster from '../components/earnings/AdBooster';
import ClickerZone from '../components/earnings/ClickerZone';
import AdBanner from '../components/earnings/AdBanner';

function Earnings() {
  const { isDarkTheme } = useTheme();

  const {
    balance,
    level,
    upgradeCost,
    currentPerClick,
    earningsBoostActive,
    handleTap,
    handleUpgrade,
    addBonus
  } = useGame();

  const colors = {
    dark: { bg: 'bg-gray-950', textPrimary: 'text-white' },
    light: { bg: 'bg-white', textPrimary: 'text-gray-900' }
  };

  const c = isDarkTheme ? colors.dark : colors.light;

  return (
    <div className={`min-h-screen ${c.bg} transition-colors duration-300 pb-2`}>
      <div className="max-w-full mx-auto pt-2">

        <div className="mb-4 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
            <span className={c.textPrimary}>Navo </span>
            <span className="text-yellow-500">Udyogpati</span>
          </h2>
          <p className={`text-xs sm:text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
            Tap, Earn & Grow Your Empire
          </p>
        </div>

        <StatsDisplay
          balance={balance}
          perClick={currentPerClick}
          isBoosted={earningsBoostActive}
        />

        <LevelSystem
          level={level}
          balance={balance}
          upgradeCost={upgradeCost}
          onUpgrade={handleUpgrade}
        />

        <ClickerZone
          onClick={handleTap}
          isBoosted={earningsBoostActive}
          perClick={currentPerClick}
        />

        <AdBooster />

      </div>

      <AdBanner
        onAdComplete={() => addBonus(50)}
        adDuration={5}
        rewardAmount={50}
      />
    </div>
  );
}

export default Earnings;