import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: '📊' },
    { name: 'Dataset Explorer', path: '/explorer', icon: '🔍' },
    { name: 'Drug Prediction', path: '/prediction', icon: '🧠' },
    { name: 'Analytics', path: '/analytics', icon: '📈' },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-cyan-900/30 hidden md:flex flex-col z-10 transition-all duration-300 relative shadow-[10px_0_30px_-15px_rgba(34,211,238,0.1)]">
      <div className="h-16 flex items-center px-6 border-b border-cyan-900/30 mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-[0_0_15px_rgba(34,211,238,0.5)]">
            AI
          </div>
          <span className="font-bold text-slate-100 tracking-tight text-lg drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">DrugDiscovery</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.name} 
              to={item.path}
              className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive 
                  ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.15)]' 
                  : 'text-slate-400 hover:bg-slate-900 hover:text-cyan-100 border border-transparent'
              }`}
            >
              <span className={`mr-3 text-lg transition-transform duration-200 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'group-hover:scale-110 opacity-70 group-hover:opacity-100'}`}>
                {item.icon}
              </span>
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-cyan-900/30">
        <div className="bg-slate-900 border border-cyan-900/50 rounded-xl p-4 shadow-[inset_0_0_20px_rgba(0,0,0,0.2)]">
          <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">FastAPI Status</p>
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
            </span>
            <span className="text-sm font-medium text-cyan-50 tracking-wide">Connected</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
