import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DrugTable from '../components/DrugTable';

const DatasetExplorer = () => {
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
      <div className="mb-6 flex flex-col md:flex-row justify-between md:items-end">
        <div>
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500 tracking-tight drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">Dataset Explorer</h2>
          <p className="text-cyan-100/70 mt-1">Search and filter through all available drug records.</p>
        </div>
      </div>
      
      <DrugTable data={data} />
    </div>
  );
};

export default DatasetExplorer;
