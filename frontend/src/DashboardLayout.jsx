import React from 'react';

const DashboardLayout = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="min-h-screen bg-[#0b1120] text-gray-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-slate-700/50 p-6 px-8">
        <h1 className="text-3xl font-bold text-blue-400 tracking-wide">AEGIS Investigator UI</h1>
        <p className="text-slate-400 mt-2 text-sm">Unified Customer Profile & Device Clusters</p>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r border-slate-700/50 bg-[#0f172a] p-5 flex flex-col gap-3 hidden md:flex">
            <div className="text-slate-500 uppercase text-xs font-bold tracking-widest mb-3 mt-2">
              Dashboard Controls
            </div>
            
            <button 
              onClick={() => setActiveTab('overview')}
              className={`py-2.5 px-4 rounded-md text-left text-sm transition-colors ${
                activeTab === 'overview' ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              Overview
            </button>
            
            <button 
              onClick={() => setActiveTab('aml')}
              className={`py-2.5 px-4 rounded-md text-left text-sm transition-colors ${
                activeTab === 'aml' ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              Customer Profiles (AML)
            </button>
            
            <button 
              onClick={() => setActiveTab('network')}
              className={`py-2.5 px-4 rounded-md text-left text-sm transition-colors ${
                activeTab === 'network' ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              Network Graph
            </button>

            <button 
              onClick={() => setActiveTab('simulator')}
              className={`py-2.5 px-4 rounded-md text-left text-sm transition-colors ${
                activeTab === 'simulator' ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              Inject Telemetry
            </button>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto bg-[#0b1120]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;