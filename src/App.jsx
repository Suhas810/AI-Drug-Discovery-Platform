import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import DatasetExplorer from './pages/DatasetExplorer';
import Prediction from './pages/Prediction';
import Analytics from './pages/Analytics';

function App() {
  return (
    <div className="flex h-screen bg-slate-950 text-slate-300 font-sans antialiased overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/explorer" element={<DatasetExplorer />} />
            <Route path="/prediction" element={<Prediction />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
