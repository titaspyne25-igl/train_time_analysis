import React, { useState } from 'react';
import { Check, Calendar, HelpCircle, Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import { ROUTE_PERFORMANCE, DELAY_ROOT_CAUSE, MONTHLY_VOLUME_TRENDS } from '../data';

export default function LogisticsCommandDashboard() {
  const [hoveredRoute, setHoveredRoute] = useState<number | null>(null);
  const [hoveredCause, setHoveredCause] = useState<number | null>(null);
  const [hoveredTrend, setHoveredTrend] = useState<number | null>(null);

  // Constants
  const maxVolume = Math.max(...MONTHLY_VOLUME_TRENDS.map(t => t.volume));

  // Pie calculations for Delay Root Cause
  let cumulativePercent = 0;
  const pieSlices = DELAY_ROOT_CAUSE.map((slice, i) => {
    const startAngle = (cumulativePercent / 100) * 360;
    const endAngle = ((cumulativePercent + slice.percentage) / 100) * 360;
    cumulativePercent += slice.percentage;

    const rad = Math.PI / 180;
    // Center at 120, 120, radius 90
    const x1 = 120 + 90 * Math.cos((startAngle - 90) * rad);
    const y1 = 120 + 90 * Math.sin((startAngle - 90) * rad);
    const x2 = 120 + 90 * Math.cos((endAngle - 90) * rad);
    const y2 = 120 + 90 * Math.sin((endAngle - 90) * rad);

    const largeArcFlag = slice.percentage > 50 ? 1 : 0;
    const pathData = `
      M 120 120
      L ${x1} ${y1}
      A 90 90 0 ${largeArcFlag} 1 ${x2} ${y2}
      Z
    `;

    // Mid angle for hover label positions
    const midAngle = startAngle + (slice.percentage / 2);
    const textX = 120 + 55 * Math.cos((midAngle - 90) * rad);
    const textY = 120 + 55 * Math.sin((midAngle - 90) * rad);

    return {
      ...slice,
      pathData,
      textX,
      textY,
      index: i
    };
  });

  return (
    <div id="logistics-command-root" className="flex-1 bg-zinc-950 overflow-y-auto p-8 font-sans text-zinc-50 dark-scrollbar">
      
      {/* Top Header */}
      <div id="logistics-header" className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-800 pb-5 mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-zinc-100">Train Logistics Command</h1>
          <p className="text-xs text-zinc-400">Automated freight analysis, delay breakdowns, and capacity forecasting</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-zinc-500 font-medium font-mono">
          <span>Analyst: <strong className="text-zinc-300">Titas Pyne</strong></span>
          <span className="text-zinc-800">|</span>
          <div className="flex items-center gap-1.5 text-zinc-300 bg-zinc-900 px-2.5 py-1 rounded-md shadow-sm border border-zinc-800">
            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
            <span>27 May 2026</span>
          </div>
        </div>
      </div>

      {/* Grid Layout (2x2 matching image 3 layout exactly) */}
      <div id="logistics-grid" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Card 1: Live Fleet Status */}
        <div id="logistics-fleet-card" className="bento-card flex flex-col justify-between h-[320px]">
          <div>
            <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest font-mono mb-1">Live Fleet Status</h2>
            <p className="text-[11px] text-zinc-400 mb-6 font-sans">Active operational stats across the integrated rail grid</p>
          </div>

          {/* Metrics Layout with Sliders */}
          <div className="grid grid-cols-3 gap-6 my-auto">
            {/* Total Trains */}
            <div className="flex flex-col">
              <span className="text-xs text-zinc-400 font-sans">Total Trains:</span>
              <span className="text-3xl font-bold font-display tracking-tight text-zinc-100 mt-1">2,540</span>
              {/* Progress Slider (Illuminated line) */}
              <div className="w-full h-1.5 bg-zinc-900 rounded-full mt-3 overflow-hidden relative border border-zinc-800/40">
                <div className="absolute left-0 top-0 h-full w-[80%] bg-gradient-to-r from-blue-500 to-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
              </div>
            </div>

            {/* Active */}
            <div className="flex flex-col">
              <span className="text-xs text-zinc-400 font-sans">Active:</span>
              <span className="text-3xl font-bold font-display tracking-tight text-zinc-100 mt-1">2,380</span>
              {/* Progress Slider */}
              <div className="w-full h-1.5 bg-zinc-900 rounded-full mt-3 overflow-hidden relative border border-zinc-800/40">
                <div className="absolute left-0 top-0 h-full w-[94%] bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
              </div>
            </div>

            {/* Delayed */}
            <div className="flex flex-col">
              <span className="text-xs text-zinc-400 font-sans">Delayed:</span>
              <span className="text-3xl font-bold font-display tracking-tight text-zinc-100 mt-1">160</span>
              {/* Progress Slider */}
              <div className="w-full h-1.5 bg-zinc-900 rounded-full mt-3 overflow-hidden relative border border-zinc-800/40">
                <div className="absolute left-0 top-0 h-full w-[15%] bg-zinc-700" />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-800/60 flex justify-between items-center text-[10px] text-zinc-500 font-mono">
            <span>UPTIME SCORE: 98.4%</span>
            <span>NODES OPERATIONAL: 100%</span>
          </div>
        </div>

        {/* Card 2: Top Performing Routes */}
        <div id="logistics-routes-card" className="bento-card flex flex-col justify-between h-[320px]">
          <div>
            <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest font-mono mb-1">Top Performing Routes</h2>
            <p className="text-[11px] text-zinc-400 mb-5 font-sans">Routes operating above design parameters of timeline adherence</p>
          </div>

          {/* List of Progress Bars */}
          <div className="space-y-3 flex-1 flex flex-col justify-center">
            {ROUTE_PERFORMANCE.map((route, i) => {
              const isHovered = hoveredRoute === i;
              return (
                <div 
                  key={route.name}
                  className="flex items-center justify-between gap-4 py-0.5"
                  onMouseEnter={() => setHoveredRoute(i)}
                  onMouseLeave={() => setHoveredRoute(null)}
                >
                  <span className="w-20 text-xs font-semibold text-zinc-200 font-sans">{route.name}</span>
                  
                  {/* Visual Bar */}
                  <div className="flex-1 h-5 bg-zinc-900 rounded overflow-hidden relative flex border border-zinc-800/40">
                    {/* Blue portion representing active volume */}
                    <div 
                      className="h-full bg-gradient-to-r from-blue-600 to-purple-500 transition-all duration-500" 
                      style={{ width: `${route.percentage - 15}%` }}
                    />
                    {/* Green portion representing top margin performance */}
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-500" 
                      style={{ width: '15%' }}
                    />
                  </div>

                  {/* Checked Badge */}
                  <div className="flex items-center gap-2 w-12 justify-end">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-1 rounded-full text-emerald-400 shadow-sm">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-xs font-bold font-mono text-zinc-300">{route.percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 3: Delay Root Cause */}
        <div id="logistics-cause-card" className="bento-card flex flex-col justify-between h-[350px]">
          <div>
            <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest font-mono mb-1">Delay Root Cause</h2>
            <p className="text-[11px] text-zinc-400 mb-4 font-sans">Primary categories of recorded operational schedule offsets</p>
          </div>

          {/* Pie Chart display */}
          <div className="flex items-center justify-center gap-8 my-auto">
            <div className="relative w-[220px] h-[220px]">
              <svg className="w-full h-full transform -rotate-12" viewBox="0 0 240 240">
                {pieSlices.map((slice) => {
                  const isHovered = hoveredCause === slice.index;
                  return (
                    <g key={slice.name}>
                      <path
                        d={slice.pathData}
                        fill={slice.color}
                        className="transition-all duration-300 cursor-pointer origin-center"
                        style={{
                          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                          filter: isHovered ? 'drop-shadow(0px 8px 16px rgba(168,85,247,0.25))' : 'none',
                          opacity: hoveredCause !== null && !isHovered ? 0.6 : 1
                        }}
                        onMouseEnter={() => setHoveredCause(slice.index)}
                        onMouseLeave={() => setHoveredCause(null)}
                      />
                      {/* Percent labels inside slice */}
                      <text
                        x={slice.textX}
                        y={slice.textY}
                        fill={slice.color === '#e2e8f0' ? '#09090b' : 'white'}
                        fontSize="10px"
                        fontWeight="700"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="pointer-events-none select-none font-mono"
                      >
                        {slice.percentage}%
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Centered details overlay */}
              {hoveredCause !== null && (
                <div className="absolute inset-0 m-auto w-20 h-20 bg-zinc-900 rounded-full shadow-lg border border-zinc-800 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-[9px] font-semibold text-zinc-500 font-sans">{DELAY_ROOT_CAUSE[hoveredCause].name}</span>
                  <span className="text-base font-bold text-purple-400 font-display">
                    {DELAY_ROOT_CAUSE[hoveredCause].percentage}%
                  </span>
                </div>
              )}
            </div>

            {/* Colored Legends list */}
            <div className="flex flex-col gap-3">
              {DELAY_ROOT_CAUSE.map((cause, index) => (
                <div 
                  key={cause.name}
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    hoveredCause === index ? 'bg-zinc-900 border border-zinc-800' : 'bg-transparent border border-transparent'
                  }`}
                  onMouseEnter={() => setHoveredCause(index)}
                  onMouseLeave={() => setHoveredCause(null)}
                >
                  <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: cause.color }} />
                  <span className="text-xs font-semibold text-zinc-300 font-sans">{cause.name} ({cause.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 4: Monthly Volume Trends */}
        <div id="logistics-trends-card" className="bento-card flex flex-col justify-between h-[350px]">
          <div>
            <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest font-mono mb-1">Monthly Volume Trends</h2>
            <p className="text-[11px] text-zinc-400 mb-6 font-sans">Accumulated metrics of cargo and passenger departures volume</p>
          </div>

          {/* Custom Interactive SVG Area Chart */}
          <div className="flex-1 flex flex-col justify-end relative h-48">
            
            {/* Axis Labels Left */}
            <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[9px] font-mono text-zinc-600 pointer-events-none">
              <span>200k</span>
              <span>150k</span>
              <span>100k</span>
              <span>50k</span>
              <span>0</span>
            </div>

            {/* Custom Interactive SVG Area Chart layout */}
            <div className="flex-1 ml-10 mb-8 relative">
              <svg className="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Horizontal reference lines */}
                <line x1="0" y1="30" x2="400" y2="30" stroke="#27272a" strokeWidth="0.5" strokeDasharray="3,3" />
                <line x1="0" y1="60" x2="400" y2="60" stroke="#27272a" strokeWidth="0.5" strokeDasharray="3,3" />
                <line x1="0" y1="90" x2="400" y2="90" stroke="#27272a" strokeWidth="0.5" strokeDasharray="3,3" />

                {/* Shaded Area */}
                <path
                  d="M 0 120 L 0 75 L 100 61 L 200 48 L 300 30 L 400 3 L 400 120 Z"
                  fill="url(#areaGrad)"
                />

                {/* Smooth Gradient Line */}
                <path
                  d="M 0 75 L 100 61 L 200 48 L 300 30 L 400 3"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Vertices/Dot points */}
                {[
                  { x: 0, y: 75, index: 0 },
                  { x: 100, y: 61, index: 1 },
                  { x: 200, y: 48, index: 2 },
                  { x: 300, y: 30, index: 3 },
                  { x: 400, y: 3, index: 4 }
                ].map((pt) => {
                  const isHovered = hoveredTrend === pt.index;
                  return (
                    <g key={pt.index}>
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? 6 : 4}
                        fill="#ffffff"
                        stroke="#a855f7"
                        strokeWidth="2.5"
                        className="transition-all duration-150 cursor-pointer"
                        onMouseEnter={() => setHoveredTrend(pt.index)}
                        onMouseLeave={() => setHoveredTrend(null)}
                      />
                      {isHovered && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="12"
                          fill="none"
                          stroke="#a855f7"
                          strokeWidth="1.5"
                          className="pulse-glow"
                        />
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Monthly labels */}
              <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[10px] font-mono text-zinc-500 select-none">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
              </div>
            </div>

            {/* Floating details banner on hovered trend vertex */}
            {hoveredTrend !== null && (
              <div className="absolute top-2 right-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded text-[10px] font-mono text-zinc-300 shadow-md">
                <span className="text-purple-400 font-bold block">{MONTHLY_VOLUME_TRENDS[hoveredTrend].month} Volume</span>
                <span>{MONTHLY_VOLUME_TRENDS[hoveredTrend].volume.toLocaleString()} departures</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
