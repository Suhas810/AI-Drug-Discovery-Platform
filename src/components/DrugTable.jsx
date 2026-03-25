import React, { useState, useMemo } from 'react';
import axios from 'axios';
import * as $3Dmol from '3dmol';

const DrugTable = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDisease, setSelectedDisease] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [modalType, setModalType] = useState(null); // 'structure' or 'similar'
  const [activeDrug, setActiveDrug] = useState(null);
  const [similarDrugs, setSimilarDrugs] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(false);
  
  const [viewerMode, setViewerMode] = useState('2d');
  const [mol3dError, setMol3dError] = useState(null);
  const viewerRef = React.useRef(null);

  const diseases = useMemo(() => ['All', ...[...new Set(data.map(d => d.disease))].filter(Boolean)], [data]);
  
  React.useEffect(() => {
    if (modalType === 'structure' && viewerMode === '3d' && activeDrug) {
      if (viewerRef.current) viewerRef.current.innerHTML = '';
      setMol3dError(null);
      
      axios.get(`http://localhost:8000/molecule3d?smiles=${encodeURIComponent(activeDrug.smiles)}`)
        .then(res => {
          if (!viewerRef.current) return;
          const viewer = $3Dmol.createViewer(viewerRef.current, { backgroundColor: '#f8fafc' });
          viewer.addModel(res.data, "sdf");
          viewer.setStyle({}, { stick: { radius: 0.15 }, sphere: { radius: 0.4 } });
          viewer.zoomTo();
          viewer.render();
        })
        .catch(err => {
          console.error(err);
          setMol3dError("Could not generate 3D structure. The SMILES may be too complex.");
        });
    }
  }, [modalType, viewerMode, activeDrug]);

  const handleViewStructure = (row) => {
    setActiveDrug(row);
    setViewerMode('2d');
    setModalType('structure');
  };

  const handleFindSimilar = async (row) => {
    setActiveDrug(row);
    setModalType('similar');
    setSimilarLoading(true);
    setSimilarDrugs([]);
    try {
      const res = await axios.get(`http://localhost:8000/similarity?smiles=${encodeURIComponent(row.smiles)}&top_k=5`);
      setSimilarDrugs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setSimilarLoading(false);
    }
  };
  
  const filteredData = useMemo(() => {
    return data.filter(row => {
      const matchDisease = selectedDisease === 'All' || row.disease === selectedDisease;
      const matchSearch = row.drug?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchDisease && matchSearch;
    });
  }, [data, searchTerm, selectedDisease]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="bg-slate-900/80 rounded-xl border border-cyan-900/40 shadow-[0_0_20px_rgba(0,0,0,0.3)] backdrop-blur-sm overflow-hidden flex flex-col">
      <div className="p-5 border-b border-cyan-900/30 flex flex-col sm:flex-row gap-4 justify-between bg-slate-900/50">
        <div className="relative max-w-sm w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-cyan-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            type="text" 
            placeholder="Search by drug name..." 
            className="pl-10 w-full bg-slate-950/50 border border-cyan-900/40 text-cyan-50 text-sm rounded-lg focus:bg-slate-900 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 block p-2.5 transition-colors outline-none shadow-[inset_0_0_10px_rgba(0,0,0,0.3)] placeholder-cyan-100/30"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <select 
          className="bg-slate-950/50 border border-cyan-900/40 text-cyan-50 text-sm rounded-lg focus:bg-slate-900 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 block p-2.5 outline-none transition-colors shadow-[inset_0_0_10px_rgba(0,0,0,0.3)]"
          value={selectedDisease}
          onChange={(e) => { setSelectedDisease(e.target.value); setCurrentPage(1); }}
        >
          {diseases.map(d => <option key={d} value={d} className="bg-slate-900">{d === 'All' ? 'All Diseases' : d}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-cyan-100/80">
          <thead className="bg-slate-900/80 text-xs uppercase text-cyan-500 font-bold border-b border-cyan-900/40 tracking-wider">
            <tr>
              <th className="px-4 py-4">Drug Code</th>
              <th className="px-6 py-4">Drug Name</th>
              <th className="px-6 py-4">Target Protein</th>
              <th className="px-6 py-4">Binding Affinity</th>
              <th className="px-6 py-4">Disease Assoc.</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan-900/20">
            {paginatedData.length > 0 ? paginatedData.map((row, idx) => (
              <tr key={idx} className="hover:bg-cyan-900/20 transition-colors group">
                <td className="px-4 py-4">
                  <span className="font-mono text-xs font-bold text-cyan-400 bg-slate-950 px-2 py-1 rounded border border-cyan-800/60 shadow-[inset_0_0_8px_rgba(34,211,238,0.1)]">{row.drug_code || 'N/A'}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-cyan-50 drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">{row.drug}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-cyan-100/90 font-medium">{row.target}</div>
                  {row.target_code !== undefined && <div className="text-xs text-cyan-100/40 mt-0.5">Code: {row.target_code}</div>}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <span className="font-mono text-cyan-300 font-medium">{row.binding_affinity?.toFixed(3) || 'N/A'}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-950/40 text-cyan-300 border border-cyan-700/50 shadow-[0_0_8px_rgba(34,211,238,0.2)]">
                    {row.disease}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button onClick={() => handleViewStructure(row)} className="text-cyan-400 hover:text-cyan-300 text-xs font-bold bg-cyan-950/50 hover:bg-cyan-900 px-2.5 py-1.5 rounded-md transition-colors border border-cyan-800/50 hover:border-cyan-500/80 shadow-[0_0_10px_rgba(34,211,238,0.1)] hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                      Structure
                    </button>
                    <button onClick={() => handleFindSimilar(row)} className="text-blue-400 hover:text-blue-300 text-xs font-bold bg-blue-950/50 hover:bg-blue-900 px-2.5 py-1.5 rounded-md transition-colors border border-blue-800/50 hover:border-blue-500/80 shadow-[0_0_10px_rgba(59,130,246,0.1)] hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                      Similar
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-cyan-100/60">
                  <div className="flex flex-col items-center">
                    <svg className="w-10 h-10 text-cyan-900/50 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    No matching records found.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-cyan-900/40 flex items-center justify-between bg-slate-900/60">
          <span className="text-sm text-cyan-100/60">
            Showing <span className="font-bold text-cyan-400">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-cyan-400">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> of <span className="font-bold text-cyan-400">{filteredData.length}</span> Entries
          </span>
          <div className="flex space-x-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-cyan-900/50 text-sm font-bold rounded-md text-cyan-300 bg-slate-900 hover:bg-slate-800 hover:border-cyan-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              Prev
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-cyan-900/50 text-sm font-bold rounded-md text-cyan-300 bg-slate-900 hover:bg-slate-800 hover:border-cyan-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-[4px]">
          <div className="bg-slate-900 rounded-2xl shadow-[0_0_40px_rgba(34,211,238,0.2)] max-w-2xl w-full max-h-[90vh] overflow-y-auto overflow-hidden border border-cyan-500/50">
            <div className="p-6 border-b border-cyan-900/50 flex justify-between items-center bg-slate-950/80">
              <h3 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500 drop-shadow-[0_0_5px_rgba(34,211,238,0.4)]">
                {modalType === 'structure' ? `Molecular Structure: ${activeDrug.drug}` : `Chemically Similar Drugs: ${activeDrug.drug}`}
              </h3>
              <button onClick={() => setModalType(null)} className="text-cyan-400/60 hover:text-cyan-400 transition-colors p-1 bg-slate-950 hover:bg-slate-800 rounded-full border border-cyan-900/30">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6">
              {modalType === 'structure' ? (
                <div className="flex flex-col items-center justify-center py-6">
                  
                  {/* View Toggles */}
                  <div className="flex bg-slate-950/80 border border-cyan-900/50 p-1 rounded-lg mb-6 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] w-full max-w-xs">
                    <button 
                      onClick={() => setViewerMode('2d')}
                      className={`flex-1 py-1.5 text-sm font-bold rounded-md transition-all ${viewerMode === '2d' ? 'bg-cyan-950 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.3)] border border-cyan-500/50' : 'text-slate-500 hover:text-cyan-300'}`}
                    >
                      2D Image
                    </button>
                    <button 
                      onClick={() => setViewerMode('3d')}
                      className={`flex-1 py-1.5 text-sm font-bold rounded-md transition-all ${viewerMode === '3d' ? 'bg-blue-950 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)] border border-blue-500/50' : 'text-slate-500 hover:text-blue-300'}`}
                    >
                      3D Interactive
                    </button>
                  </div>

                  <div className="bg-slate-950 border-2 border-cyan-900/50 rounded-2xl p-6 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] w-full max-w-sm flex items-center justify-center overflow-hidden" style={{ minHeight: '300px' }}>
                    {viewerMode === '2d' ? (
                      <img 
                        src={`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encodeURIComponent(activeDrug.smiles)}/PNG?record_type=2d&image_size=500x500`} 
                        alt={`Structure of ${activeDrug.drug}`}
                        className="max-w-full h-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.7)] mix-blend-screen mix-blend-mode invert grayscale contrast-200"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/500x500/0f172a/38bdf8?text=Structure+Not+Found'; }}
                      />
                    ) : (
                      <div className="w-full h-full min-h-[300px] relative flex items-center justify-center bg-slate-950/80 rounded-lg">
                        {mol3dError ? (
                          <div className="text-red-400 text-sm text-center p-4">
                            <svg className="w-8 h-8 mx-auto mb-2 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                            {mol3dError}
                          </div>
                        ) : (
                          <div ref={viewerRef} className="absolute inset-0 w-full h-full cursor-move invert"></div>
                        )}
                        {/* Empty spinner before load */}
                        {!mol3dError && !viewerRef.current?.innerHTML && (
                           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 absolute z-0 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="mt-8 w-full">
                    <p className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-2 text-center drop-shadow-[0_0_5px_rgba(34,211,238,0.3)]">SMILES Notation</p>
                    <div className="text-sm text-cyan-100 font-mono bg-slate-950 p-4 rounded-xl border border-cyan-900/50 break-all text-center shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
                      {activeDrug.smiles}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {similarLoading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4 shadow-[0_0_15px_rgba(59,130,246,0.6)]"></div>
                      <p className="text-sm text-slate-400 font-medium">Computing Tanimoto similarities using Morgan Fingerprints...</p>
                    </div>
                  ) : similarDrugs.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl border border-cyan-900/40 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                      <table className="w-full text-left text-sm text-slate-300">
                        <thead className="bg-slate-950/80 text-xs uppercase text-cyan-500 font-bold border-b border-cyan-900/60">
                          <tr>
                            <th className="px-5 py-4">Similarity</th>
                            <th className="px-5 py-4">Drug</th>
                            <th className="px-5 py-4">Disease Assoc.</th>
                            <th className="px-5 py-4 text-right">Binding Aff.</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-cyan-900/30 bg-slate-900/50">
                          {similarDrugs.map((simDrug, idx) => (
                            <tr key={idx} className="hover:bg-cyan-900/20 transition-colors">
                              <td className="px-5 py-4">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-950 text-blue-400 font-mono text-xs font-bold border border-blue-900/50 shadow-[0_0_8px_rgba(59,130,246,0.2)]">
                                  {(simDrug.similarity * 100).toFixed(1)}%
                                </span>
                              </td>
                              <td className="px-5 py-4">
                                <span className="font-bold text-cyan-50">{simDrug.drug}</span>
                              </td>
                              <td className="px-5 py-4">
                                <span className="text-cyan-100/70">{simDrug.disease}</span>
                              </td>
                              <td className="px-5 py-4 text-right font-mono text-cyan-300">
                                {simDrug.binding_affinity?.toFixed(3) || 'N/A'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12 flex flex-col items-center bg-slate-950/50 rounded-xl border border-cyan-900/30 border-dashed">
                      <svg className="w-12 h-12 text-cyan-900 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                      <h4 className="text-cyan-400 font-bold mb-1">No Similar Drugs Found</h4>
                      <p className="text-cyan-100/50 text-sm max-w-xs mx-auto">Could not find structurally similar molecules for this query within the database.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrugTable;
