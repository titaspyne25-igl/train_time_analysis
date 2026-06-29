import React from 'react';
import {
  LayoutDashboard,
  Map,
  BarChart3,
  Terminal,
  FileText,
  Settings,
  TrendingUp,
  ChevronDown,
  User
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  analystName: string;
}

export default function Sidebar({ activeTab, setActiveTab, analystName }: SidebarProps) {
  const menuItems = [
    { id: 'overview' as ActiveTab, label: 'Overview', icon: LayoutDashboard, desc: 'Train Operations Dashboard' },
    { id: 'tracker' as ActiveTab, label: 'Live Tracker', icon: Map, desc: 'Real-time Train Tracker' },
    { id: 'command' as ActiveTab, label: 'Logistics Command', icon: BarChart3, desc: 'Train Logistics Command' },
    { id: 'interactive' as ActiveTab, label: 'Interactive HUD', icon: Terminal, desc: 'Operations & Maintenance HUD' },
  ];

  return (
    <div id="sidebar-container" className="w-64 bg-zinc-950 text-zinc-50 flex flex-col h-full border-r border-zinc-800 shrink-0 select-none">
      {/* Brand Logo */}
      <div id="sidebar-brand" className="p-6 flex items-center gap-3 border-b border-zinc-800/80">
        <div className="bg-gradient-to-br from-[#a855f7] to-[#3b82f6] p-2 rounded-lg text-white shadow-lg flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-display font-bold text-lg tracking-tight leading-none text-zinc-100">Sysslan</h1>
          <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest font-mono">Bento Analytics</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div id="sidebar-nav" className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <p className="px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2 font-mono">
          Dashboards
        </p>
        
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-tab-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 text-left group relative ${
                isActive
                  ? 'bg-purple-500/10 text-purple-200 font-medium border border-purple-500/20 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-[#a855f7] rounded-r-md" />
              )}
              <Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-105 ${
                isActive ? 'text-[#a855f7]' : 'text-zinc-400 group-hover:text-zinc-300'
              }`} />
              <div className="flex flex-col">
                <span className="text-sm font-sans leading-tight font-medium">{item.label}</span>
                <span className="text-[10px] opacity-60 font-sans font-light hidden xl:inline">
                  {item.desc}
                </span>
              </div>
            </button>
          );
        })}

        {/* Secondary Section */}
        <div className="pt-6 border-t border-zinc-800/80 mt-6 space-y-1">
          <p className="px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2 font-mono">
            Utilities
          </p>
          <button 
            id="sidebar-util-reports"
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 text-left font-sans transition-all duration-200"
            onClick={() => setActiveTab('overview')}
          >
            <FileText className="w-4 h-4 text-zinc-500" />
            <span>Reports & Exports</span>
          </button>
          <button 
            id="sidebar-util-settings"
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 text-left font-sans transition-all duration-200"
            onClick={() => setActiveTab('interactive')}
          >
            <Settings className="w-4 h-4 text-zinc-500" />
            <span>System Settings</span>
          </button>
        </div>
      </div>

      {/* Analyst Profile Section */}
      <div id="sidebar-profile" className="p-4 bg-zinc-900/60 border-t border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            id="sidebar-profile-avatar"
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80"
            alt={analystName}
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-full border-2 border-purple-500/30 object-cover shrink-0 shadow-md bg-zinc-800"
          />
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-purple-400 font-mono tracking-wider font-light uppercase">Analyst</span>
            <span className="text-sm font-semibold truncate text-zinc-200 leading-tight font-sans">{analystName}</span>
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0 cursor-pointer hover:text-zinc-200 transition-colors" />
      </div>
    </div>
  );
}
