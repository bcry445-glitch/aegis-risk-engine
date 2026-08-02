import React, { useState, useEffect } from 'react';

const NetworkGraph = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveData = () => {
      fetch('https://aegis-risk-engine-a3z2.onrender.com/api/v1/telemetry')
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
          setLoading(false);
        });
    };

    fetchLiveData();
    const intervalId = setInterval(fetchLiveData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <div className="text-blue-400 font-semibold p-4">Mapping device network...</div>;
  }

  const hashCounts = sessions.reduce((acc, curr) => {
    acc[curr.canvas_hash] = (acc[curr.canvas_hash] || 0) + 1;
    return acc;
  }, {});
  
  let targetHash = null;
  let maxCount = 0;
  for (const [hash, count] of Object.entries(hashCounts)) {
    if (count > maxCount) {
      maxCount = count;
      targetHash = hash;
    }
  }

  const clusterNodes = sessions.filter(s => s.canvas_hash === targetHash);

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold text-white mb-6">Device Cluster Network</h2>
      
      {/* Increased min-height to 850px to ensure outer ring nodes are never cut off */}
      <div className="flex-1 bg-[#0b1120] border border-slate-700/50 rounded-lg relative overflow-auto shadow-inner min-h-[850px] flex items-center justify-center p-12">
        
        {/* Central Node */}
        <div className="absolute z-20 bg-green-950/90 border-2 border-green-500 p-6 rounded-full shadow-[0_0_30px_rgba(34,197,94,0.3)] flex flex-col items-center justify-center w-52 h-52">
            <div className="text-green-500 text-[11px] font-bold uppercase tracking-widest text-center mb-1">Target Fingerprint</div>
            <span className="font-mono text-green-300 font-bold text-lg">{targetHash || 'N/A'}</span>
            <span className="text-green-400 font-semibold text-xs mt-2 bg-green-900/40 px-3 py-1 rounded-full border border-green-800">
              {clusterNodes.length} Linked Sessions
            </span>
        </div>

        {/* Dynamic SVG Connecting Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 min-w-[800px] min-h-[850px]">
          {clusterNodes.map((node, index) => {
            const angle = (index / clusterNodes.length) * 2 * Math.PI;
            // Alternate radius: Inner ring at 28%, Outer ring at 42%
            const radius = index % 2 === 0 ? 28 : 42; 
            const x = 50 + radius * Math.cos(angle);
            const y = 50 + radius * Math.sin(angle);
            
            return (
              <line 
                key={`line-${node.session_id}`}
                x1="50%" 
                y1="50%" 
                x2={`${x}%`} 
                y2={`${y}%`} 
                stroke="#1e3a8a" 
                strokeWidth="2" 
                strokeDasharray="4,4" 
                className="opacity-50" 
              />
            );
          })}
        </svg>

        {/* Dynamic Connected Device Nodes */}
        {clusterNodes.map((node, index) => {
            const angle = (index / clusterNodes.length) * 2 * Math.PI;
            // Match the staggered radius calculation
            const radius = index % 2 === 0 ? 28 : 42;
            const x = 50 + radius * Math.cos(angle);
            const y = 50 + radius * Math.sin(angle);

            return (
              <div 
                key={`node-${node.session_id}`}
                className="absolute z-10 bg-[#1e293b] border border-blue-800/80 p-3.5 rounded-lg shadow-xl shadow-black/60 hover:scale-105 hover:z-30 transition-all cursor-pointer w-44 -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                  <div className="flex justify-between items-center gap-2 mb-1.5">
                      <div className="text-white font-bold text-xs truncate" title={node.session_id}>
                        {node.session_id}
                      </div>
                  </div>
                  <div className="text-slate-400 text-[11px] font-mono truncate">
                    IP: {node.ip_address}
                  </div>
                  <div className="text-slate-500 text-[10px] mt-1.5 pt-1 border-t border-slate-700/50">
                    {new Date(node.timestamp).toLocaleTimeString()}
                  </div>
              </div>
            );
        })}
      </div>
    </div>
  );
};

export default NetworkGraph;