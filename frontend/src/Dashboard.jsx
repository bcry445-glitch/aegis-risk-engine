import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeHash, setActiveHash] = useState(null);

  useEffect(() => {
    const fetchLiveData = () => {
      fetch('https://aegis-risk-engine-a3z2.onrender.com/api/v1/devices')
        .then((res) => {
          if (!res.ok) throw new Error('API connection failed');
          return res.json();
        })
        .then((data) => {
          setSessions(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Fetch error:', err);
          setError('Could not connect to AEGIS Backend API');
          setLoading(false);
        });
    };

    // Initial fetch
    fetchLiveData();
    
    // Auto-poll every 5 seconds
    const intervalId = setInterval(fetchLiveData, 5000);
    
    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleHashClick = (hash) => {
    setActiveHash(activeHash === hash ? null : hash);
  };

  if (loading) {
    return <div className="text-blue-400 p-4 font-semibold">Loading active device clusters...</div>;
  }

  if (error && sessions.length === 0) {
    return <div className="text-red-400 p-4 font-semibold">{error}</div>;
  }

  return (
    <div className="flex flex-wrap gap-6"> 
      {sessions.map((session) => {
        const isDimmed = activeHash && activeHash !== session.canvas_hash;

        return (
          <div 
            key={session.session_id} 
            className={`bg-[#1e293b] border border-blue-900/50 rounded-lg w-80 flex flex-col text-sm shadow-md transition-all duration-300 ${
              isDimmed ? 'opacity-30 grayscale pointer-events-none' : 'shadow-black/20 hover:-translate-y-1'
            }`}
          >
            {/* Node Header */}
            <div className="flex justify-between items-center p-4 border-b border-slate-700/50">
               <span className="text-white font-bold text-base">{session.session_id}</span>
               <span className="px-2.5 py-1 border rounded text-xs bg-[#172554] text-blue-400 border-blue-800">
                 Device Node
               </span>
            </div>
            
            {/* Node Data */}
            <div className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-slate-400">Canvas Hash:</span>
                    <button 
                      onClick={() => handleHashClick(session.canvas_hash)}
                      className={`font-mono px-2 py-0.5 rounded transition-colors ${
                        session.canvas_hash === '5079ad69' ? 'text-green-400 bg-green-950/30 hover:bg-green-900/50' : 'text-slate-200 bg-slate-800 hover:bg-slate-700'
                      }`}
                      title="Click to highlight cluster"
                    >
                      {session.canvas_hash}
                    </button>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-400">IP Address:</span>
                    <span className="text-slate-200">{session.ip_address}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-400">Timestamp:</span>
                    <span className="text-slate-200">
                      {new Date(session.timestamp).toLocaleTimeString()}
                    </span>
                </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Dashboard;