// src/components/investing/PriceChart.jsx
import React, { useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { generateChartData, formatINR } from './investingData';

function PriceChart({ basePrice, volatility, points = 30 }) {
  const { isDarkTheme } = useTheme();
  const data = useMemo(
    () => generateChartData(basePrice, volatility, points),
    [basePrice, volatility, points]
  );

  const prices = data.map((d) => d.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const isUp = prices[prices.length - 1] >= prices[0];

  const width = 300;
  const height = 150;
  const padding = 10;

  const chartPoints = prices.map((p, i) => {
    const x = padding + (i / (prices.length - 1)) * (width - 2 * padding);
    const y = padding + (1 - (p - min) / range) * (height - 2 * padding);
    return { x, y };
  });

  const linePoints = chartPoints.map((p) => `${p.x},${p.y}`).join(' ');

  const areaPoints =
    `${chartPoints[0].x},${height - padding} ` +
    linePoints +
    ` ${chartPoints[chartPoints.length - 1].x},${height - padding}`;

  const color = isUp ? '#22c55e' : '#ef4444';
  const fillColor = isUp ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)';

  return (
    <div className="w-full" role="img" aria-label={`Price chart from ${formatINR(prices[0])} to ${formatINR(prices[prices.length - 1])}`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        preserveAspectRatio="none"
      >
        {[0, 1, 2, 3, 4].map((i) => {
          const y = padding + (i / 4) * (height - 2 * padding);
          return (
            <line
              key={i}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke={isDarkTheme ? '#374151' : '#e5e7eb'}
              strokeWidth="0.5"
            />
          );
        })}

        <polygon points={areaPoints} fill={fillColor} />

        <polyline
          points={linePoints}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <circle
          cx={chartPoints[chartPoints.length - 1].x}
          cy={chartPoints[chartPoints.length - 1].y}
          r="4"
          fill={color}
          stroke="white"
          strokeWidth="2"
        />
      </svg>

      <div className="flex justify-between mt-1 px-1">
        <span className={`text-[10px] ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>
          {formatINR(min)}
        </span>
        <span className={`text-[10px] font-semibold ${isUp ? 'text-green-500' : 'text-red-500'}`}>
          Current: {formatINR(prices[prices.length - 1])}
        </span>
        <span className={`text-[10px] ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>
          {formatINR(max)}
        </span>
      </div>
    </div>
  );
}

export default PriceChart;