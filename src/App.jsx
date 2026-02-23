import { ThemeProvider, useTheme } from './context/ThemeContext';
import { GameProvider } from './context/GameContext';
import { ItemsProvider } from './context/ItemsContext';
import Header from './components/common/Header';
import Navbar from './components/common/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OfflineEarningsPopup from './components/common/OfflineEarningsPopup';

// Pages
import Earnings from './pages/Earnings';
import Business from './pages/Business';
import Investing from './pages/Investing';
import Items from './pages/Items';
import Profile from './pages/Profile';

// CONCEPT: Separate Inner Component
// AppContent alag che because useTheme() use karvanu che
// useTheme() tayarej kaam kare jyaare ThemeProvider ni ANDAR hoy
function AppContent() {
  const { isDarkTheme } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkTheme ? 'bg-gray-950' : 'bg-gray-50'
    }`}>
      {/* Header - Top fixed bar */}
      <Header />

      {/* Offline earnings popup - App open thay tyaare dekhay */}
      <OfflineEarningsPopup />

      {/* Main Content Area */}
      {/* pt-20 = Header ni niche, pb-24 = Navbar ni upar */}
      <main className="pt-20 pb-24 px-4">
        <Routes>
          {/* path="/" = Home page → Earnings render kare */}
          <Route path="/" element={<Earnings />} />
          <Route path="/earnings" element={<Earnings />} />
          <Route path="/business" element={<Business />} />
          <Route path="/investing" element={<Investing />} />
          <Route path="/items" element={<Items />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>

      {/* Navbar - Bottom fixed bar */}
      <Navbar />
    </div>
  );
}

// Provider Wrapping Order
// Bahar thi andar: Router -> Theme -> Game -> AppContent
const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <GameProvider>
          <ItemsProvider>
            <AppContent />
          </ItemsProvider>
        </GameProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;