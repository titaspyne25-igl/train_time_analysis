import React, { useState } from 'react';
import { 
  Train, 
  Clock, 
  Gauge, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertCircle, 
  Layers, 
  TrendingUp 
} from 'lucide-react';

export default function KpiSummary() {
  // Card 1: Train States
  const [activeTrainTab, setActiveTrainTab] = useState<'all' | 'running' | 'station' | 'depot'>('all');
  
  // Card 2: Corridor Delay Select
  const [activeCorridor, setActiveCorridor] = useState<'all' | 'west' | 'east'>('all');
  
  // Card 3: Speed Category Select
  const [speedCategory, setSpeedCategory] = useState<'all' | 'short' | 'medium' | 'long'>('all');

  // Dynamic values based on selections
  const getTrainCount = () => {
    switch (activeTrainTab) {
      case 'running': return { count: '6,420', percent: '81.8%', desc: 'Trains currently on active corridors' };
      case 'station': return { count: '980', percent: '12.5%', desc: 'Trains berthed at passenger terminals' };
      case 'depot': return { count: '450', percent: '5.7%', desc: 'Trains undergoing safety & diagnostics' };
      default: return { count: '7,850', percent: '100%', desc: 'Total scheduled integrated fleet capacity' };
    }
  };

  const getDelayMins = () => {
    switch (activeCorridor) {
      case 'west': return { mins: 64, change: '↓ 18%', isPositive: true, status: 'Optimal operational flow' };
      case 'east': return { mins: 96, change: '↑ 8%', isPositive: false, status: 'Minor signal congestion' };
      default: return { mins: 160, change: '↓ 12%', isPositive: true, status: 'Stable network performance' };
    }
  };

  const getSpeedValue = () => {
    switch (speedCategory) {
      case 'short': return { speed: 85, max: 120, unit: 'km/h', label: 'Local Commuter Feeders' };
      case 'medium': return { speed: 108, max: 160, unit: 'km/h', label: 'Intercity Regional Shuttles' };
      case 'long': return { speed: 135, max: 200, unit: 'km/h', label: 'High-Speed Express Corridor' };
      default: return { speed: 104.5, max: 150, unit: 'km/h', label: 'Average Consolidated Speed' };
    }
  };

  const trainData = getTrainCount();
  const delayData = getDelayMins();
  const speedData = getSpeedValue();

  // For concentric speed gauge arc calculation
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const speedPercent = (speedData.speed / speedData.max) * 100;
  const strokeDashoffset = circumference - (speedPercent / 100) * circumference;

  return (
    <div id="kpi-summary-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      
      {/* 1. Total Active Trains Bento Card */}
      <div id="kpi-trains-card" className="bento-card flex flex-col justify-between min-h-[260px] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full translate-x-12 -translate-y-12 transition-transform duration-500 group-hover:scale-110" />
        
        <div>
          <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Integrated Fleet</span>
              <h3 className="text-sm font-bold text-zinc-400 font-display mt-0.5">Total Scheduled Trains</h3>
            </div>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:bg-purple-500/20 transition-all duration-300">
              <Train className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-extrabold font-display tracking-tight text-zinc-100 transition-all duration-300">
              {trainData.count}
            </span>
            <span className="flex items-center text-emerald-400 text-xs font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 shadow-sm">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              ↑ 3.2%
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 font-sans mt-1.5 transition-all duration-300 min-h-[16px]">
            {trainData.desc} ({trainData.percent})
          </p>
        </div>

        {/* Interactive Tabs Row */}
        <div className="mt-5 pt-4 border-t border-zinc-900">
          <div className="grid grid-cols-4 gap-1 bg-zinc-950 p-1 rounded-xl text-[10px] font-mono font-semibold">
            {(['all', 'running', 'station', 'depot'] as const).map((tab) => (
              <button
                key={tab}
                id={`kpi-tab-${tab}`}
                onClick={() => setActiveTrainTab(tab)}
                className={`py-1.5 rounded-lg uppercase cursor-pointer transition-all duration-200 text-center ${
                  activeTrainTab === tab 
                    ? 'bg-purple-600 text-white shadow-sm font-bold' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {tab === 'all' ? 'Total' : tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Network Delay Minutes Bento Card */}
      <div id="kpi-delay-card" className="bento-card flex flex-col justify-between min-h-[260px] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full translate-x-12 -translate-y-12 transition-transform duration-500 group-hover:scale-110" />
        
        <div>
          <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Timeline Adherence</span>
              <h3 className="text-sm font-bold text-zinc-400 font-display mt-0.5">Network Delay Minutes</h3>
            </div>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 group-hover:bg-rose-500/20 transition-all duration-300">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-extrabold font-display tracking-tight text-zinc-100 transition-all duration-300">
              {delayData.mins} <span className="text-xs text-zinc-500 font-mono">mins</span>
            </span>
            <span className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border shadow-sm transition-all duration-300 ${
              delayData.isPositive 
                ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
            }`}>
              {delayData.isPositive ? <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />}
              {delayData.change}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${delayData.isPositive ? 'bg-emerald-400' : 'bg-rose-500 animate-pulse'}`} />
            <p className="text-[11px] text-zinc-500 font-sans transition-all duration-300">
              {delayData.status}
            </p>
          </div>
        </div>

        {/* Interactive Segment Corridor Selector */}
        <div className="mt-5 pt-4 border-t border-zinc-900">
          <div className="grid grid-cols-3 gap-1 bg-zinc-950 p-1 rounded-xl text-[10px] font-mono font-semibold">
            {(['all', 'west', 'east'] as const).map((corridor) => (
              <button
                key={corridor}
                id={`kpi-corridor-${corridor}`}
                onClick={() => setActiveCorridor(corridor)}
                className={`py-1.5 rounded-lg uppercase cursor-pointer transition-all duration-200 text-center ${
                  activeCorridor === corridor 
                    ? 'bg-rose-500/15 text-rose-400 border border-rose-500/35 font-bold shadow-sm' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {corridor === 'all' ? 'All Corridors' : `${corridor} Corridor`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Average Speed Bento Card */}
      <div id="kpi-speed-card" className="bento-card flex flex-col justify-between min-h-[260px] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full translate-x-12 -translate-y-12 transition-transform duration-500 group-hover:scale-110" />
        
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Velocity Profile</span>
                <h3 className="text-sm font-bold text-zinc-400 font-display mt-0.5">{speedData.label}</h3>
              </div>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-extrabold font-display tracking-tight text-zinc-100 transition-all duration-300">
                {speedData.speed}
              </span>
              <span className="text-xs text-zinc-500 font-mono tracking-wider">
                {speedData.unit}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 font-sans mt-2 min-h-[16px]">
              Design target: <span className="font-mono text-zinc-400">{speedData.max} {speedData.unit} max</span>
            </p>
          </div>

          {/* Micro SVG Ring Gauge */}
          <div className="relative w-20 h-20 shrink-0 self-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
              {/* Background Ring */}
              <circle
                cx="40"
                cy="40"
                r={radius}
                fill="transparent"
                stroke="#18181b"
                strokeWidth="5"
                className="border border-zinc-900"
              />
              {/* Highlight Progress Arc */}
              <circle
                cx="40"
                cy="40"
                r={radius}
                fill="transparent"
                stroke="url(#speedGrad)"
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-500 ease-out"
              />
              {/* Gradients */}
              <defs>
                <linearGradient id="speedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Gauge className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
        </div>

        {/* Interactive Segment Category Selector */}
        <div className="mt-5 pt-4 border-t border-zinc-900">
          <div className="grid grid-cols-4 gap-1 bg-zinc-950 p-1 rounded-xl text-[10px] font-mono font-semibold">
            {(['all', 'short', 'medium', 'long'] as const).map((cat) => (
              <button
                key={cat}
                id={`kpi-speed-${cat}`}
                onClick={() => setSpeedCategory(cat)}
                className={`py-1.5 rounded-lg uppercase cursor-pointer transition-all duration-200 text-center ${
                  speedCategory === cat 
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/35 font-bold shadow-sm' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {cat === 'all' ? 'Avg' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
