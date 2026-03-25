import React from 'react';
import PredictionForm from '../components/PredictionForm';

const Prediction = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="mb-8 border-b border-cyan-900/30 pb-6 relative">
        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500 tracking-tight drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">AI Drug Prediction</h2>
        <p className="text-cyan-100/70 mt-2">
          Enter target molecule features. Our Random Forest model will predict the corresponding disease classification in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <PredictionForm />
        </div>
        
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-cyan-900/50 rounded-xl p-5 shadow-[inset_0_0_20px_rgba(34,211,238,0.05)] shadow-[0_0_15px_rgba(0,0,0,0.3)]">
            <h4 className="font-bold text-cyan-400 mb-2 flex items-center drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]">
              <span className="text-xl mr-2">⚡</span> How it works
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              The underlying Random Forest model has been trained on thousands of known drug-target interactions. It evaluates the binding affinity along with encoded representations of the drug and target.
            </p>
          </div>
          
          <div className="bg-slate-900/80 border border-cyan-900/50 rounded-xl p-5 shadow-[0_0_15px_rgba(0,0,0,0.3)]">
            <h4 className="font-bold text-cyan-50 mb-3 hover:text-cyan-300 transition-colors drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">Parameter Guide</h4>
            <ul className="space-y-3 text-sm text-cyan-100/70">
              <li className="flex flex-col"><strong className="text-cyan-300">Binding Affinity</strong> Estimated interaction strength (typically 0.0 to 12.0)</li>
              <li className="flex flex-col"><strong className="text-cyan-300">Drug Code</strong> Encoded integer for specific molecule structure</li>
              <li className="flex flex-col"><strong className="text-cyan-300">Target Code</strong> Encoded integer for the protein target</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prediction;
