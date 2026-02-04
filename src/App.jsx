import { ThemeProvider, useTheme } from './context/ThemeContext';
import Header from './components/Header';
import Navbar from './components/navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Pages
import Investing from './pages/Investing';
import Business from './pages/Business';
import Earnings from './pages/Earnings';
import Items from './pages/Items';
import Profile from './pages/Profile';

// Main content wrapper with theme background
function AppContent() {
  const { isDarkTheme } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkTheme ? 'bg-gray-950' : 'bg-gray-50'
    }`}>
      <Header />
      
      {/* Main Content Area */}
      <main className="pt-20 pb-24 px-4">
        <Routes>
          <Route path="/" element={<Earnings />} />
          <Route path="/investing" element={<Investing />} />
          <Route path="/business" element={<Business />} />
          <Route path="/earnings" element={<Earnings />} />
          <Route path="/items" element={<Items />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      
      <Navbar />
    </div>
  );
}

const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Router>
  );
};

export default App;