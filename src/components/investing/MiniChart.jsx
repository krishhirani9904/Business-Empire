import React, { useMemo } from 'react';
import { generateChartData } from './investingData';

function MiniChart({ basePrice, volatility, width = 120, height = 40 }) {
  // Only recalculate jyaare basePrice ya volatility badle
  const data = useMemo(
    () => generateChartData(basePrice, volatility, 20),
    [basePrice, volatility]
  );

  // Extract just prices from data array
  const prices = data.map(d => d.price);

  // Min/Max for Y-axis scaling
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1; // Avoid division by 0

  // Is trend up or down? (last price vs first price)
  const isUp = prices[prices.length - 1] >= prices[0];

  // Generate SVG Points String
  // SVG polyline format: "x1,y1 x2,y2 x3,y3..."
  const points = prices.map((p, i) => {
    const x = (i / (prices.length - 1)) * width;
    // Y is inverted: Higher value = Lower Y position on screen
    const y = height - ((p - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  //  Array.join(' ') = Array ne string ma convert, space separated

  return (
    // SVG in React — attributes same as HTML SVG 
    <svg width={width} height={height} className="overflow-visible">
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
