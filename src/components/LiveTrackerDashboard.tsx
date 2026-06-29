import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MapPin,
  Compass,
  Bell,
  SlidersHorizontal,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
  Maximize2,
  Minimize2,
  FileText
} from 'lucide-react';
import { INITIAL_TRAINS, LIVE_FEED } from '../data';
import { Train, LiveFeedItem } from '../types';

export default function LiveTrackerDashboard() {
  const [trains, setTrains] = useState<Train[]>(INITIAL_TRAINS);
  const [selectedTrain, setSelectedTrain] = useState<Train>(INITIAL_TRAINS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedRouteType, setSelectedRouteType] = useState('All');
  const [feedItems, setFeedItems] = useState<LiveFeedItem[]>(LIVE_FEED);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Handle train movement animation
  useEffect(() => {
    const interval = setInterval(() => {
      setTrains((prevTrains) => {
        const updated = prevTrains.map((train) => {
          if (train.status === 'delayed' && train.speed === 0) return train; // Stopped train

          // Calculate small step movement based on speed
          let dx = 0;
          let dy = 0;
          const stepSize = (train.speed / 100) * 0.4;

          // Adjust positions along tracks
          if (train.id === '1456' || train.id === '1458') {
            // Horizontal Track moving right (looping)
            dx = stepSize;
            let newX = train.x + dx;
            if (newX > 750) newX = 50;
            return { ...train, x: newX };
          } else if (train.id === '1000') {
            // Diagonal NE moving down-left
            dx = -stepSize * 0.7;
            dy = stepSize * 0.7;
            let newX = train.x + dx;
            let newY = train.y + dy;
            if (newX < 100 || newY > 500) {
              newX = 650;
              newY = 100;
            }
            return { ...train, x: newX, y: newY };
          } else if (train.id === '1680') {
            // Diagonal NW moving down-right
            dx = stepSize * 0.7;
            dy = stepSize * 0.7;
            let newX = train.x + dx;
            let newY = train.y + dy;
            if (newX > 700 || newY > 500) {
              newX = 150;
              newY = 150;
            }
            return { ...train, x: newX, y: newY };
          } else if (train.id === '1558') {
            // Vertical Track moving down
            dy = stepSize;
            let newY = train.y + dy;
            if (newY > 500) newY = 50;
            return { ...train, y: newY };
          } else if (train.id === '3301') {
            // Diagonal NW moving up-left
            dx = -stepSize * 0.7;
            dy = -stepSize * 0.7;
            let newX = train.x + dx;
            let newY = train.y + dy;
            if (newX < 150 || newY < 100) {
              newX = 600;
              newY = 450;
            }
            return { ...train, x: newX, y: newY };
          } else if (train.id === '3308') {
            // Diagonal SW moving up-right
            dx = stepSize * 0.7;
            dy = -stepSize * 0.7;
            let newX = train.x + dx;
            let newY = train.y + dy;
            if (newX > 650 || newY < 100) {
              newX = 150;
              newY = 450;
            }
            return { ...train, x: newX, y: newY };
          } else if (train.id === 'M67') {
            // Diagonal SW moving down-left
            dx = -stepSize * 0.7;
            dy = stepSize * 0.7;
            let newX = train.x + dx;
            let newY = train.y + dy;
            if (newX < 150 || newY > 500) {
              newX = 550;
              newY = 150;
            }
            return { ...train, x: newX, y: newY };
          }

          return train;
        });

        // Sync the selected train properties to keep side panel real-time!
        const currentSelected = updated.find(t => t.id === selectedTrain.id);
        if (currentSelected) {
          setSelectedTrain(currentSelected);
        }

        return updated;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [selectedTrain.id]);

  // Filtering trains
  const filteredTrains = trains.filter((train) => {
    const matchesSearch = train.id.includes(searchQuery) || train.name.toLowerCase().includes(searchQuery.toLowerCase()) || train.route.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'All' || (selectedRegion === 'West' && train.x < 400) || (selectedRegion === 'East' && train.x >= 400);
    const matchesRouteType = selectedRouteType === 'All' || train.routeType === selectedRouteType;
    return matchesSearch && matchesRegion && matchesRouteType;
  });

  // Map drag and drop handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - mapOffset.x, y: e.clientY - mapOffset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setMapOffset({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetMap = () => {
    setZoomLevel(1);
    setMapOffset({ x: 0, y: 0 });
  };

  return (
    <div id="live-tracker-root" className="flex-1 bg-zinc-950 flex flex-col h-full text-zinc-100 select-none font-sans dark-scrollbar">
      
      {/* Top Header Panel */}
      <div id="tracker-header" className="bg-zinc-900/60 px-6 py-4 flex flex-col md:flex-row items-center justify-between border-b border-zinc-800/80 gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="bg-purple-500/10 p-2.5 rounded-xl border border-purple-500/20 shadow-sm">
            <Compass className="w-6 h-6 text-purple-400 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold font-display tracking-tight text-zinc-100">Live Train Tracker</h1>
              <div className="flex items-center gap-1.5 bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-purple-500/20 pulse-glow">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                Real-time
              </div>
              <div className="flex items-center gap-1 bg-zinc-800 text-zinc-300 px-2.5 py-0.5 rounded-full text-[10px] font-mono border border-zinc-700/50">
                <FileText className="w-3 h-3 text-purple-400" />
                OPERATIONS.MD Loaded
              </div>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">Automated telemetry feeding live railway network signals</p>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 md:flex-initial">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
            <input
              id="tracker-search"
              type="text"
              placeholder="Search Train ID or Route"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-200 focus:outline-none focus:border-purple-500/50 w-full md:w-48 placeholder-zinc-600 font-sans transition-all duration-200"
            />
          </div>

          {/* Region Dropdown */}
          <select
            id="tracker-region-select"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-purple-500/50 cursor-pointer font-sans transition-all duration-200"
          >
            <option value="All" className="bg-zinc-900 text-zinc-300">Region: All</option>
            <option value="West" className="bg-zinc-900 text-zinc-300">West Nodes</option>
            <option value="East" className="bg-zinc-900 text-zinc-300">East Nodes</option>
          </select>

          {/* Route Type Dropdown */}
          <select
            id="tracker-route-select"
            value={selectedRouteType}
            onChange={(e) => setSelectedRouteType(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-purple-500/50 cursor-pointer font-sans transition-all duration-200"
          >
            <option value="All" className="bg-zinc-900 text-zinc-300">Route: All</option>
            <option value="Short" className="bg-zinc-900 text-zinc-300">Short Journeys</option>
            <option value="Medium" className="bg-zinc-900 text-zinc-300">Medium Journeys</option>
            <option value="Long" className="bg-zinc-900 text-zinc-300">Long Journeys</option>
          </select>
        </div>
      </div>

      {/* Main Content Layout */}
      <div id="tracker-main-layout" className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Side: Live Feed Panel */}
        <div id="tracker-left-panel" className="w-full lg:w-72 bg-zinc-950 border-r border-zinc-900 p-4 flex flex-col shrink-0 overflow-y-auto dark-scrollbar">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-900">
            <h2 className="text-xs font-bold tracking-wider font-mono text-zinc-500 uppercase">Live Feed</h2>
            <span className="text-[10px] bg-zinc-900 text-zinc-400 px-1.5 py-0.5 rounded font-mono border border-zinc-800">
              {feedItems.length} logs
            </span>
          </div>

          <div className="space-y-3.5">
            {feedItems.map((item) => {
              const borderStyles = {
                alert: 'border-l-4 border-rose-500 bg-rose-500/5 hover:bg-rose-500/10',
                update: 'border-l-4 border-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10',
                warning: 'border-l-4 border-amber-500 bg-amber-500/5 hover:bg-amber-500/10'
              };
              const titleStyles = {
                alert: 'text-rose-400',
                update: 'text-emerald-400',
                warning: 'text-amber-400'
              };

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border border-zinc-900 transition-all duration-150 ${borderStyles[item.type]}`}
                >
                  <div className="flex justify-between items-start gap-1">
                    <span className={`text-xs font-bold font-sans ${titleStyles[item.type]}`}>
                      {item.title}
                    </span>
                    <span className="text-[9px] text-zinc-500 font-mono mt-0.5 shrink-0">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed font-sans">
                    {item.message}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Middle: Live Interactive SVG Map Grid */}
        <div 
          id="tracker-map-panel"
          className="flex-1 bg-zinc-950 relative overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing border-r border-zinc-900"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Railway Tracks SVG Network */}
          <div 
            className="w-full h-full min-w-[800px] min-h-[600px] transition-transform duration-75 select-none origin-center"
            style={{
              transform: `translate(${mapOffset.x}px, ${mapOffset.y}px) scale(${zoomLevel})`
            }}
          >
            <svg className="w-full h-full" viewBox="0 0 800 600">
              {/* Grid backdrop patterns */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(168, 85, 247, 0.03)" strokeWidth="1" />
                </pattern>
                <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#09090b" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <circle cx="400" cy="300" r="300" fill="url(#glow)" pointerEvents="none" />

              {/* STATIONS LINES / RAILWAY TRACKS NETWORKS */}
              {/* Backing structural tracks */}
              <line x1="50" y1="300" x2="750" y2="300" stroke="#18181b" strokeWidth="6" strokeLinecap="round" />
              <line x1="400" y1="50" x2="400" y2="550" stroke="#18181b" strokeWidth="6" strokeLinecap="round" />
              <line x1="100" y1="100" x2="700" y2="500" stroke="#18181b" strokeWidth="6" strokeLinecap="round" />
              <line x1="100" y1="500" x2="700" y2="100" stroke="#18181b" strokeWidth="6" strokeLinecap="round" />

              {/* Active illuminated tracks */}
              <line x1="50" y1="300" x2="750" y2="300" stroke="#27272a" strokeWidth="2" strokeDasharray="8,5" />
              <line x1="400" y1="50" x2="400" y2="550" stroke="#27272a" strokeWidth="2" strokeDasharray="8,5" />
              <line x1="100" y1="100" x2="700" y2="500" stroke="#27272a" strokeWidth="2" strokeDasharray="8,5" />
              <line x1="100" y1="500" x2="700" y2="100" stroke="#27272a" strokeWidth="2" strokeDasharray="8,5" />

              {/* Major Station Junctions (Nodes) */}
              {[
                { name: 'Central Station', x: 400, y: 300, isCenter: true },
                { name: 'North Junction', x: 400, y: 150 },
                { name: 'South Park', x: 400, y: 450 },
                { name: 'West Hub', x: 200, y: 300 },
                { name: 'East Terminal', x: 600, y: 300 }
              ].map((node) => (
                <g key={node.name} transform={`translate(${node.x}, ${node.y})`}>
                  {/* Outer breathing glow */}
                  <circle cx="0" cy="0" r={node.isCenter ? 14 : 10} fill="rgba(168, 85, 247, 0.15)" className="pulse-glow" />
                  <circle cx="0" cy="0" r={node.isCenter ? 8 : 6} fill="#18181b" stroke="#a855f7" strokeWidth="2" />
                  <circle cx="0" cy="0" r={node.isCenter ? 4 : 3} fill="#3b82f6" />
                  <text
                    x="12"
                    y="4"
                    fill="#a1a1aa"
                    fontSize="10px"
                    fontWeight="600"
                    className="pointer-events-none select-none font-sans"
                  >
                    {node.name}
                  </text>
                </g>
              ))}

              {/* TRAINS RENDERING */}
              {filteredTrains.map((train) => {
                const isSelected = selectedTrain.id === train.id;
                const statusColors = {
                  'on-time': { fill: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' },
                  'delayed': { fill: '#f43f5e', glow: 'rgba(244, 63, 94, 0.4)' },
                  'warning': { fill: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)' }
                };

                const currentColors = statusColors[train.status];

                return (
                  <g 
                    key={train.id} 
                    transform={`translate(${train.x}, ${train.y})`}
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTrain(train);
                    }}
                  >
                    {/* Ripple background for active select */}
                    {isSelected && (
                      <circle cx="0" cy="0" r="22" fill="none" stroke="#a855f7" strokeWidth="1.5" className="pulse-glow" />
                    )}

                    {/* Outer glow aura */}
                    <circle cx="0" cy="0" r="12" fill={currentColors.glow} />

                    {/* Small Train SVG capsule shape */}
                    <rect 
                      x="-14" 
                      y="-7" 
                      width="28" 
                      height="14" 
                      rx="7" 
                      fill="#18181b" 
                      stroke={currentColors.fill} 
                      strokeWidth="2" 
                    />

                    {/* Status dot in train */}
                    <circle cx="-5" cy="0" r="3" fill={currentColors.fill} />

                    {/* Label/ID overlay text */}
                    <text
                      x="0"
                      y="-12"
                      textAnchor="middle"
                      fill={isSelected ? '#a855f7' : '#d4d4d8'}
                      fontSize="9px"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      className="select-none pointer-events-none font-mono"
                    >
                      {train.name}
                    </text>

                    {/* Small direction arrow index */}
                    <polygon 
                      points="10,0 6,-3 6,3" 
                      fill={currentColors.fill} 
                      transform={`rotate(${train.angle})`}
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Map Controls Floating Menu Overlay */}
          <div id="tracker-map-controls" className="absolute bottom-6 right-6 bg-zinc-900/90 backdrop-blur border border-zinc-800 p-2 rounded-xl shadow-lg flex items-center gap-1.5 z-10">
            <button
              id="map-zoom-in"
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.5))}
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
              title="Zoom In"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              id="map-zoom-out"
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.5))}
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
              title="Zoom Out"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              id="map-reset"
              onClick={resetMap}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-purple-400 hover:bg-purple-500/10 border border-purple-500/20 transition-colors"
            >
              Reset view
            </button>
          </div>

          {/* Quick Hover/Current Selection Tooltip at middle center */}
          <div id="tracker-map-tooltip" className="absolute top-6 left-6 bg-zinc-900/95 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-zinc-800 pointer-events-none max-w-xs">
            <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block mb-1">Active Tracker Pin</span>
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-2 h-2 rounded-full ${
                selectedTrain.status === 'on-time' ? 'bg-emerald-500' : selectedTrain.status === 'delayed' ? 'bg-rose-500' : 'bg-amber-500'
              }`} />
              <h3 className="font-bold font-display text-base text-zinc-100">{selectedTrain.name}</h3>
            </div>
            <p className="text-xs text-zinc-400 font-sans leading-tight">
              Speed: <span className="font-semibold font-mono text-purple-400">{selectedTrain.speed} mph</span><br />
              Next: <span className="text-zinc-300">{selectedTrain.nextStation}</span><br />
              ETA: <span className="font-semibold text-emerald-400">{selectedTrain.eta}</span>
            </p>
          </div>
        </div>

        {/* Right Side: Train Details & Telemetry */}
        <div id="tracker-right-panel" className="w-full lg:w-80 bg-zinc-950 border-l border-zinc-900 p-5 flex flex-col justify-between shrink-0 overflow-y-auto dark-scrollbar">
          <div>
            {/* Header Title with Close icon */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-900 mb-6">
              <div className="flex flex-col">
                <h2 className="text-base font-bold font-display text-zinc-100">{selectedTrain.name} Details</h2>
                <span className="text-[10px] text-zinc-500 font-sans mt-0.5">{selectedTrain.route}</span>
              </div>
              <button 
                id="close-details-btn"
                className="p-1 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Real-time Telemetry Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs pb-1 border-b border-zinc-900/60">
                <span className="text-zinc-500 font-sans">Status</span>
                <span className={`font-semibold capitalize font-sans ${
                  selectedTrain.status === 'on-time' ? 'text-emerald-400' : selectedTrain.status === 'delayed' ? 'text-rose-400' : 'text-amber-400'
                }`}>
                  {selectedTrain.status === 'on-time' ? 'On Time' : selectedTrain.status === 'delayed' ? 'Delayed' : 'Minor Warning'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pb-1 border-b border-zinc-900/60">
                <span className="text-zinc-500 font-sans">Current Speed</span>
                <span className="font-bold text-zinc-100 font-mono">{selectedTrain.speed} mph</span>
              </div>

              <div className="flex items-center justify-between text-xs pb-1 border-b border-zinc-900/60">
                <span className="text-zinc-500 font-sans">Next Station</span>
                <span className="font-medium text-zinc-300 font-sans truncate max-w-[140px] text-right">
                  {selectedTrain.nextStation}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pb-1 border-b border-zinc-900/60">
                <span className="text-zinc-500 font-sans">Estimated Arrival</span>
                <span className="font-bold text-purple-400 font-mono">{selectedTrain.eta}</span>
              </div>

              <div className="flex items-center justify-between text-xs pb-1 border-b border-zinc-900/60">
                <span className="text-zinc-500 font-sans">Fuel/Power Level</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                    <div 
                      className={`h-full rounded-full ${selectedTrain.fuelLevel < 50 ? 'bg-rose-500' : 'bg-purple-500'}`} 
                      style={{ width: `${selectedTrain.fuelLevel}%` }} 
                    />
                  </div>
                  <span className="font-bold text-zinc-200 font-mono text-[10px]">{selectedTrain.fuelLevel}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pb-1 border-b border-zinc-900/60">
                <span className="text-zinc-500 font-sans">Passenger Load</span>
                <span className={`font-semibold text-xs font-sans ${
                  selectedTrain.passengerLoad === 'High' ? 'text-rose-400' : 'text-zinc-300'
                }`}>
                  {selectedTrain.passengerLoad}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pb-1 border-b border-zinc-900/60">
                <span className="text-zinc-500 font-sans">Engine Temp</span>
                <span className={`font-semibold font-sans ${
                  selectedTrain.engineTemp === 'Elevated' ? 'text-amber-400 animate-pulse' : 'text-emerald-400'
                }`}>
                  {selectedTrain.engineTemp}
                </span>
              </div>
            </div>

            {/* Live Sparkline/Chart for Speed (glowing) */}
            <div className="mt-8 bg-zinc-900/50 p-4 rounded-xl border border-zinc-900">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-3">
                Telemetry Speed History (mph)
              </span>
              <div className="h-16 flex items-end">
                {/* SVG Sparkline path */}
                <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Area fill path */}
                  <path
                    d={`M 0 30 
                        L 0 ${30 - (selectedTrain.speedHistory[0] / 150) * 20} 
                        L 16 ${30 - (selectedTrain.speedHistory[1] / 150) * 20} 
                        L 33 ${30 - (selectedTrain.speedHistory[2] / 150) * 20} 
                        L 50 ${30 - (selectedTrain.speedHistory[3] / 150) * 20} 
                        L 66 ${30 - (selectedTrain.speedHistory[4] / 150) * 20} 
                        L 83 ${30 - (selectedTrain.speedHistory[5] / 150) * 20} 
                        L 100 ${30 - (selectedTrain.speedHistory[6] / 150) * 20} 
                        L 100 30 Z`}
                    fill="url(#sparklineGrad)"
                  />
                  {/* Line stroke path */}
                  <path
                    d={`M 0 ${30 - (selectedTrain.speedHistory[0] / 150) * 20} 
                        L 16 ${30 - (selectedTrain.speedHistory[1] / 150) * 20} 
                        L 33 ${30 - (selectedTrain.speedHistory[2] / 150) * 20} 
                        L 50 ${30 - (selectedTrain.speedHistory[3] / 150) * 20} 
                        L 66 ${30 - (selectedTrain.speedHistory[4] / 150) * 20} 
                        L 83 ${30 - (selectedTrain.speedHistory[5] / 150) * 20} 
                        L 100 ${30 - (selectedTrain.speedHistory[6] / 150) * 20}`}
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  {/* Glowing end node point */}
                  <circle cx="100" cy={30 - (selectedTrain.speedHistory[6] / 150) * 20} r="2" fill="#a855f7" className="pulse-glow" />
                </svg>
              </div>
            </div>
          </div>

          {/* Large Action Trigger */}
          <button
            id="tracker-schedule-btn"
            className="w-full mt-6 bg-purple-600 hover:bg-purple-500 border border-purple-500/20 text-white font-medium text-xs py-3 px-4 rounded-xl shadow-lg hover:shadow-purple-500/20 transition-all duration-200 cursor-pointer text-center"
          >
            View Full Schedule & History
          </button>
        </div>

      </div>
    </div>
  );
}
