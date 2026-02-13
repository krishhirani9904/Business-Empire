import { useLocation, useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Briefcase, 
  IndianRupee, 
  ShoppingBag, 
  User
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkTheme } = useTheme();

  const menuItems = [
    { 
      name: 'Investing', 
      path: '/investing',
      icon: TrendingUp, 
      activeColor: 'bg-green-500', 
      activeTextLight: 'text-green-600' 
    },
    { 
      name: 'Business', 
      path: '/business',
      icon: Briefcase, 
      activeColor: 'bg-blue-500', 
      activeTextLight: 'text-blue-600' 
    },
    { 
      name: 'Earnings', 
      path: '/earnings',
      icon: IndianRupee, 
      activeColor: 'bg-yellow-500', 
      activeTextLight: 'text-yellow-600' 
    },
    { 
      name: 'Items', 
      path: '/items',
      icon: ShoppingBag, 
      activeColor: 'bg-purple-500', 
      activeTextLight: 'text-purple-600' 
    },
    { 
      name: 'Profile', 
      path: '/profile',
      icon: User, 
      activeColor: 'bg-pink-500', 
      activeTextLight: 'text-pink-600' 
    }
  ];

  const themeColors = {
    dark: {
      footerBg: 'bg-gray-900',
      borderColor: 'border-gray-700',
      iconBg: 'bg-gray-800',
      iconHoverBg: 'group-hover:bg-gray-700',
      inactiveText: 'text-gray-400',
      hoverText: 'group-hover:text-white'
    },
    light: {
      footerBg: 'bg-white',
      borderColor: 'border-gray-300',
      iconBg: 'bg-gray-100',
      iconHoverBg: 'group-hover:bg-gray-200',
      inactiveText: 'text-gray-500',
      hoverText: 'group-hover:text-gray-900'
    }
  };

  const colors = isDarkTheme ? themeColors.dark : themeColors.light;

  const isActive = (path) => {
    if (location.pathname === '/' && path === '/earnings') {
      return true;
    }
    return location.pathname === path;
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <footer 
      className={`
        fixed bottom-0 left-0 right-0 
        ${colors.footerBg} 
        border-t-2 ${colors.borderColor} 
        transition-colors duration-300 
        rounded-t-2xl sm:rounded-t-3xl
        z-50
        safe-area-bottom
      `}
    >
      <nav className="max-w-full mx-auto px-2 sm:px-4 lg:px-6">
        <ul className="flex justify-around items-center h-16 sm:h-18 md:h-20">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <li key={item.name} className="flex-1 min-w-0">
                <button
                  onClick={() => handleNavigation(item.path)}
                  className="
                    w-full flex flex-col items-center justify-center 
                    py-1 sm:py-2
                    space-y-0.5 sm:space-y-1 
                    transition-all duration-300 
                    group cursor-pointer
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500
                  "
                  aria-label={item.name}
                  aria-current={active ? 'page' : undefined}
                >
                  {/* Icon Container */}
                  <div 
                    className={`
                      p-1.5 sm:p-2 md:p-2.5
                      rounded-full 
                      transition-all duration-300 
                      ${active 
                        ? `${item.activeColor} scale-105 sm:scale-110 shadow-lg` 
                        : `${colors.iconBg} ${colors.iconHoverBg}`
                      }
                    `}
                  >
                    <Icon 
                      className={`
                        w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6
                        transition-colors duration-300
                        ${active 
                          ? 'text-white' 
                          : `${colors.inactiveText} ${colors.hoverText}`
                        }
                      `} 
                    />
                  </div>
                  
                  {/* Label */}
                  <span 
                    className={`
                      text-[10px] sm:text-xs md:text-sm
                      font-medium 
                      transition-colors duration-300 
                      truncate max-w-full px-1
                      ${active 
                        ? (isDarkTheme ? 'text-white' : item.activeTextLight)
                        : `${colors.inactiveText} ${colors.hoverText}`
                      }
                    `}
                  >
                    {item.name}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </footer>
  );
}

export default Navbar;