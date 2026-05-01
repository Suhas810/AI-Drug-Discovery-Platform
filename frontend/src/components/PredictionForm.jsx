import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PredictionForm = () => {
  const [formData, setFormData] = useState({
    binding_affinity: 5.0,
    drug_code: '',
    target_protein: ''
  });
  
  const [prediction, setPrediction] = useState(null);
  const [confidenceScore, setConfidenceScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [options, setOptions] = useState({ drugs: [], targets: [] });
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/prediction/options');
        setOptions(response.data);
      } catch (err) {
        console.error("Failed to load prediction options", err);
      } finally {
        setIsLoadingOptions(false);
      }
    };
    fetchOptions();
  }, []);

  const diseaseMapping = {
    0: 'COVID-19',
    1: 'Cancer',
    2: 'Dengue',
    3: 'Malaria',
    4: 'Tuberculosis'
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);
    setConfidenceScore(null);
    
    try {
      const response = await axios.post('http://localhost:8000/predict', {
        binding_affinity: parseFloat(formData.binding_affinity),
        drug_code: formData.drug_code,
        target_protein: formData.target_protein
      });
      setPrediction(response.data.predicted_disease);
      setConfidenceScore(response.data.confidence_score);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        const detail = err.response.data.detail;
        if (Array.isArray(detail)) {
          setError(detail.map(d => `${d.loc[d.loc.length - 1]}: ${d.msg}`).join(', '));
        } else {
          setError(detail);
        }
      } else {
        setError('Prediction failed. Ensure the FastAPI backend is running and model inputs are valid.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/80 border border-cyan-900/50 rounded-xl p-8 shadow-[0_0_20px_rgba(0,0,0,0.4)] relative overflow-hidden backdrop-blur-sm group">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] opacity-60 pointer-events-none group-hover:opacity-100 transition-opacity duration-700"></div>
      
      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        
        {/* Slider for Binding Affinity */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-bold text-cyan-50 drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">Binding Affinity</label>
            <span className="text-cyan-400 font-mono font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">{formData.binding_affinity}</span>
          </div>
          <input 
            type="range" min="0" max="15" step="0.1" name="binding_affinity" 
            value={formData.binding_affinity} onChange={handleChange}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 shadow-[inset_0_0_5px_rgba(0,0,0,0.5)]"
          />
          <div className="flex justify-between mt-2 text-xs font-semibold text-cyan-100/50">
            <span>Weak (0.0)</span>
            <span>Strong (15.0)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="block text-sm font-bold text-cyan-50 drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">Drug Code</label>
              {isLoadingOptions && <span className="text-xs text-cyan-400/50 italic animate-pulse">Loading list...</span>}
            </div>
            <input 
              type="text" name="drug_code" list="drugs-list" required
              value={formData.drug_code} onChange={handleChange}
              autoComplete="off"
              className="w-full bg-slate-950/50 border border-cyan-900/40 text-cyan-50 font-mono rounded-lg p-3 text-sm focus:bg-slate-900 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 outline-none transition-all shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] placeholder-cyan-100/30"
              placeholder="e.g. CHEMBL739"
            />
            <datalist id="drugs-list">
              {options.drugs.map(d => <option key={d.code} value={d.code}>{d.name} ({d.code})</option>)}
            </datalist>
          </div>

          <div>
            <label className="block text-sm font-bold text-cyan-50 drop-shadow-[0_0_5px_rgba(255,255,255,0.2)] mb-2">Target Protein</label>
            <input 
              type="text" name="target_protein" list="targets-list" required
              value={formData.target_protein} onChange={handleChange}
              autoComplete="off"
              className="w-full bg-slate-950/50 border border-cyan-900/40 text-cyan-50 font-sans rounded-lg p-3 text-sm focus:bg-slate-900 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 outline-none transition-all shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] placeholder-cyan-100/30"
              placeholder="e.g. Spike Protein"
            />
            <datalist id="targets-list">
              {options.targets.map(t => <option key={t} value={t} />)}
            </datalist>
          </div>
        </div>

        <div className="pt-4">
          <button 
            type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black uppercase tracking-widest py-3.5 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(34,211,238,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center group"
          >
            {loading ? (
              <span className="flex items-center drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Processing Model...
              </span>
            ) : (
              <span className="flex items-center drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                Run AI Prediction 
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,1)] transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </span>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-950/40 border border-red-900/50 rounded-lg text-red-400 font-medium text-sm flex items-start shadow-[0_0_15px_rgba(239,68,68,0.15)]">
          <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
          {error}
        </div>
      )}

      {prediction !== null && (
        <div className="mt-8 p-6 bg-slate-950/80 border border-cyan-500/50 rounded-xl text-center shadow-[0_0_30px_rgba(34,211,238,0.2)] relative overflow-hidden animate-[pulse_150ms_ease-in-out]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_15px_rgba(34,211,238,0.8)]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none"></div>
          <div className="text-cyan-400 text-sm font-bold uppercase tracking-widest mb-2 flex justify-center items-center drop-shadow-[0_0_5px_rgba(34,211,238,0.4)]">
             Model Prediction
          </div>
          <div className="text-4xl font-black text-white tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            {diseaseMapping[prediction] || `Class ${prediction}`}
          </div>
          
          {confidenceScore !== null && (
            <div className="mt-5 flex flex-col items-center">
              <div className="flex items-center justify-between w-full max-w-xs mb-2">
                <span className="text-sm font-bold text-slate-300 tracking-wide">Confidence Score</span>
                <span className="text-sm font-black text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">{(confidenceScore * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full max-w-xs bg-slate-900 border border-slate-800 rounded-full h-2.5 overflow-hidden shadow-[inset_0_0_5px_rgba(0,0,0,0.5)]">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(34,211,238,0.8)]" 
                  style={{ width: `${confidenceScore * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          <p className="text-slate-400 text-xs mt-5 font-medium tracking-wide">Prediction derived from molecular alignment and binding affinity.</p>
        </div>
      )}
    </div>
  );
};

export default PredictionForm;
