import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Charts from '../components/Charts';

const Analytics = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8000/dataset')
      .then(res => {
        setData(res.data);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500 tracking-tight drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">Advanced Analytics</h2>
        <p className="text-cyan-100/70 mt-1">Deep dive into data distributions and target correlations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/80 rounded-xl border border-cyan-900/40 p-6 shadow-[0_0_20px_rgba(0,0,0,0.3)] backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <h3 className="text-lg font-bold text-cyan-50 mb-6 drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">Top Target Proteins</h3>
          <div className="h-80">
            <Charts type="targets" data={data} />
          </div>
        </div>
        
        <div className="bg-slate-900/80 rounded-xl border border-cyan-900/40 p-6 shadow-[0_0_20px_rgba(0,0,0,0.3)] backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <h3 className="text-lg font-bold text-cyan-50 mb-6 drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">Average Binding Affinity by Disease</h3>
          <div className="h-80">
            <Charts type="affinityByDisease" data={data} />
          </div>
        </div>
        
        <div className="bg-slate-900/80 rounded-xl border border-cyan-900/40 p-6 shadow-[0_0_20px_rgba(0,0,0,0.3)] backdrop-blur-sm relative overflow-hidden group lg:col-span-2">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <h3 className="text-lg font-bold text-cyan-50 mb-6 drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">Full Disease vs Drug Correlation Overview</h3>
          <div className="h-80">
            <Charts type="disease" data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
