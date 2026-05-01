import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Search, Bell, Settings, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Sidebar from './Sidebar';

export default function Layout() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New prediction model deployed', time: '5 min ago', read: false },
    { id: 2, message: 'System maintenance scheduled for tonight', time: '1 hour ago', read: false },
    { id: 3, message: 'High-confidence drug interaction found', time: '2 hours ago', read: false },
  ]);

  // Mock search suggestions - will be replaced with API call
  const mockSuggestions = [
    { type: 'drug', name: 'Aspirin', id: 'CHEMBL25' },
    { type: 'protein', name: 'COX-2', id: 'P35354' },
    { type: 'drug', name: 'Ibuprofen', id: 'CHEMBL521' },
    { type: 'protein', name: 'SARS-CoV-2 Spike', id: 'P0DTC2' },
  ];

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      try {
        const response = await axios.get(`http://localhost:5000/api/search?q=${query}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error('Search error:', error);
        // Fallback to mock data
        const filtered = mockSuggestions.filter(item =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.id.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filtered);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchSelect = (item) => {
    if (item.type === 'drug') {
      // Navigate to drug explorer and pass the drug ID
      navigate('/explorer', { state: { selectedDrugId: item.id } });
    } else if (item.type === 'protein') {
      // Could navigate to protein explorer or predictions
      navigate('/predictions', { state: { selectedProtein: item.id } });
    }
    setSearchResults([]);
    setSearchQuery('');
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex min-h-screen bg-darkBG text-white font-sans selection:bg-neonBlue/30">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Enhanced Top Header */}
        <header className="h-16 border-b border-gray-800 bg-panelBG/50 flex items-center justify-between px-8 shrink-0 backdrop-blur-md">
          <div className="flex items-center gap-6">
            <h2 className="text-sm font-medium text-gray-300">AI PharmaX Control Center</h2>
          </div>

          {/* Global Search */}
          <div className="flex-1 max-w-md mx-8 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search drugs, proteins, CHEMBL IDs..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:border-neonBlue focus:outline-none focus:ring-1 focus:ring-neonBlue/50 transition-all duration-300 text-sm"
              />
            </div>

            {/* Search Results Dropdown */}
            <AnimatePresence>
              {searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-2 w-full bg-panelBG border border-gray-700 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto"
                >
                  {searchResults.map((result, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="px-4 py-3 hover:bg-gray-700/50 cursor-pointer border-b border-gray-700/50 last:border-b-0"
                      onClick={() => handleSearchSelect(result)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-white">{result.name}</span>
                          <span className="text-xs text-gray-400 ml-2">({result.id})</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          result.type === 'drug' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                        }`}>
                          {result.type}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-400" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-panelBG border border-gray-700 rounded-lg shadow-xl z-50"
                  >
                    <div className="p-4 border-b border-gray-700">
                      <h3 className="font-semibold text-white">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-4 border-b border-gray-700/50 hover:bg-gray-700/30 cursor-pointer ${
                            !notif.read ? 'bg-blue-500/10' : ''
                          }`}
                          onClick={() => markAsRead(notif.id)}
                        >
                          <p className="text-sm text-gray-200">{notif.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 text-center border-t border-gray-700">
                      <button className="text-sm text-neonBlue hover:text-neonPurple transition-colors">
                        View All Notifications
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Settings */}
            <div className="relative">
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-400" />
              </button>

              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-panelBG border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden"
                  >
                    <div className="p-3 border-b border-gray-700">
                      <h3 className="font-semibold text-white text-sm">Theme Settings</h3>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => { setTheme('dark'); setShowSettings(false); }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700/50 transition-colors flex items-center justify-between ${theme === 'dark' ? 'text-neonBlue' : 'text-gray-300'}`}
                      >
                        Dark Theme
                        {theme === 'dark' && <div className="w-1.5 h-1.5 rounded-full bg-neonBlue"></div>}
                      </button>
                      <button
                        onClick={() => { setTheme('system'); setShowSettings(false); }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700/50 transition-colors flex items-center justify-between ${theme === 'system' ? 'text-neonBlue' : 'text-gray-300'}`}
                      >
                        System Theme
                        {theme === 'system' && <div className="w-1.5 h-1.5 rounded-full bg-neonBlue"></div>}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Profile */}
            <div className="w-8 h-8 bg-gradient-to-r from-neonBlue to-neonPurple rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto w-full h-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
