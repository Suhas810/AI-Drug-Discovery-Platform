import React from 'react';

const StatsCard = ({ title, value, icon, trend }) => (
  <div className="bg-slate-900/80 rounded-xl border border-cyan-900/40 p-5 shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:border-cyan-400/80 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all duration-300 backdrop-blur-sm group">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-cyan-100/70 mb-1 tracking-wide">{title}</p>
        <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 to-blue-500 tracking-tight drop-shadow-[0_0_12px_rgba(34,211,238,0.4)] group-hover:drop-shadow-[0_0_16px_rgba(34,211,238,0.7)]">{value}</h3>
      </div>
      <div className="p-3 bg-slate-950/60 rounded-lg text-cyan-400 border border-cyan-900/50 shadow-[inset_0_0_10px_rgba(34,211,238,0.1)]">
        {icon}
      </div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center text-sm">
        <span className="font-medium text-cyan-400 bg-cyan-950/50 border border-cyan-900/50 px-2 py-0.5 rounded flex items-center shadow-[0_0_8px_rgba(34,211,238,0.2)]">
          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
          {trend}
        </span>
        <span className="text-slate-500 ml-2">vs last week</span>
      </div>
    )}
  </div>
);

const StatsCards = ({ data, diseases, targets }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard 
        title="Total Drugs" 
        value={[...new Set(data.map(d => d.drug))].length || 0} 
        icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>}
        trend="4.2%"
      />
      <StatsCard 
        title="Total Diseases" 
        value={diseases?.length || 0} 
        icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
      />
      <StatsCard 
        title="Total Targets" 
        value={targets?.length || 0} 
        icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>}
        trend="1.1%"
      />
      <StatsCard 
        title="Dataset Records" 
        value={data.length || 0} 
        icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>}
      />
    </div>
  );
};

export default StatsCards;
