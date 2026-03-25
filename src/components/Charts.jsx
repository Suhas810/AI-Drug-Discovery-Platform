import React, { useMemo } from 'react';
import { BarChart, Bar, PieChart, Pie, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

const COLORS = ['#22d3ee', '#3b82f6', '#8b5cf6', '#a855f7', '#06b6d4', '#4f46e5'];

const Charts = ({ type, data }) => {

  const chartData = useMemo(() => {
    if (type === 'disease') {
      const counts = data.reduce((acc, curr) => {
        acc[curr.disease] = (acc[curr.disease] || 0) + 1;
        return acc;
      }, {});
      return Object.keys(counts).map(d => ({ name: d, count: counts[d] })).sort((a,b) => b.count - a.count);
    
    } else if (type === 'affinity') {
      // Create buckets for affinity
      const buckets = { '0-2':0, '2-4':0, '4-6':0, '6-8':0, '8-10':0, '10+':0 };
      data.forEach(d => {
        const val = parseFloat(d.binding_affinity);
        if(isNaN(val)) return;
        if(val < 2) buckets['0-2']++;
        else if(val < 4) buckets['2-4']++;
        else if(val < 6) buckets['4-6']++;
        else if(val < 8) buckets['6-8']++;
        else if(val < 10) buckets['8-10']++;
        else buckets['10+']++;
      });
      return Object.keys(buckets).map(k => ({ range: k, count: buckets[k] }));
      
    } else if (type === 'targets') {
      const counts = data.reduce((acc, curr) => {
        if(curr.target) acc[curr.target] = (acc[curr.target] || 0) + 1;
        return acc;
      }, {});
      return Object.keys(counts).map(t => ({ name: t, count: counts[t] })).sort((a,b) => b.count - a.count).slice(0, 10);
    
    } else if (type === 'affinityByDisease') {
      const stats = data.reduce((acc, curr) => {
        const aff = parseFloat(curr.binding_affinity);
        if(!isNaN(aff) && curr.disease) {
          if(!acc[curr.disease]) acc[curr.disease] = { sum: 0, count: 0 };
          acc[curr.disease].sum += aff;
          acc[curr.disease].count += 1;
        }
        return acc;
      }, {});
      return Object.keys(stats).map(d => ({ name: d, avgAffinity: Number((stats[d].sum / stats[d].count).toFixed(2)) }));
    }
  }, [data, type]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-cyan-900/50 p-3 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.6)] text-sm backdrop-blur-sm">
          <p className="font-bold text-cyan-50 mb-2 drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">{label}</p>
          {payload.map((p, idx) => (
            <p key={idx} className="text-slate-300 flex items-center">
              <span className="inline-block w-2.5 h-2.5 rounded-full mr-2 shadow-[0_0_8px_rgba(255,255,255,0.4)]" style={{backgroundColor: p.color || p.fill}}></span>
              {p.name}: <span className="font-bold text-cyan-100 ml-1">{p.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (type === 'disease' || type === 'targets') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{top: 5, right: 30, left: 20, bottom: 5}}>
          <XAxis type="number" hide />
          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 13}} width={100} />
          <Tooltip content={<CustomTooltip />} cursor={{fill: '#1e293b'}} />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={type === 'targets' ? 16 : 24}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'affinityByDisease' || type === 'affinity') {
    return (
       <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{top: 20, right: 30, left: 0, bottom: 5}}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
          <XAxis dataKey={type === 'affinity' ? 'range' : 'name'} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 13}} />
          <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 13}} />
          <Tooltip content={<CustomTooltip />} cursor={{fill: '#1e293b'}} />
          <Bar dataKey={type === 'affinity' ? 'count' : 'avgAffinity'} fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={type === 'affinity' ? '#22d3ee' : COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return null;
};

export default Charts;
