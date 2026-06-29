import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { STATION_TRAFFIC, ROUTE_TYPE_DISTRIBUTION, JOURNEY_DURATION_DISTRIBUTION } from '../data';
import KpiSummary from './KpiSummary';

export default function OverviewDashboard() {
  const [selectedDate, setSelectedDate] = useState('May 27, 2026');
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [hoveredDurationIndex, setHoveredDurationIndex] = useState<number | null>(null);

  // Constants for charts
  const stationMaxCount = Math.max(...STATION_TRAFFIC.map(s => s.count));
  const maxDurationCount = Math.max(...JOURNEY_DURATION_DISTRIBUTION.map(d => d.count));

  // Pie chart calculation
  let cumulativePercent = 0;
  const pieSlices = ROUTE_TYPE_DISTRIBUTION.map((slice, i) => {
    const startAngle = (cumulativePercent / 100) * 360;
    const endAngle = ((cumulativePercent + slice.percentage) / 100) * 360;
    cumulativePercent += slice.percentage;

    // Convert angles to SVG coordinates (center 150, 150, radius 100)
    const rad = Math.PI / 180;
    const x1 = 150 + 100 * Math.cos((startAngle - 90) * rad);
    const y1 = 150 + 100 * Math.sin((startAngle - 90) * rad);
    const x2 = 150 + 100 * Math.cos((endAngle - 90) * rad);
    const y2 = 150 + 100 * Math.sin((endAngle - 90) * rad);
    
    const largeArcFlag = slice.percentage > 50 ? 1 : 0;
    
    // Path for slice
    const pathData = `
      M 150 150
      L ${x1} ${y1}
      A 100 100 0 ${largeArcFlag} 1 ${x2} ${y2}
      Z
    `;

    // Mid angle for labels
    const midAngle = startAngle + (slice.percentage / 2);
    const labelX = 150 + 125 * Math.cos((midAngle - 90) * rad);
    const labelY = 150 + 125 * Math.sin((midAngle - 90) * rad);
    
    // Percentage text position (inside slice)
    const textX = 150 + 65 * Math.cos((midAngle - 90) * rad);
    const textY = 150 + 65 * Math.sin((midAngle - 90) * rad);

    return {
      ...slice,
      pathData,
      labelX,
      labelY,
      textX,
      textY,
      index: i
    };
  });

  return (
    <div id="overview-dashboard-root" className="flex-1 bg-zinc-950 overflow-y-auto p-8 font-sans text-zinc-50 dark-scrollbar">
      {/* Header */}
      <div id="overview-header" className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-zinc-100">Train Operations</h1>
          <p className="text-sm text-zinc-400">Sysslan Analytics - Complete operational logistics and fleet tracking</p>
        </div>
        
        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-xl border border-zinc-800 shadow-sm">
          <Calendar className="w-4 h-4 text-zinc-500" />
          <select 
            id="overview-date-select"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-sm font-medium text-zinc-300 bg-transparent border-none outline-none cursor-pointer pr-1"
          >
            <option value="May 27, 2026" className="bg-zinc-900 text-zinc-300">May 27, 2026</option>
            <option value="May 28, 2026" className="bg-zinc-900 text-zinc-300">May 28, 2026</option>
            <option value="May 29, 2026" className="bg-zinc-900 text-zinc-300">May 29, 2026</option>
          </select>
        </div>
      </div>

      {/* Interactive KPI Summary Section */}
      <KpiSummary />

      {/* Charts Grid */}
      <div id="overview-charts-middle" className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Route Type Distribution */}
        <div className="bento-card lg:col-span-5 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-zinc-100 font-display mb-1">Route Type Distribution</h2>
            <p className="text-xs text-zinc-500 mb-6 font-sans">Proportional analysis of all scheduled active routes</p>
          </div>

          {/* Custom SVG Pie Chart */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4">
            <div className="relative w-[280px] h-[280px]">
              <svg className="w-full h-full transform -rotate-6" viewBox="0 0 300 300">
                {pieSlices.map((slice) => {
                  const isHovered = hoveredSlice === slice.index;
                  return (
                    <g key={slice.name}>
                      <path
                        d={slice.pathData}
                        fill={slice.color}
                        className="transition-all duration-300 cursor-pointer origin-center"
                        style={{
                          transform: isHovered ? 'scale(1.04)' : 'scale(1)',
                          filter: isHovered ? 'drop-shadow(0px 8px 16px rgba(168,85,247,0.25))' : 'none',
                          opacity: hoveredSlice !== null && !isHovered ? 0.75 : 1
                        }}
                        onMouseEnter={() => setHoveredSlice(slice.index)}
                        onMouseLeave={() => setHoveredSlice(null)}
                      />
                      {/* Percent Tag inside slice */}
                      <text
                        x={slice.textX}
                        y={slice.textY}
                        fill="white"
                        fontSize="11px"
                        fontWeight="600"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="pointer-events-none select-none font-mono"
                      >
                        {slice.percentage}%
                      </text>
                      {/* Anchor outer labels */}
                      <text
                        x={slice.labelX}
                        y={slice.labelY}
                        fill="#a1a1aa"
                        fontSize="12px"
                        fontWeight="500"
                        textAnchor={slice.labelX > 150 ? 'start' : 'end'}
                        dominantBaseline="central"
                        className="pointer-events-none select-none font-sans"
                      >
                        {slice.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
              
              {/* Center Tooltip Info */}
              {hoveredSlice !== null && (
                <div className="absolute inset-0 m-auto w-24 h-24 bg-zinc-900 rounded-full shadow-lg border border-zinc-800 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-[10px] font-semibold text-zinc-500 font-sans">{ROUTE_TYPE_DISTRIBUTION[hoveredSlice].name}</span>
                  <span className="text-lg font-bold text-zinc-100 font-display">
                    {ROUTE_TYPE_DISTRIBUTION[hoveredSlice].percentage}%
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {ROUTE_TYPE_DISTRIBUTION[hoveredSlice].count} trains
                  </span>
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-3 shrink-0">
              {ROUTE_TYPE_DISTRIBUTION.map((item, index) => (
                <div 
                  key={item.name} 
                  className={`flex items-center gap-3 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    hoveredSlice === index ? 'bg-zinc-900 border border-zinc-800' : 'bg-transparent border border-transparent'
                  }`}
                  onMouseEnter={() => setHoveredSlice(index)}
                  onMouseLeave={() => setHoveredSlice(null)}
                >
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <div className="flex flex-col leading-none">
                    <span className="text-xs font-semibold text-zinc-300 font-sans">{item.name}</span>
                    <span className="text-[10px] text-zinc-500 font-mono mt-0.5">{item.percentage}% ({item.count})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Station Traffic Analysis */}
        <div className="bento-card lg:col-span-7 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-zinc-100 font-display mb-1">Station Traffic Analysis</h2>
            <p className="text-xs text-zinc-500 mb-6 font-sans">Active departures and arrivals counts across regional terminals</p>
          </div>

          {/* Interactive SVG Horizontal Bar Chart */}
          <div className="flex-1 min-h-[300px] flex flex-col justify-center relative">
            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {STATION_TRAFFIC.map((station, index) => {
                const widthPercent = (station.count / stationMaxCount) * 100;
                const isHovered = hoveredBarIndex === index;
                return (
                  <div 
                    key={station.name}
                    className="flex items-center gap-3 py-0.5 group"
                    onMouseEnter={() => setHoveredBarIndex(index)}
                    onMouseLeave={() => setHoveredBarIndex(null)}
                  >
                    {/* Station Name */}
                    <div className="w-28 text-right font-mono text-[11px] font-semibold text-zinc-400 truncate shrink-0">
                      {station.name}
                    </div>

                    {/* Bar Container */}
                    <div className="flex-1 h-5 bg-zinc-900 rounded-md overflow-hidden relative cursor-pointer border border-transparent hover:border-purple-500/20">
                      <div 
                        className="h-full rounded-md bg-gradient-to-r from-blue-600 to-purple-500 transition-all duration-500 ease-out flex items-center justify-end px-2"
                        style={{ 
                          width: `${widthPercent}%`,
                          filter: isHovered ? 'brightness(1.1)' : 'none'
                        }}
                      >
                        {/* Dynamic Count shown on larger bars */}
                        {widthPercent > 20 && (
                          <span className="text-[10px] font-mono font-bold text-white leading-none">
                            {station.count}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Outer label for smaller bars or fallback */}
                    {widthPercent <= 20 && (
                      <span className="text-[10px] font-mono text-zinc-500 w-10">
                        {station.count}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Custom Tooltip */}
            {hoveredBarIndex !== null && (
              <div className="absolute top-4 right-4 bg-zinc-950/95 text-white px-3 py-2 rounded-lg text-xs shadow-lg flex flex-col font-sans pointer-events-none border border-zinc-800">
                <span className="font-bold text-purple-400 font-mono">{STATION_TRAFFIC[hoveredBarIndex].name}</span>
                <span className="text-zinc-300 font-medium mt-0.5">Departures/Arrivals: {STATION_TRAFFIC[hoveredBarIndex].count}</span>
                <span className="text-[10px] text-zinc-500 mt-0.5 font-mono">
                  {((STATION_TRAFFIC[hoveredBarIndex].count / STATION_TRAFFIC.reduce((acc, c) => acc + c.count, 0)) * 100).toFixed(1)}% of all traffic
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Chart: Journey Duration Distribution */}
      <div id="overview-charts-bottom" className="bento-card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
          <div>
            <h2 className="text-lg font-bold text-zinc-100 font-display mb-1">Journey Duration Distribution</h2>
            <p className="text-xs text-zinc-500 font-sans">Histogram of scheduled journey durations in active operational nodes</p>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <span className="w-3 h-3 bg-gradient-to-tr from-blue-600 to-purple-500 rounded" />
              <span>Volume (Number of Trains)</span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-500">
              <span className="w-4 border-t-2 border-dashed border-rose-500/80" />
              <span>Mean Average (4.6h)</span>
            </div>
          </div>
        </div>

        {/* Custom interactive vertical bar chart */}
        <div className="relative h-64 mt-8 flex flex-col justify-end">
          {/* Chart Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pr-12 pb-8">
            {[4, 3, 2, 1, 0].map((grid, index) => {
              const maxLabelVal = Math.ceil(maxDurationCount / 10) * 10;
              const gridVal = Math.round((maxLabelVal / 4) * (4 - index));
              return (
                <div key={index} className="flex items-center w-full">
                  <div className="flex-1 border-b border-zinc-800/40" />
                  <span className="text-[9px] font-mono text-zinc-600 w-10 text-right select-none">{gridVal}</span>
                </div>
              );
            })}
          </div>

          {/* Bars Container */}
          <div className="relative h-[80%] flex items-end justify-between px-4 pb-8 pr-12">
            {JOURNEY_DURATION_DISTRIBUTION.map((bucket, index) => {
              const barHeightPercent = (bucket.count / maxDurationCount) * 100;
              const isHovered = hoveredDurationIndex === index;
              return (
                <div 
                  key={bucket.label} 
                  className="flex flex-col items-center flex-1 h-full justify-end group cursor-pointer"
                  onMouseEnter={() => setHoveredDurationIndex(index)}
                  onMouseLeave={() => setHoveredDurationIndex(null)}
                >
                  {/* Hover tooltip for individual bars */}
                  <div className="h-full w-[65%] flex items-end justify-center relative">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-600 to-purple-500 rounded-t-md transition-all duration-300 relative flex justify-center"
                      style={{ 
                        height: `${barHeightPercent}%`,
                        filter: isHovered ? 'drop-shadow(0px 4px 12px rgba(168,85,247,0.4))' : 'none'
                      }}
                    >
                      {/* Floating tag inside bar */}
                      {bucket.count > 10 && (
                        <span className="text-[9px] font-mono font-bold text-white mt-1 select-none pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                          {bucket.count}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bucket Label */}
                  <span className={`text-[10px] font-mono mt-2 transition-colors select-none ${
                    isHovered ? 'text-purple-400 font-bold' : 'text-zinc-500'
                  }`}>
                    {bucket.label}
                  </span>
                </div>
              );
            })}

            {/* Mean average marker line overlay (Positioned at 4.6h, roughly between index 2 and index 3) */}
            <div 
              className="absolute top-0 bottom-8 border-l-2 border-dashed border-rose-500/60 group flex flex-col items-center pointer-events-none"
              style={{ left: '26%' }}
            >
              <div className="bg-rose-600 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow-md -translate-y-6">
                4.6h
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
