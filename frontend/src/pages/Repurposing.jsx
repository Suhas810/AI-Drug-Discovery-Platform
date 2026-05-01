import React, { useState } from 'react';
import axios from 'axios';
import { ShieldPlus, Activity, Database } from 'lucide-react';

const API_URL = 'http://localhost:8000';

export default function Repurposing() {
  const [smiles, setSmiles] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handlePredict = async () => {
    if (!smiles) return;
    setLoading(true);
    setResults(null);
    try {
      const res = await axios.get(`${API_URL}/similarity`, { params: { smiles } });
      if (res.data.error) throw new Error(res.data.error);
      setResults(res.data);
    } catch (err) {
      console.error(err);
      setResults([]);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-neonBlue to-neonPurple bg-clip-text text-transparent mb-2">Drug Repurposing Engine</h1>
        <p className="text-gray-400">Match molecular topologies with existing drug profiles using Morgan Fingerprints.</p>
      </header>

      <div className="bg-panelBG border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group max-w-2xl">
        <div className="flex items-center gap-4 mb-6 relative">
          <div className="p-3 bg-neonBlue/10 rounded-xl text-neonBlue"><ShieldPlus size={24} /></div>
          <h2 className="text-xl font-bold">Query Similarity</h2>
        </div>
        
        <div className="space-y-4 relative">
          <div>
            <label className="text-sm text-gray-400 block mb-2">Target SMILES String</label>
            <input 
              type="text" 
              value={smiles}
              onChange={(e) => setSmiles(e.target.value)}
              placeholder="e.g. CCO" 
              className="w-full bg-darkBG border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neonBlue transition-all"
            />
          </div>
          <button 
            onClick={handlePredict}
            disabled={loading || !smiles}
            className="bg-gradient-to-r from-neonBlue to-neonPurple text-darkBG font-bold py-3 px-6 rounded-xl hover:shadow-neon transition-all w-full md:w-auto"
          >
             {loading ? "Searching..." : "Find Alternatives"}
          </button>
        </div>
      </div>

      {results && (
        <div className="bg-panelBG border border-gray-800 rounded-2xl p-6 shadow-xl w-full">
            <h3 className="text-xl font-bold mb-6 text-neonBlue flex items-center gap-2"><Database size={20} /> Ranked Similar Compounds</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {results.length === 0 ? <p className="text-gray-400 col-span-3">No matching compounds found or invalid SMILES.</p> : results.map((r, i) => (
                    <div key={i} className="bg-darkBG p-6 rounded-xl border border-gray-800 relative hover:border-neonBlue transition-colors group">
                         <div className="absolute top-4 right-4 bg-neonBlue/10 text-neonBlue px-3 py-1 rounded-full text-xs font-bold border border-neonBlue/20">
                             {(r.similarity * 100).toFixed(1)}% Sim
                         </div>
                         <h4 className="text-2xl font-bold text-white mb-1 group-hover:text-neonBlue transition-colors">{r.drug}</h4>
                         <p className="text-sm text-gray-400 mt-2 truncate"><span className="text-gray-500 block mb-1">Target</span>{r.target}</p>
                         <p className="text-sm text-gray-400 mt-2 truncate"><span className="text-gray-500 block mb-1">Disease</span>{r.disease}</p>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
}
