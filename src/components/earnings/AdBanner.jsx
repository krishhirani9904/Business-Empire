import React, { useState, useEffect } from 'react';
import { X, Volume2, VolumeX } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// Static Data Outside Component
const demoGames = [
  { id: 1, name: 'Candy Crush Saga', icon: '🍬', gradient: 'from-pink-500 to-purple-600', tagline: 'Match 3 Fun!', installs: '1B+' },
  { id: 2, name: 'Temple Run 2', icon: '🏃', gradient: 'from-green-500 to-teal-600', tagline: 'Run Forever!', installs: '500M+' },
  { id: 3, name: 'Subway Surfers', icon: '🛹', gradient: 'from-yellow-500 to-orange-600', tagline: 'Endless Running!', installs: '1B+' },
  { id: 4, name: 'Clash of Clans', icon: '⚔️', gradient: 'from-blue-500 to-indigo-600', tagline: 'Build & Battle!', installs: '500M+' },
  { id: 5, name: 'PUBG Mobile', icon: '🎯', gradient: 'from-amber-500 to-red-600', tagline: 'Battle Royale!', installs: '1B+' }
];

const AdBanner = ({ onAdComplete, adDuration = 5, rewardAmount = 50 }) => {
  const { isDarkTheme } = useTheme();

  const [adState, setAdState] = useState('idle');
  const [countdown, setCountdown] = useState(adDuration);
  const [isMuted, setIsMuted] = useState(true);
  const [canSkip, setCanSkip] = useState(false);
  const [rewardCollected, setRewardCollected] = useState(false);

  const colors = {
    dark: {
      cardBg: 'bg-gray-900',
      cardBorder: 'border-gray-700',
      innerBg: 'bg-gray-800',
      innerBorder: 'border-gray-600',
      textPrimary: 'text-white',
      textSecondary: 'text-gray-400'
    },
    light: {
      cardBg: 'bg-white',
      cardBorder: 'border-gray-300',
      innerBg: 'bg-gray-100',
      innerBorder: 'border-gray-200',
      textPrimary: 'text-gray-900',
      textSecondary: 'text-gray-500'
    }
  };

  const c = isDarkTheme ? colors.dark : colors.light;

  const [currentGame] = useState(() =>
    demoGames[Math.floor(Math.random() * demoGames.length)]
  );

  useEffect(() => {
    let timer;
    if (adState === 'playing' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setAdState('completed');
            setCanSkip(true);
            setRewardCollected(false);
            return 0;
          }
          if (prev <= 3) setCanSkip(true);
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [adState, countdown]);

  const handleStartAd = () => {
    setAdState('playing');
    setCountdown(adDuration);
    setCanSkip(false);
    setRewardCollected(false);
  };

  const handleSkip = () => {
    if (canSkip && !rewardCollected) {
      setRewardCollected(true);
      onAdComplete?.();
      setAdState('idle');
      setCountdown(adDuration);
    }
  };

  const handleContinue = () => {
    if (!rewardCollected) {
      setRewardCollected(true);
      onAdComplete?.();
    }
    setAdState('idle');
    setCountdown(adDuration);
  };

  const handleInstall = () => {
    alert(`Redirecting to ${currentGame.name} on Play Store...`);
  };

  return (
    <>
      <div
        className={`
          fixed bottom-16 sm:bottom-20 md:bottom-20 left-0 right-0
          ${c.cardBg} border-t ${c.cardBorder}
          transition-all duration-300 z-40
        `}
      >
        <div className="max-w-full mx-auto px-2 sm:px-4">

          {/* IDLE STATE */}
          {adState === 'idle' && (
            <div className="py-1 sm:py-3 cursor-pointer" onClick={handleStartAd}>
              <div className="flex items-center justify-between gap-2 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="flex-shrink-0">
                    <span className={`${c.textSecondary} text-[8px] sm:text-[10px] 
                      bg-gray-500/50 px-1.5 py-0.5 rounded`}>
                      AD
                    </span>
                  </div>
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r 
                    ${currentGame.gradient} rounded-xl flex items-center justify-center 
                    text-xl sm:text-2xl flex-shrink-0 shadow-lg`}
                  >
                    {currentGame.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className={`${c.textPrimary} font-bold text-xs sm:text-sm truncate`}>
                      {currentGame.name}
                    </h4>
                    <p className={`${c.textSecondary} text-[10px] sm:text-xs truncate`}>
                      {currentGame.tagline} • ⭐ 4.5 • {currentGame.installs}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleInstall(); }}
                  className="bg-green-500 hover:bg-green-600 text-white 
                    px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg font-bold 
                    text-xs sm:text-sm transition-colors flex-shrink-0"
                >
                  Install
                </button>
              </div>
            </div>
          )}

          {/* PLAYING STATE */}
          {adState === 'playing' && (
            <div className="py-2 sm:py-3">
              <div className="flex items-center justify-between gap-2 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r 
                    ${currentGame.gradient} rounded-xl flex items-center justify-center 
                    text-xl sm:text-2xl flex-shrink-0 shadow-lg animate-pulse`}
                  >
                    {currentGame.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className={`${c.textPrimary} font-bold text-xs sm:text-sm truncate`}>
                      {currentGame.name}
                    </h4>
                    <div className="flex items-center gap-2">
                      <p className="text-yellow-500 text-[10px] sm:text-xs font-medium">
                        Watching Ad...
                      </p>
                      <div className="flex-1 h-1 bg-gray-700 rounded-full max-w-[60px] sm:max-w-[100px]">
                        <div
                          className="h-full bg-yellow-500 rounded-full transition-all duration-1000"
                          style={{ width: `${((adDuration - countdown) / adDuration) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`w-8 h-8 ${c.innerBg} rounded-full 
                      flex items-center justify-center`}
                  >
                    {isMuted
                      ? <VolumeX className={`w-4 h-4 ${c.textSecondary}`} />
                      : <Volume2 className={`w-4 h-4 ${c.textSecondary}`} />
                    }
                  </button>

                  {canSkip ? (
                    <button
                      onClick={handleSkip}
                      className="bg-red-500 hover:bg-red-600 text-white 
                        px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium 
                        text-xs sm:text-sm transition-colors flex items-center gap-1"
                    >
                      Skip <X className="w-3 h-3" />
                    </button>
                  ) : (
                    <div className={`${c.innerBg} border ${c.innerBorder} 
                      text-yellow-500 px-3 sm:px-4 py-1.5 sm:py-2 
                      rounded-lg font-mono text-xs sm:text-sm`}
                    >
                      {countdown}s
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {adState === 'completed' && (
            <div className="py-2 sm:py-3">
              <div className="flex items-center justify-between gap-2 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 
                    rounded-xl flex items-center justify-center text-xl 
                    sm:text-2xl flex-shrink-0 shadow-lg"
                  >
                    ✅
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className={`${c.textPrimary} font-bold text-xs sm:text-sm`}>
                      Reward Earned!
                    </h4>
                    <p className="text-green-500 text-[10px] sm:text-xs font-medium">
                      +₹{rewardAmount} Bonus Added
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleContinue}
                  className="bg-blue-500 hover:bg-blue-600 text-white 
                    px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg font-bold 
                    text-xs sm:text-sm transition-colors flex-shrink-0"
                >
                  Continue
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="h-16 sm:h-20 md:h-20" />
    </>
  );
};

export default AdBanner;