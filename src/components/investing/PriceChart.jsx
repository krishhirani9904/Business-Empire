import React, { useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { generateChartData, formatINR } from './investingData';

function PriceChart({ basePrice, volatility, points = 30 }) {
  const { isDarkTheme } = useTheme();

  // useMemo — Chart data cache kare
  const data = useMemo(
    () => generateChartData(basePrice, volatility, points),
    [basePrice, volatility, points]
  );

  const prices = data.map((d) => d.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const isUp = prices[prices.length - 1] >= prices[0];

  // Chart dimensions
  const width = 300;
  const height = 150;
  const padding = 10;

  // Calculate SVG coordinate points
  const chartPoints = prices.map((p, i) => {
    const x = padding + (i / (prices.length - 1)) * (width - 2 * padding);
    // (1 - normalized) = Y axis invert karo (upar = high value)
    const y = padding + (1 - (p - min) / range) * (height - 2 * padding);
    return { x, y };
  });

  // Line points string for polyline
  const linePoints = chartPoints.map((p) => `${p.x},${p.y}`).join(' ');

  // Area Fill Points — Line + bottom corners for closed polygon
  const areaPoints =
    `${chartPoints[0].x},${height - padding} ` +   // Bottom left corner
    linePoints +                                     // All line points
    ` ${chartPoints[chartPoints.length - 1].x},${height - padding}`; // Bottom right corner

  // Colors based on up/down trend
  const color = isUp ? '#22c55e' : '#ef4444';
  const fillColor = isUp ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)';

  return (
    <div className="w-full">
      {/* SVG viewBox = Responsive chart iewBox defines coordinate system, width:100% scales it to container */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        preserveAspectRatio="none"
      >
        {/* Grid Lines — 5 horizontal lines for visual reference */}
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

        {/* Area Fill — Semi-transparent polygon below the line */}
        <polygon points={areaPoints} fill={fillColor} />

        {/* Price Line — Main chart line */}
        <polyline
          points={linePoints}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Current Price Dot — Last point par dot */}
        <circle
          cx={chartPoints[chartPoints.length - 1].x}
          cy={chartPoints[chartPoints.length - 1].y}
          r="4"
          fill={color}
          stroke="white"
          strokeWidth="2"
        />
      </svg>

      {/* Price Labels — Min, Current, Max */}
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