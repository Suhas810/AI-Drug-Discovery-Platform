import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, Beaker, Dna, ArrowRight, Target } from 'lucide-react';

const API_URL = 'http://localhost:8000';

export default function Predictions() {
  const [loading, setLoading] = useState(false);
  const [smiles, setSmiles] = useState('');
  const [propResults, setPropResults] = useState(null);

  // Real ML States
  const [predictLoading, setPredictLoading] = useState(false);
  const [options, setOptions] = useState({ drugs: [], targets: [] });
  const [formData, setFormData] = useState({ drug_code: '', target_protein: '', binding_affinity: 5.0 });
  const [targetResult, setTargetResult] = useState(null);

  useEffect(() => {
     axios.get(`${API_URL}/api/prediction/options`).then(res => setOptions(res.data)).catch(console.error);
  }, []);

  const handlePredictProperties = async () => {
    if (!smiles) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/ml/properties`, { smiles });
      setPropResults(res.data.properties);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handlePredictTarget = async () => {
    if (!formData.drug_code || !formData.target_protein) return;
    setPredictLoading(true);
    setTargetResult(null);
    try {
      const res = await axios.post(`${API_URL}/predict`, {
         drug_code: formData.drug_code,
         target_protein: formData.target_protein,
         binding_affinity: parseFloat(formData.binding_affinity)
      });
      setTargetResult(res.data);
    } catch(err) {
      console.error(err);
    }
    setPredictLoading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <header>
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-neonBlue to-neonPurple bg-clip-text text-transparent mb-2">AI Predictions Engine</h1>
        <p className="text-gray-400">Run state-of-the-art inference models on your molecular compounds.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Drug-Target Interaction Model (Real Model) */}
        <div className="bg-panelBG border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
          <div className="flex items-center gap-4 mb-6 relative">
            <div className="p-3 bg-neonPurple/10 rounded-xl text-neonPurple"><Target size={24} /></div>
            <h2 className="text-xl font-bold">Drug-Target Interaction</h2>
          </div>
          <div className="space-y-4 relative">
            <div>
              <label className="text-sm text-gray-400 block mb-2">Given Drug</label>
              <select value={formData.drug_code} onChange={e => setFormData({...formData, drug_code: e.target.value})} className="w-full bg-darkBG border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neonPurple">
                 <option value="">Select a drug...</option>
                 {options.drugs.map(d => <option key={d.code} value={d.code}>{d.name} ({d.code})</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-2">Target Protein</label>
              <select value={formData.target_protein} onChange={e => setFormData({...formData, target_protein: e.target.value})} className="w-full bg-darkBG border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neonPurple">
                 <option value="">Select a protein...</option>
                 {options.targets.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-2">Binding Affinity (pIC50)</label>
              <input type="number" step="0.1" value={formData.binding_affinity} onChange={e => setFormData({...formData, binding_affinity: e.target.value})} className="w-full bg-darkBG border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neonPurple" />
            </div>
            <button onClick={handlePredictTarget} disabled={predictLoading || !formData.drug_code || !formData.target_protein} className="w-full bg-gradient-to-r from-neonBlue to-neonPurple text-darkBG font-bold py-3 px-4 rounded-xl hover:shadow-neon-purple transition-all flex justify-center disabled:opacity-50">
              {predictLoading ? 'Running...' : 'Predict Interaction'}
            </button>
            {targetResult && (
               <div className="mt-4 p-4 bg-darkBG border border-neonPurple/30 rounded-xl flex justify-between items-center">
                   <div>
                       <span className="text-gray-400 text-xs uppercase tracking-widest block">Predicted Disease ID</span>
                       <span className="text-2xl font-bold text-white">{targetResult.predicted_disease}</span>
                   </div>
                   <div className="text-right">
                       <span className="text-gray-400 text-xs uppercase tracking-widest block">Confidence</span>
                       <span className="text-2xl font-bold text-neonBlue">{(targetResult.confidence_score * 100).toFixed(1)}%</span>
                   </div>
               </div>
            )}
          </div>
        </div>

        {/* Existing Property Predictor */}
        <div className="bg-panelBG border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
          <div className="flex items-center gap-4 mb-6 relative">
            <div className="p-3 bg-neonBlue/10 rounded-xl text-neonBlue"><Beaker size={24} /></div>
            <h2 className="text-xl font-bold">Property Predictor</h2>
          </div>
          <div className="space-y-4 relative">
            <div>
              <label className="text-sm text-gray-400 block mb-2">Input SMILES String</label>
              <input type="text" value={smiles} onChange={(e) => setSmiles(e.target.value)} placeholder="CC(=O)OC1=CC=CC=C1C(=O)O" className="w-full bg-darkBG border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neonBlue transition-all" />
            </div>
            <button onClick={handlePredictProperties} disabled={loading || !smiles} className="w-full border border-neonBlue text-neonBlue hover:bg-neonBlue/10 font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2">
              {loading ? "Running Inference..." : "Run Predictor"}
            </button>
            {propResults && (
               <div className="mt-4 p-4 bg-darkBG border border-neonBlue/30 rounded-xl">
                   <div className="grid grid-cols-2 gap-4">
                      {Object.entries(propResults).map(([key, val]) => (
                        <div key={key}>
                          <span className="text-[10px] text-gray-400 uppercase tracking-widest block">{key}</span>
                          <span className="font-bold text-white">{val}</span>
                        </div>
                      ))}
                   </div>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
