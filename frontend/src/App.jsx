import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import Dashboard from './Dashboard';
import AmlScreening from './AmlScreening';
import NetworkGraph from './NetworkGraph';
import TelemetrySimulator from './TelemetrySimulator';

function App() {
  // State to track the currently selected tab in the sidebar
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {/* Conditional rendering based on the active tab */}
      {activeTab === 'overview' && <Dashboard />}
      {activeTab === 'aml' && <AmlScreening />}
      {activeTab === 'network' && <NetworkGraph />}
      {activeTab === 'simulator' && <TelemetrySimulator />}
    </DashboardLayout>
  );
}

export default App;