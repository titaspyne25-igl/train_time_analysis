import React, { useState } from 'react';
import { 
  TrendingUp, 
  Layers, 
  ShieldAlert, 
  Activity, 
  MapPin, 
  BellRing, 
  Sparkles, 
  HelpCircle, 
  Search,
  CheckCircle,
  Calendar,
  AlertOctagon,
  Wrench,
  Clock,
  Settings
} from 'lucide-react';
import { ROUTE_EFFICIENCY_DATA, CONGESTION_HEATMAP, MAINTENANCE_LOGS } from '../data';
import { RouteEfficiency, CongestionCell, MaintenanceLog } from '../types';

export default function InteractiveOperationsDashboard() {
  const [hudSubTab, setHudSubTab] = useState<'dashboard' | 'optimization' | 'fleet' | 'safety'>('dashboard');
  const [selectedScatterPoint, setSelectedScatterPoint] = useState<RouteEfficiency | null>(null);
  const [hoveredScatterPoint, setHoveredScatterPoint] = useState<RouteEfficiency | null>(null);
  const [hoveredHeatmapCell, setHoveredHeatmapCell] = useState<{ station: string; hour: string; score: number } | null>(null);
  const [activeMaintenanceFilter, setActiveMaintenanceFilter] = useState<string>('all');

  const hudMenuItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: Layers, desc: 'Central HUD system' },
    { id: 'optimization' as const, label: 'Schedule Optimization', icon: TrendingUp, desc: 'Flow path calibration' },
    { id: 'fleet' as const, label: 'Fleet Management', icon: Activity, desc: 'Engine diagnostic states' },
    { id: 'safety' as const, label: 'Safety Logs', icon: ShieldAlert, desc: 'Accident mitigation records' }
  ];

  // Helper for heatmap colors
  const getHeatmapColor = (score: number) => {
    if (score <= 1.5) return 'bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/25 hover:bg-[#10b981]/25'; // Efficient green
    if (score <= 4.5) return 'bg-[#f59e0b]/20 text-[#fbbf24] border border-[#f59e0b]/30 hover:bg-[#f59e0b]/35'; // Moderate orange/yellow
    return 'bg-[#ef4444]/25 text-[#f87171] border border-[#ef4444]/40 hover:bg-[#ef4444]/45 animate-pulse'; // Congested red
  };

  // Filter maintenance logs
  const filteredMaintenance = MAINTENANCE_LOGS.filter(log => {
    if (activeMaintenanceFilter === 'all') return true;
    return log.status === activeMaintenanceFilter;
  });

  return (
    <div id="interactive-hud-root" className="flex-1 bg-zinc-950 text-zinc-100 overflow-y-auto flex h-full font-sans dark-scrollbar">
      
      {/* Inner HUD Left Sub-Sidebar */}
      <div id="hud-inner-sidebar" className="w-60 bg-zinc-900/60 border-r border-zinc-800/80 p-4 flex flex-col shrink-0 select-none">
        <div className="flex items-center gap-2 px-2.5 py-3 border-b border-zinc-800/40 mb-6">
          <Activity className="w-5 h-5 text-purple-400 animate-pulse" />
          <span className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-500">HUD NAVIGATION</span>
        </div>

        <nav className="space-y-1">
          {hudMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = hudSubTab === item.id;
            return (
              <button
                key={item.id}
                id={`hud-subtab-${item.id}`}
                onClick={() => setHudSubTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-300 text-left group border relative ${
                  isActive
                    ? 'bg-purple-500/10 border-purple-500/30 text-purple-400 font-bold shadow-[0_0_12px_rgba(168,85,247,0.15)]'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-purple-500 rounded-r-md shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
                )}
                <Icon className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-purple-400' : 'text-zinc-500 group-hover:text-zinc-400'
                }`} />
                <div className="flex flex-col">
                  <span className="text-xs font-sans tracking-wide leading-none">{item.label}</span>
                  <span className="text-[9px] font-sans font-light opacity-50 mt-1 max-w-[150px] truncate">
                    {item.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Telemetry diagnostics stats block */}
        <div className="mt-auto bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-[10px] font-mono text-zinc-500">
          <div className="flex items-center justify-between mb-1">
            <span>CORE NODE:</span>
            <span className="text-purple-400 font-bold">ONLINE</span>
          </div>
          <div className="flex items-center justify-between mb-1">
            <span>PING MS:</span>
            <span className="text-blue-400">14 ms</span>
          </div>
          <div className="flex items-center justify-between">
            <span>TELEMETRY STACK:</span>
            <span className="text-zinc-400">v4.6.2</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div id="hud-main-container" className="flex-1 p-6 overflow-y-auto flex flex-col justify-between">
        
        {/* Top Floating Dashboard Header */}
        <div id="hud-top-header" className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-800 pb-4 mb-6 gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <span className="bg-zinc-900 border border-zinc-800 p-2 rounded-xl text-purple-400 shadow-sm">
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-lg font-bold font-display tracking-tight text-zinc-100 leading-tight">Interactive Operations Dashboard UI</h1>
              <p className="text-[10px] text-zinc-400 mt-0.5">Tactical real-time railway simulation and scheduling operations center</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-lg">
              Wednesday, 27 May 2026
            </span>
            {/* Minimal User Profile Block */}
            <div className="flex items-center gap-2.5">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80"
                alt="Titas Pyne"
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full border border-zinc-800 shadow-lg object-cover"
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold leading-none text-zinc-200">Titas Pyne</span>
                <span className="text-[9px] text-zinc-500 mt-0.5 leading-none">Senior Analyst</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard sub tabs dynamic loading */}
        {hudSubTab === 'dashboard' && (
          <div className="flex-1 flex flex-col justify-between space-y-6">
            
            {/* Grid for: Route Efficiency (Scatter) & Heatmap */}
            <div id="hud-grid-row-1" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Card A: Route Efficiency (Scatter plot speed vs delay) */}
              <div id="hud-efficiency-card" className="bento-card flex flex-col justify-between h-[360px] relative">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <h2 className="text-sm font-bold text-zinc-200 font-display">Route Efficiency</h2>
                    {/* Legend */}
                    <div className="flex items-center gap-3 text-[10px] font-mono">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-purple-500 rounded-full" />
                        <span className="text-zinc-500">Efficient</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span className="text-zinc-500">Delayed</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-zinc-500 mb-4 font-sans">Visualizing Average Delay (min) vs. Average Speed (km/h)</p>
                </div>

                {/* Custom Interactive Scatter Plot SVG */}
                <div className="flex-1 relative h-48 mt-2 flex items-end">
                  
                  {/* Y Axis Grid lines */}
                  <div className="absolute inset-y-0 left-8 right-4 flex flex-col justify-between pointer-events-none pb-5 text-[9px] font-mono text-zinc-600">
                    <div className="flex items-center w-full justify-between border-b border-zinc-800/40 pb-0.5">
                      <span>60 min</span>
                    </div>
                    <div className="flex items-center w-full justify-between border-b border-zinc-800/40 pb-0.5">
                      <span>40 min</span>
                    </div>
                    <div className="flex items-center w-full justify-between border-b border-zinc-800/40 pb-0.5">
                      <span>20 min</span>
                    </div>
                    <div className="flex items-center w-full justify-between border-b border-zinc-800/40 pb-0.5">
                      <span>0 min</span>
                    </div>
                  </div>

                  {/* Scatter plotting plane */}
                  <div className="flex-1 ml-12 mb-5 relative h-[85%] pr-4">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 300 120" preserveAspectRatio="none">
                      {/* Grid guideline curves for optimal speed-delay zones */}
                      <path 
                        d="M 10 110 Q 150 70 290 10" 
                        fill="none" 
                        stroke="rgba(168, 85, 247, 0.15)" 
                        strokeWidth="1.5" 
                        strokeDasharray="4,4" 
                      />
                      <path 
                        d="M 10 80 Q 150 40 290 2" 
                        fill="none" 
                        stroke="rgba(59, 130, 246, 0.1)" 
                        strokeWidth="1.5" 
                        strokeDasharray="4,4" 
                      />

                      {/* Scatter Point Nodes */}
                      {ROUTE_EFFICIENCY_DATA.map((pt, idx) => {
                        // Map X: Speed (60 to 300) -> SVG (10 to 290)
                        const mapX = 10 + ((pt.speed - 60) / 240) * 280;
                        // Map Y: Delay (0 to 60) -> SVG (110 to 10)
                        const mapY = 110 - (pt.delay / 60) * 100;

                        const isHovered = hoveredScatterPoint?.name === pt.name;
                        const isSelected = selectedScatterPoint?.name === pt.name;

                        return (
                          <g key={pt.name}>
                            <circle
                              cx={mapX}
                              cy={mapY}
                              r={isHovered || isSelected ? 6 : 3}
                              fill={pt.status === 'efficient' ? '#a855f7' : '#3b82f6'}
                              className="transition-all duration-150 cursor-pointer hover:scale-125"
                              style={{
                                filter: isHovered || isSelected ? `drop-shadow(0 0 6px ${pt.status === 'efficient' ? '#a855f7' : '#3b82f6'})` : 'none',
                                opacity: hoveredScatterPoint !== null && !isHovered ? 0.5 : 1
                              }}
                              onClick={() => setSelectedScatterPoint(pt)}
                              onMouseEnter={() => setHoveredScatterPoint(pt)}
                              onMouseLeave={() => setHoveredScatterPoint(null)}
                            />
                            {/* Glow halo */}
                            {(isHovered || isSelected) && (
                              <circle
                                cx={mapX}
                                cy={mapY}
                                r="12"
                                fill="none"
                                stroke={pt.status === 'efficient' ? '#a855f7' : '#3b82f6'}
                                strokeWidth="0.8"
                                className="pulse-glow"
                              />
                            )}
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  {/* X Axis Coordinates Bottom */}
                  <div className="absolute bottom-0 left-12 right-4 flex justify-between text-[9px] font-mono text-zinc-500">
                    <span>60 km/h</span>
                    <span>120 km/h</span>
                    <span>180 km/h</span>
                    <span>240 km/h</span>
                    <span>300 km/h</span>
                  </div>
                </div>

                {/* Vertical Axis Title */}
                <div className="absolute left-1 top-[45%] -rotate-90 origin-center text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                  Average Delay
                </div>
                {/* Horizontal Axis Title */}
                <div className="w-full text-center text-[9px] font-mono text-zinc-500 uppercase tracking-widest mt-1">
                  Average Speed
                </div>

                {/* Details Floating Overlay for Selected Point */}
                {(hoveredScatterPoint || selectedScatterPoint) && (
                  <div className="absolute bottom-16 right-6 bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl shadow-2xl max-w-[180px] pointer-events-none z-10 animate-fade-in">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        (hoveredScatterPoint || selectedScatterPoint)!.status === 'efficient' ? 'bg-purple-400' : 'bg-blue-400'
                      }`} />
                      <span className="font-bold text-xs text-zinc-100">{(hoveredScatterPoint || selectedScatterPoint)!.name}</span>
                    </div>
                    <div className="text-[10px] text-zinc-400 font-mono space-y-0.5">
                      <div>Speed: <span className="text-zinc-200">{(hoveredScatterPoint || selectedScatterPoint)!.speed} km/h</span></div>
                      <div>Delay: <span className="text-zinc-200">{(hoveredScatterPoint || selectedScatterPoint)!.delay} mins</span></div>
                      <div>Zone: <span className="text-zinc-200 uppercase font-bold text-[9px]">{(hoveredScatterPoint || selectedScatterPoint)!.status}</span></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Card B: Station Congestion Heatmap */}
              <div id="hud-heatmap-card" className="bento-card flex flex-col justify-between h-[360px] relative">
                <div>
                  <h2 className="text-sm font-bold text-zinc-200 font-display mb-1">Station Congestion Heatmap</h2>
                  <p className="text-[10px] text-zinc-500 mb-4 font-sans">Spatial density matrix modeling commuter and freight congestion scores</p>
                </div>

                {/* Heatmap Grid Layout */}
                <div className="flex-1 mt-2 overflow-x-auto">
                  <div className="min-w-[400px]">
                    {/* Heatmap Hours Headers */}
                    <div className="grid grid-cols-6 gap-1 mb-1.5 text-center text-[10px] font-mono text-zinc-500 font-semibold uppercase">
                      <div className="text-left pl-1">Station</div>
                      <div>06:00-09:00</div>
                      <div>09:00-12:00</div>
                      <div>12:00-15:00</div>
                      <div>15:00-18:00</div>
                      <div>18:00-21:00</div>
                    </div>

                    {/* Heatmap Rows */}
                    <div className="space-y-1.5">
                      {CONGESTION_HEATMAP.map((row) => (
                        <div key={row.station} className="grid grid-cols-6 gap-1 text-center items-center">
                          {/* Station Name Left Header */}
                          <div className="text-left text-[11px] font-bold text-zinc-400 font-sans truncate pl-1">
                            {row.station}
                          </div>

                          {/* 5 Heatmap Matrix Cells */}
                          {(['06:00-09:00', '09:00-12:00', '12:00-15:00', '15:00-18:00', '18:00-21:00'] as const).map((hour) => {
                            const val = row[hour];
                            // Apply custom Bento premium heat coloring palette
                            let cellStyles = '';
                            if (val <= 1.5) {
                              cellStyles = 'bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20';
                            } else if (val <= 4.5) {
                              cellStyles = 'bg-blue-500/10 text-blue-300 border border-blue-500/20 hover:bg-blue-500/20';
                            } else {
                              cellStyles = 'bg-rose-500/15 text-rose-300 border border-rose-500/25 hover:bg-rose-500/30 animate-pulse';
                            }

                            return (
                              <div
                                key={hour}
                                className={`py-3.5 text-xs font-mono font-bold rounded-lg transition-all duration-150 cursor-pointer ${cellStyles}`}
                                onMouseEnter={() => setHoveredHeatmapCell({ station: row.station, hour, score: val })}
                                onMouseLeave={() => setHoveredHeatmapCell(null)}
                              >
                                {val.toFixed(1)}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Heatmap Tooltip Display */}
                {hoveredHeatmapCell !== null && (
                  <div className="absolute top-2 right-2 bg-zinc-900 border border-zinc-800 px-3 py-2 rounded text-[10px] font-mono text-zinc-300 shadow-xl pointer-events-none">
                    <span className="text-purple-400 font-bold block">{hoveredHeatmapCell.station}</span>
                    <span>Hour: {hoveredHeatmapCell.hour}</span><br />
                    <span>Congestion index: <span className={hoveredHeatmapCell.score > 4.5 ? 'text-rose-400 font-bold' : 'text-purple-300'}>{hoveredHeatmapCell.score}</span></span>
                  </div>
                )}
              </div>

            </div>

            {/* Panel C: Predictive Maintenance Timeline */}
            <div id="hud-timeline-panel" className="bento-card relative">
              
              {/* Header inside Panel */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-800/60 pb-4 mb-8 gap-4">
                <div>
                  <h2 className="text-sm font-bold text-zinc-200 font-display mb-1">Predictive Maintenance Timeline</h2>
                  <p className="text-[10px] text-zinc-500 font-sans">Active diagnostic queue from automated sensor telemetry feedback logs</p>
                </div>

                {/* Filter Selector tabs */}
                <div className="flex gap-2 bg-zinc-950 border border-zinc-800 p-1 rounded-xl text-[10px] font-mono font-semibold">
                  {['all', 'critical', 'scheduled', 'routine', 'predicted'].map((filter) => (
                    <button
                      key={filter}
                      id={`maintenance-filter-${filter}`}
                      onClick={() => setActiveMaintenanceFilter(filter)}
                      className={`px-2.5 py-1 rounded-lg uppercase cursor-pointer transition-colors ${
                        activeMaintenanceFilter === filter 
                          ? 'bg-purple-500/10 text-purple-400' 
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Connecting Horizontal Line bar */}
              <div className="absolute left-12 right-12 top-[62%] h-0.5 bg-zinc-800 pointer-events-none rounded" />
              <div className="absolute left-12 right-12 top-[62%] h-0.5 bg-purple-500/20 pointer-events-none rounded" />

              {/* Maintenance Cards Row */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
                {filteredMaintenance.map((log) => {
                  const isCritical = log.status === 'critical';
                  const isScheduled = log.status === 'scheduled';
                  const isRoutine = log.status === 'routine';

                  return (
                    <div 
                      key={log.id} 
                      className="flex flex-col items-center group cursor-pointer animate-fade-in"
                    >
                      {/* Timeline Node Point Dot */}
                      <div className="mb-8 flex flex-col items-center">
                        <span className="text-[10px] font-mono text-zinc-500 font-semibold mb-2">{log.dateStr}</span>
                        {/* Point Bulbs */}
                        <div className="relative">
                          {isCritical && (
                            <div className="absolute inset-0 m-auto w-6 h-6 bg-rose-500/30 rounded-full pulse-glow" />
                          )}
                          <div className={`w-3.5 h-3.5 rounded-full border-2 ${
                            isCritical 
                              ? 'bg-rose-500 border-rose-400 shadow-[0_0_8px_#f43f5e]' 
                              : isScheduled 
                                ? 'bg-blue-500 border-blue-400' 
                                : isRoutine 
                                  ? 'bg-purple-500 border-purple-400' 
                                  : 'bg-zinc-600 border-zinc-500'
                          }`} />
                        </div>
                      </div>

                      {/* Main Data Card */}
                      <div className={`w-full p-4 rounded-xl border text-left transition-all duration-300 ${
                        isCritical
                          ? 'bg-rose-500/5 border-rose-500/40 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                          : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700/80 hover:bg-zinc-800/80'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          {isCritical ? (
                            <AlertOctagon className="w-4 h-4 text-rose-400 animate-bounce" />
                          ) : isScheduled ? (
                            <Wrench className="w-4 h-4 text-blue-400" />
                          ) : isRoutine ? (
                            <CheckCircle className="w-4 h-4 text-purple-400" />
                          ) : (
                            <Clock className="w-4 h-4 text-zinc-400" />
                          )}
                          <span className={`text-[9px] uppercase font-mono tracking-wider font-bold ${
                            isCritical ? 'text-rose-400' : isScheduled ? 'text-blue-400' : isRoutine ? 'text-purple-400' : 'text-zinc-400'
                          }`}>
                            {log.status}
                          </span>
                        </div>

                        <h3 className="text-xs font-bold font-display text-zinc-200 truncate">{log.title}</h3>
                        <p className="text-[10px] text-zinc-500 mt-1 font-mono truncate">{log.target}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        )}

        {hudSubTab === 'optimization' && (
          <div className="flex-1 flex flex-col justify-center items-center text-center p-12 bento-card">
            <TrendingUp className="w-16 h-16 text-purple-400 mb-4 animate-pulse" />
            <h2 className="text-lg font-bold font-display text-zinc-100">Flow Path Calibration Active</h2>
            <p className="text-sm text-zinc-400 max-w-md mt-2">
              The Sysslan AI Engine is currently modeling optimal corridor spacing intervals. Expected queue consolidation coefficient is 94.2%.
            </p>
          </div>
        )}

        {hudSubTab === 'fleet' && (
          <div className="flex-1 flex flex-col justify-center items-center text-center p-12 bento-card">
            <Activity className="w-16 h-16 text-blue-400 mb-4 animate-bounce" />
            <h2 className="text-lg font-bold font-display text-zinc-100">Engine Diagnostic Live Scanning</h2>
            <p className="text-sm text-zinc-400 max-w-md mt-2">
              Continuous monitoring of physical properties including oil viscosities, gear telemetry, and thermal cooling loads. All active parameters normal.
            </p>
          </div>
        )}

        {hudSubTab === 'safety' && (
          <div className="flex-1 flex flex-col justify-center items-center text-center p-12 bento-card">
            <ShieldAlert className="w-16 h-16 text-rose-400 mb-4 animate-spin-slow" />
            <h2 className="text-lg font-bold font-display text-zinc-100">Safety Logs Repository</h2>
            <p className="text-sm text-slate-400 max-w-md mt-2">
              No hazard deviations logged. The integrated signal system shows zero conflict indices on any active line over the last 72 hours.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
