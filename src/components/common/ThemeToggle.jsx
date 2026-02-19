import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

function ThemeToggle() {
  // CONCEPT: Custom Hook Usage
  // Destructuring: isDarkTheme = boolean, toggleTheme = function
  const { isDarkTheme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      // CONCEPT: Dynamic className with Ternary
      className={`p-2 rounded-full transition-all duration-300 ${
        isDarkTheme
          ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
      }`}
      aria-label="Toggle theme"
    >
      {/* CONCEPT: Conditional Rendering */}
      {isDarkTheme ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}

export default ThemeToggle;