import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

// Mock Component Pages for Routing
import Predictions from './pages/Predictions';

import Dashboard from './pages/Dashboard';
import DrugExplorer from './pages/DrugExplorer';
import Repurposing from './pages/Repurposing';
import Chatbot from './pages/Chatbot';
import PaperAnalyzer from './pages/PaperAnalyzer';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="explorer" element={<DrugExplorer />} />
        <Route path="predictions" element={<Predictions />} />
        <Route path="repurposing" element={<Repurposing />} />
        <Route path="chatbot" element={<Chatbot />} />
        <Route path="analyzer" element={<PaperAnalyzer />} />
      </Route>
    </Routes>
  );
}

export default App;
