import React, { useState, useEffect, useRef } from 'react';
import { IndianRupee, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ClickerZone = ({ onClick, isBoosted, perClick }) => {
  const { isDarkTheme } = useTheme();

  const [scale, setScale] = useState(1);
  const [floatingTexts, setFloatingTexts] = useState([]);

  // CONCEPT: useRef for timeout tracking
  // "timeoutsRef" naam raakhyu — built-in setTimeout override na thay
  const timeoutsRef = useRef([]);

  const colors = {
    dark: {
      textSecondary: 'text-gray-400',
      containerBg: 'bg-gray-900',
      containerBorder: 'border-gray-700'
    },
    light: {
      textSecondary: 'text-gray-500',
      containerBg: 'bg-gray-50',
      containerBorder: 'border-gray-200'
    }
  };

  const c = isDarkTheme ? colors.dark : colors.light;

  // CONCEPT: CSS keyframes inject — only once
  useEffect(() => {
    const styleId = 'clicker-zone-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes floatUp {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          50% { opacity: 0.8; transform: translateY(-30px) scale(1.1); }
          100% { opacity: 0; transform: translateY(-60px) scale(0.9); }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // CONCEPT: Cleanup all timeouts on unmount (memory leak prevention)
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(id => clearTimeout(id));
      timeoutsRef.current = [];
    };
  }, []);

  // Handle both touch and mouse coordinates
  const getEventCoordinates = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    // Touch event check (mobile)
    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
        rect
      };
    }

    // Mouse event (desktop)
    if (e.clientX !== 0 || e.clientY !== 0) {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        rect
      };
    }

    // Fallback: center of button (keyboard click / screen reader)
    return {
      x: rect.width / 2,
      y: rect.height / 2,
      rect
    };
  };

  // CONCEPT: Event Handler with Event Object
  const handleClick = (e) => {
    // Button shrink animation
    setScale(0.92);
    const scaleTimerId = window.setTimeout(() => setScale(1), 100);
    timeoutsRef.current.push(scaleTimerId);

    // Coordinates for floating text position
    const { x, y, rect } = getEventCoordinates(e);

    // Floating text create
    const newFloatingText = {
      id: Date.now() + Math.random(),
      x: Math.max(20, Math.min(x + (Math.random() * 20 - 10), rect.width - 40)),
      y: y,
      value: perClick
    };

    // CONCEPT: Functional setState with Array spread
    setFloatingTexts(prev => [...prev, newFloatingText]);

    // 1 second baad floating text remove karo
    const floatTimerId = window.setTimeout(() => {
      setFloatingTexts(prev => prev.filter(ft => ft.id !== newFloatingText.id));
      timeoutsRef.current = timeoutsRef.current.filter(id => id !== floatTimerId);
    }, 1000);

    timeoutsRef.current.push(floatTimerId);

    // Parent nu onClick call karo (handleTap from GameContext)
    onClick();
  };

  return (
    <div className={`${c.containerBg} rounded-xl sm:rounded-2xl p-4 sm:p-6 
      border ${c.containerBorder} transition-colors duration-300`}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="relative">

          {/* CONCEPT: Array.map() for Dynamic Floating Text Elements */}
          {floatingTexts.map(ft => (
            <div
              key={ft.id}
              className={`absolute pointer-events-none z-20 font-bold 
                text-base sm:text-lg whitespace-nowrap
                ${isBoosted ? 'text-purple-300' : 'text-green-400'}`}
              style={{
                left: ft.x,
                top: ft.y,
                animation: 'floatUp 1s ease-out forwards'
              }}
            >
              +₹{ft.value}
            </div>
          ))}

          {/* Main Tap Button */}
          <button
            onClick={handleClick}
            style={{ transform: `scale(${scale})` }}
            className={`
              relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48
              rounded-full flex flex-col items-center justify-center
              shadow-2xl transition-transform duration-100 ease-out border-4
              active:scale-95 cursor-pointer select-none touch-manipulation
              overflow-visible
              ${isBoosted
                ? 'bg-gradient-to-br from-purple-400 to-purple-600 border-purple-300 shadow-purple-500/40'
                : 'bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-300 shadow-orange-500/40'
              }
            `}
            onContextMenu={(e) => e.preventDefault()}
          >
            {/* Inner glow effect */}
            <div className="absolute inset-2 rounded-full bg-white/10 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center pointer-events-none">
              <div className="bg-white/20 p-2.5 sm:p-3 md:p-4 rounded-full mb-1.5 sm:mb-2">
                {isBoosted ? (
                  <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" strokeWidth={2.5} />
                ) : (
                  <IndianRupee className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" strokeWidth={2.5} />
                )}
              </div>
              <span className="text-white font-black text-sm sm:text-base md:text-lg drop-shadow-md">
                {isBoosted ? '2X BOOST!' : 'TAP KARO!'}
              </span>
            </div>
          </button>
        </div>

        <p className={`mt-3 sm:mt-4 ${c.textSecondary} text-xs sm:text-sm text-center select-none`}>
          {isBoosted ? '⚡ Boost Active!' : `Tap to earn ₹${perClick}`}
        </p>
      </div>
    </div>
  );
};

export default ClickerZone;