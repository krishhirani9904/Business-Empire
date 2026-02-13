// src/components/investing/MiniChart.jsx
import React, { useMemo } from 'react';
import { generateChartData } from './investingData';

function MiniChart({ basePrice, volatility, width = 120, height = 40 }) {
  const data = useMemo(
    () => generateChartData(basePrice, volatility, 20),
    [basePrice, volatility]
  );

  const prices = data.map(d => d.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;

  const isUp = prices[prices.length - 1] >= prices[0];

  const points = prices
    .map((p, i) => {
      const x = (i / (prices.length - 1)) * width;
      const y = height - ((p - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg
      width={width}
      height={height}
      className="overflow-visible"
      role="img"
      aria-label={`Price chart showing ${isUp ? 'upward' : 'downward'} trend`}
    >
      <polyline
        points={points}
        fill="none"
        stroke={isUp ? '#22c55e' : '#ef4444'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default MiniChart;