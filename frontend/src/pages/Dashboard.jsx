import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StatsCards from '../components/StatsCards';
import Charts from '../components/Charts';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/dataset')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Error fetching dataset. Ensure FastAPI is running.');
        setLoading(false);
      });
  }, []);

  const diseases = [...new Set(data.map(d => d.disease))].filter(Boolean);
  const targets = [...new Set(data.map(d => d.target))].filter(Boolean);

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
      {error}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="mb-8 relative auto-cols-auto">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-lg blur opacity-20"></div>
        <div className="relative border-b border-cyan-900/30 pb-4">
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500 tracking-tight drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">Platform Overview</h2>
          <p className="text-slate-400 mt-1">Key metrics and distribution of the AI Drug Discovery dataset.</p>
        </div>
      </div>

      <StatsCards data={data} diseases={diseases} targets={targets} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/80 rounded-xl border border-cyan-900/40 p-6 shadow-[0_0_20px_rgba(0,0,0,0.3)] backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <h3 className="text-lg font-bold text-cyan-50 mb-6 drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">Binding Affinity Distribution</h3>
          <div className="h-72">
            <Charts type="affinity" data={data} />
          </div>
        </div>
        
        <div className="bg-slate-900/80 rounded-xl border border-cyan-900/40 p-6 shadow-[0_0_20px_rgba(0,0,0,0.3)] backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <h3 className="text-lg font-bold text-cyan-50 mb-6 drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">Disease Distribution</h3>
          <div className="h-72">
            <Charts type="disease" data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
