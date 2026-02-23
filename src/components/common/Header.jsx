import { Crown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

function Header() {
  const { isDarkTheme } = useTheme();

  //  Style Object Organization
  const themeColors = {
    dark: {
      headerBg: 'bg-gray-900',
      borderColor: 'border-gray-600',
      titleText: 'text-white',
      accentText: 'text-yellow-500'
    },
    light: {
      headerBg: 'bg-white',
      borderColor: 'border-gray-300',
      titleText: 'text-gray-900',
      accentText: 'text-yellow-600'
    }
  };

  const colors = isDarkTheme ? themeColors.dark : themeColors.light;

  return (
    <header
      className={`fixed rounded-b-3xl top-0 left-0 right-0
        ${colors.headerBg} border-b-2 ${colors.borderColor}
        transition-colors duration-300 z-50`}
    >
      <div className="max-w-full mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo & Title */}
          <div className="flex items-center space-x-2">
            <Crown className={`w-8 h-8 ${colors.accentText}`} />
            <div className="flex flex-col">
              <h1 className={`text-xl font-bold ${colors.titleText}`}>
                Business
                <span className={colors.accentText}> Samrajya</span>
              </h1>
              <span className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                Build Your Legacy
              </span>
            </div>
          </div>

          {/* Right Side - Theme Toggle */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>

        </div>
      </div>
    </header>
  );
}

export default Header;