import React, { useState } from 'react';
import { ActiveTab } from './types';
import Sidebar from './components/Sidebar';
import OverviewDashboard from './components/OverviewDashboard';
import LiveTrackerDashboard from './components/LiveTrackerDashboard';
import LogisticsCommandDashboard from './components/LogisticsCommandDashboard';
import InteractiveOperationsDashboard from './components/InteractiveOperationsDashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const analystName = 'Titas Pyne';

  // Render the appropriate dashboard screen based on selection
  const renderDashboardContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewDashboard />;
      case 'tracker':
        return <LiveTrackerDashboard />;
      case 'command':
        return <LogisticsCommandDashboard />;
      case 'interactive':
        return <InteractiveOperationsDashboard />;
      default:
        return <OverviewDashboard />;
    }
  };

  return (
    <div id="app-container" className="flex h-screen w-screen overflow-hidden bg-bento-bg text-bento-text font-sans">
      {/* Universal Sidebar Left */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        analystName={analystName} 
      />

      {/* Main Screen Content Wrapper */}
      <main id="main-content" className="flex-1 flex flex-col min-w-0 h-full relative">
        <div className="absolute inset-0 transition-opacity duration-300 ease-in-out">
          {renderDashboardContent()}
        </div>
      </main>
    </div>
  );
}
