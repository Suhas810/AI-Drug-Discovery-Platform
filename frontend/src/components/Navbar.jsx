import React from 'react';

const Navbar = () => {
  return (
    <header className="h-16 bg-slate-950/80 backdrop-blur-md border-b border-cyan-900/30 sticky top-0 z-40 px-6 flex items-center justify-between shadow-[0_10px_30px_-15px_rgba(34,211,238,0.05)]">
      <div className="md:hidden flex items-center space-x-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-[0_0_15px_rgba(34,211,238,0.5)]">
          AI
        </div>
        <span className="font-bold text-slate-100 tracking-tight drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">DrugDiscovery</span>
      </div>
      
      <div className="hidden md:block">
        <h1 className="text-lg font-bold text-cyan-50 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">Overview</h1>
      </div>

      <div className="flex items-center space-x-4">
        <button className="text-slate-400 hover:text-cyan-400 transition-colors p-2 rounded-full hover:bg-slate-900/80 shadow-[0_0_0_rgba(34,211,238,0)] hover:shadow-[0_0_15px_rgba(34,211,238,0.15)]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
        </button>
        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-500 border-2 border-slate-900 shadow-[0_0_15px_rgba(168,85,247,0.4)] ring-2 ring-cyan-900/50 cursor-pointer hover:ring-cyan-400 transition-all"></div>
      </div>
    </header>
  );
};

export default Navbar;
