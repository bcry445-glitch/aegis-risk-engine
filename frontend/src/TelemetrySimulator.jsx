import React, { useState } from 'react';

const TelemetrySimulator = () => {
  const [formData, setFormData] = useState({
    session_id: `sess_${Math.random().toString(36).substr(2, 9)}`,
    canvas_hash: '5079ad69', // Defaulting to our known cluster hash for easy testing
    ip_address: ''
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch('http://localhost:5000/api/v1/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: formData.session_id,
          device_fingerprint: { canvas_hash: formData.canvas_hash },
          network_signals: { ip_address: formData.ip_address || 'unknown' }
        }),
      });

      if (!response.ok) throw new Error('Failed to ingest telemetry');
      
      setStatus({ type: 'success', message: 'Payload ingested successfully!' });
      // Generate a new random session ID for the next test
      setFormData({ ...formData, session_id: `sess_${Math.random().toString(36).substr(2, 9)}`, ip_address: '' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Could not connect to Telemetry API.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-white mb-2">Telemetry Simulator</h2>
      <p className="text-slate-400 mb-8 text-sm">Inject live device footprints into the AEGIS Risk Engine.</p>
      
      <form onSubmit={handleSubmit} className="bg-[#1e293b] border border-slate-700 p-6 rounded-lg shadow-lg space-y-5">
        
        {/* Session ID */}
        <div>
          <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Session ID</label>
          <input
            type="text"
            value={formData.session_id}
            onChange={(e) => setFormData({ ...formData, session_id: e.target.value })}
            className="w-full bg-[#0b1120] border border-slate-700 rounded p-2.5 text-white font-mono focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Canvas Hash */}
        <div>
          <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Canvas Hash (Device Fingerprint)</label>
          <input
            type="text"
            value={formData.canvas_hash}
            onChange={(e) => setFormData({ ...formData, canvas_hash: e.target.value })}
            className="w-full bg-[#0b1120] border border-slate-700 rounded p-2.5 text-white font-mono focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* IP Address */}
        <div>
          <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">IP Address (Optional)</label>
          <input
            type="text"
            value={formData.ip_address}
            onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
            placeholder="e.g., 192.168.1.50"
            className="w-full bg-[#0b1120] border border-slate-700 rounded p-2.5 text-white font-mono focus:border-blue-500 focus:outline-none"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-md font-bold tracking-wide transition-colors mt-4 disabled:opacity-50"
        >
          {loading ? 'Transmitting...' : 'Inject Telemetry Payload'}
        </button>

        {/* Status Messages */}
        {status && (
          <div className={`p-3 rounded mt-4 text-center font-semibold text-sm border ${
            status.type === 'success' ? 'bg-green-950/30 text-green-400 border-green-900' : 'bg-red-950/30 text-red-400 border-red-900'
          }`}>
            {status.message}
          </div>
        )}
      </form>
    </div>
  );
};

export default TelemetrySimulator;