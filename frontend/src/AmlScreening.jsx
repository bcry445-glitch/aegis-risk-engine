import React, { useState } from 'react';

const AmlScreening = () => {
  const [searchName, setSearchName] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleScreening = async (e) => {
    e.preventDefault();
    if (!searchName.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/v1/screen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: searchName }),
      });

      if (!response.ok) throw new Error('Screening request failed');
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Could not connect to AML Screening API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-bold text-white mb-6">Customer AML / PEP Screening</h2>
      
      {/* Search Form */}
      <form onSubmit={handleScreening} className="flex gap-4 mb-8">
        <input
          type="text"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          placeholder="Enter full name to screen..."
          className="flex-1 bg-[#1e293b] border border-slate-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-md font-semibold transition-colors disabled:opacity-50"
        >
          {loading ? 'Screening...' : 'Run Check'}
        </button>
      </form>

      {/* Error Message */}
      {error && <div className="text-red-400 mb-4">{error}</div>}

      {/* Results Display */}
      {result && (
        <div className={`border rounded-lg p-6 ${result.match_found ? 'bg-red-950/20 border-red-900/50' : 'bg-green-950/20 border-green-900/50'}`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-200">Screening Report</h3>
              <p className="text-slate-400 text-sm mt-1">Target: {result.input_name}</p>
            </div>
            <span className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${
              result.match_found ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200'
            }`}>
              {result.resolution_status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-[#0b1120] p-4 rounded border border-slate-800">
              <span className="block text-slate-500 text-xs uppercase mb-1">Match Status</span>
              <span className={`font-semibold ${result.match_found ? 'text-red-400' : 'text-green-400'}`}>
                {result.match_found ? 'Watchlist Hit Detected' : 'No Hit Detected'}
              </span>
            </div>
            <div className="bg-[#0b1120] p-4 rounded border border-slate-800">
              <span className="block text-slate-500 text-xs uppercase mb-1">Closest Database Match</span>
              <span className="font-semibold text-slate-200">{result.closest_match || 'N/A'}</span>
            </div>
            <div className="bg-[#0b1120] p-4 rounded border border-slate-800">
              <span className="block text-slate-500 text-xs uppercase mb-1">Levenshtein Distance</span>
              <span className="font-mono text-slate-200">{result.levenshtein_distance}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmlScreening;