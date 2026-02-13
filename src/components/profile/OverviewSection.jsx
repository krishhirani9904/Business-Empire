// src/components/profile/OverviewSection.jsx

import React, { useState } from 'react';
import CashCard from './OverviewCards/CashCard';
import BusinessCard from './OverviewCards/BusinessCard';
import StocksCard from './OverviewCards/StocksCard';
import RealEstateCard from './OverviewCards/RealEstateCard';
import CryptoCard from './OverviewCards/CryptoCard';
import NetWorthBreakdown from './OverviewCards/NetWorthBreakdown';

const OverviewSection = ({ c, profileData }) => {
  const [expanded, setExpanded] = useState({
    businesses: false,
    stocks: false,
    properties: false,
    crypto: false,
  });

  const toggle = (key) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const {
    balance,
    businessSummary,
    stocksSummary,
    propertiesSummary,
    cryptoSummary,
    netWorth,
    ownedBusinesses,
    ownedStocks,
    ownedProperties,
    ownedCrypto,
    stockPriceHistory,
    cryptoPriceHistory,
  } = profileData;

  return (
    <div className="space-y-3">
      <CashCard balance={balance} c={c} />

      <BusinessCard
        businessSummary={businessSummary}
        ownedBusinesses={ownedBusinesses}
        expanded={expanded.businesses}
        onToggle={() => toggle('businesses')}
        c={c}
      />

      <StocksCard
        stocksSummary={stocksSummary}
        ownedStocks={ownedStocks}
        stockPriceHistory={stockPriceHistory}
        expanded={expanded.stocks}
        onToggle={() => toggle('stocks')}
        c={c}
      />

      <RealEstateCard
        propertiesSummary={propertiesSummary}
        ownedProperties={ownedProperties}
        expanded={expanded.properties}
        onToggle={() => toggle('properties')}
        c={c}
      />

      <CryptoCard
        cryptoSummary={cryptoSummary}
        ownedCrypto={ownedCrypto}
        cryptoPriceHistory={cryptoPriceHistory}
        expanded={expanded.crypto}
        onToggle={() => toggle('crypto')}
        c={c}
      />

      <NetWorthBreakdown
        balance={balance}
        stocksValue={stocksSummary.totalValue}
        realEstateValue={propertiesSummary.totalValue}
        cryptoValue={cryptoSummary.totalValue}
        netWorth={netWorth}
        c={c}
      />
    </div>
  );
};

export default OverviewSection;