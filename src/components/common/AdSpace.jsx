import { useEffect, useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../design/tokens';
import useGameAds from '../../hooks/useGameAds';

function AdSpace() {
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { sdkReady } = useGameAds();
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    const isLocalhost = 
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.includes('192.168') ||
      window.location.hostname.includes('10.');
    
    setIsDev(isLocalhost);

    // Console clean - single message
    if (isLocalhost && sdkReady) {
      console.log("💡 Ads Development Mode Active");
    }
  }, [sdkReady]);

  return (
    <div 
      className={`flex-shrink-0 mx-2 mb-2 rounded-xl overflow-hidden
        ${t.bg.card} border ${t.border.default} transition-all duration-300`}>
      
      <div className={`h-14 flex items-center justify-center
        ${isDark ? 'bg-gradient-to-r from-gray-800/50 to-gray-700/50' : 'bg-gradient-to-r from-gray-100 to-gray-50'}`}>
        
        {!sdkReady ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin text-lg">⏳</div>
            <span className={`text-xs ${t.text.tertiary}`}>
              Loading Ad SDK...
            </span>
          </div>
        ) : isDev ? (
          <div className="flex items-center gap-3 px-4">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full
              ${isDark ? 'bg-blue-900/40 border border-blue-500/30' : 'bg-blue-100 border border-blue-300'}`}>
              <span className="text-xs">🎮</span>
              <span className={`text-xs font-medium ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                Ad Space
              </span>
            </div>
            <span className={`text-[10px] ${t.text.tertiary}`}>
              Development Mode
            </span>
          </div>
        ) : (
          <span className={`text-xs ${t.text.tertiary}`}>
            Advertisement
          </span>
        )}
      </div>
    </div>
  );
}

export default AdSpace;
