// Dark/Light theme manage kare globally
// CONCEPT: Context API for global state management
import { createContext, useContext, useState, useEffect } from 'react';

// CONCEPT: createContext
// Context = Ek "global box" je data store kare
// Koi pan component aa box ma thi data vaanchi sake
const ThemeContext = createContext();

const THEME_STORAGE_KEY = 'business_samrajya_theme';

// CONCEPT: Provider Component
// Provider = Data bharvanu kaam kare
// Je component Provider ni andar hoy, te badha data access kari sake
export function ThemeProvider({ children }) {
  // CONCEPT: useState with Lazy Initialization
  // localStorage thi theme read kare - fakat first render ma
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  // CONCEPT: useEffect for Side Effects
  // Theme change thay tyaare localStorage ma save karo
  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(isDarkTheme));
    } catch (e) {
      console.error('Theme save error:', e);
    }
  }, [isDarkTheme]);

  // Theme toggle kare: true ↔ false
  const toggleTheme = () => {
    setIsDarkTheme(prev => !prev);
  };

  // CONCEPT: Context Provider + value prop
  // value = je data share karvanu che te object
  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// CONCEPT: Custom Hook
// useContext nu simple wrapper
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}