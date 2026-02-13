// src/App.jsx
import React from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { GameProvider } from './context/GameContext';
import { ItemsProvider } from './context/ItemsContext';
import Header from './components/Header';
import Navbar from './components/navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OfflineEarningsPopup from './components/OfflineEarningsPopup';
import ErrorBoundary from './components/ErrorBoundary';

import Investing from './pages/Investing';
import Business from './pages/Business';
import Earnings from './pages/Earnings';
import Items from './pages/Items';
import Profile from './pages/Profile';

function AppContent() {
  const { isDarkTheme } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkTheme ? 'bg-gray-950' : 'bg-gray-50'
    }`}>
      <Header />
      <OfflineEarningsPopup />
      <main className="pt-20 pb-24 px-4">
        <Routes>
          <Route path="/" element={<Earnings />} />
          <Route path="/investing" element={<Investing />} />
          <Route path="/business" element={<Business />} />
          <Route path="/earnings" element={<Earnings />} />
          {/* <Route path="/items" element={<Items />} /> */}
          {/* <Route path="/profile" element={<Profile />} /> */}
        </Routes>
      </main>
      <Navbar />
    </div>
  );
}

const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <ThemeProvider>
          <GameProvider>
            <ItemsProvider>
              <AppContent />
            </ItemsProvider>
          </GameProvider>
        </ThemeProvider>
      </Router>
    </ErrorBoundary>
  );
};

export default App;