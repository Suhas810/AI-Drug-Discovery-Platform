import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Database, Beaker, ShieldPlus, Bot, BookOpen } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: Home },
  { name: 'Drug Explorer', path: '/explorer', icon: Database },
  { name: 'Predictions', path: '/predictions', icon: Beaker },
  { name: 'Repurposing', path: '/repurposing', icon: ShieldPlus },
  { name: 'AI Chatbot', path: '/chatbot', icon: Bot },
  { name: 'Paper Analyzer', path: '/analyzer', icon: BookOpen },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-panelBG h-screen flex flex-col border-r border-gray-800 shrink-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-neonBlue to-neonPurple bg-clip-text text-transparent">
          AI PharmaX
        </h1>
        <p className="text-xs text-gray-400 mt-2">Next-Gen Drug Discovery</p>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-glowStart to-glowEnd text-neonBlue border border-neonBlue/30 shadow-neon'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50 hover:border-gray-700 border border-transparent'
                }`
              }
            >
              <Icon size={20} className="shrink-0" />
              <span className="font-medium text-sm">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

    </aside>
  );
}
