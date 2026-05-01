import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database, Search, Box, Eye, EyeOff, Copy, ChevronDown, ChevronUp,
  Loader, AlertCircle, CheckCircle, Zap, Atom, Scale, Droplets
} from 'lucide-react';

const API_URL = 'http://localhost:5000';

export default function DrugExplorer() {
  const location = useLocation();
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [viewMode, setViewMode] = useState('3d'); // '2d' or '3d'
  const [molData, setMolData] = useState(null);
  const [molLoading, setMolLoading] = useState(false);
  const [mol3dError, setMol3dError] = useState(null);
  const [drugDetails, setDrugDetails] = useState(null);
  const viewerRef = useRef(null);
  const [viewer, setViewer] = useState(null);

  // Handle initial drug selection from navigation
  useEffect(() => {
    if (location.state?.selectedDrugId) {
      // Fetch the drug and select it
      axios.get(`${API_URL}/api/drugs/${location.state.selectedDrugId}`)
        .then(res => {
          loadMolecule(res.data);
        })
        .catch(err => console.error('Error loading selected drug:', err));
    }
  }, [location.state]);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch drugs with pagination
  const fetchDrugs = async (pageNum = 1, searchTerm = '', append = false) => {
    try {
      setLoading(true);
      let response;
      try {
        response = await axios.get(`${API_URL}/api/drugs`, {
          params: { page: pageNum, limit: 50, search: searchTerm }
        });
      } catch (primaryError) {
        console.warn('Primary drug API failed, falling back to Python dataset', primaryError);
        const fallback = await axios.get('http://localhost:8000/dataset');
        const allData = Array.isArray(fallback.data) ? fallback.data : [];
        const filtered = allData.filter(d =>
          d.drug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.drug_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.smiles?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const startIndex = (pageNum - 1) * 50;
        const paginatedData = filtered.slice(startIndex, startIndex + 50);
        setDrugs(append ? prev => [...prev, ...paginatedData] : paginatedData);
        setTotal(filtered.length);
        setHasMore(pageNum * 50 < filtered.length);
        setPage(pageNum);
        return;
      }

      const { data, total: totalCount, totalPages } = response.data;

      if (append) {
        setDrugs(prev => [...prev, ...data]);
      } else {
        setDrugs(data);
      }

      setTotal(totalCount);
      setHasMore(pageNum < totalPages);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching drugs:', error);
      setDrugs([]);
      setTotal(0);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrugs(1, debouncedSearch);
  }, [debouncedSearch]);

  useEffect(() => {
    if (viewMode !== '3d') return;

    if (!viewer) {
      const interval = setInterval(() => {
        if (viewerRef.current && window.$3Dmol) {
          const config = { backgroundColor: 'black' };
          const newViewer = window.$3Dmol.createViewer(viewerRef.current, config);
          setViewer(newViewer);
          clearInterval(interval);
        }
      }, 200);
      return () => clearInterval(interval);
    }
  }, [viewMode, viewer]);

  useEffect(() => {
    if (viewMode !== '3d' || !molData) return;
    if (!viewer) return;

    try {
      viewer.clear();
      viewer.addModel(molData, 'mol');
      viewer.setStyle({}, { stick: { color: 'spectrum' }, sphere: { scale: 0.3 } });
      viewer.zoomTo();
      viewer.render();
      setMol3dError(null);
    } catch (renderError) {
      console.error('3D viewer render error:', renderError);
      setMol3dError('Unable to render 3D structure. Please try another molecule.');
    }
  }, [viewer, molData, viewMode]);

  // Load molecule data and render
  const loadMolecule = async (drug) => {
    setSelectedDrug(drug);
    setViewMode('3d');
    setMolLoading(true);
    setMolData(null);
    setDrugDetails(null);

    try {
      // Fetch detailed drug info
      const detailsRes = await axios.get(`${API_URL}/api/drugs/${drug.drug_code}`);
      setDrugDetails(detailsRes.data);

      // Fetch 3D structure
      let sdf = null;

      try {
        const molRes = await axios.get(`${API_URL}/api/molecule3d`, {
          params: { smiles: drug.smiles }
        });
        sdf = molRes.data?.sdf || (typeof molRes.data === 'string' ? molRes.data : null);
      } catch (proxyError) {
        console.warn('Node proxy failed, falling back to Python 3D service', proxyError);
      }

      if (!sdf) {
        try {
          const fallbackRes = await axios.get('http://localhost:8000/molecule3d', {
            params: { smiles: drug.smiles },
            responseType: 'text'
          });
          sdf = fallbackRes.data;
        } catch (fallbackError) {
          console.error('Fallback Python 3D service failed:', fallbackError);
        }
      }

      if (sdf) {
        setMolData(sdf);
        setMol3dError(null);
      } else {
        setMolData(null);
        setMol3dError('3D coordinates are not available for this molecule.');
      }
    } catch (error) {
      console.error('Error loading molecule:', error);
      setMolData(null);
      setMol3dError('Failed to fetch 3D structure from the service.');
    } finally {
      setMolLoading(false);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchDrugs(page + 1, debouncedSearch, true);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-neonBlue to-neonPurple bg-clip-text text-transparent mb-2">
          Drug Explorer
        </h1>
        <p className="text-gray-400">Interactive molecular exploration with 3D visualization</p>
      </motion.header>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by ChEMBL ID, Name, or SMILES..."
          className="w-full bg-panelBG/80 backdrop-blur-md border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-neonBlue focus:ring-1 focus:ring-neonBlue/50 transition-all duration-300"
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Drug List Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-panelBG/80 backdrop-blur-md border border-gray-800 rounded-xl overflow-hidden shadow-xl lg:col-span-1"
        >
          <div className="p-4 border-b border-gray-800 bg-darkBG/50 flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2">
              <Database size={18} className="text-neonPurple" />
              Drug Database
            </h3>
            <span className="text-xs text-gray-500">
              {loading ? 'Loading...' : `${drugs.length} of ${total}`}
            </span>
          </div>

          <div className="h-96 overflow-y-auto custom-scrollbar">
            <AnimatePresence>
              {drugs.map((drug, index) => (
                <motion.div
                  key={`${drug.drug_code}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => loadMolecule(drug)}
                  className={`p-4 cursor-pointer rounded-lg mx-2 my-1 transition-all duration-300 border ${
                    selectedDrug?.drug_code === drug.drug_code
                      ? 'bg-neonBlue/20 border-neonBlue shadow-neon'
                      : 'border-transparent hover:bg-gray-800/50 hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-neonBlue to-neonPurple rounded-full flex items-center justify-center flex-shrink-0">
                      <Atom size={14} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-neonBlue font-semibold text-sm truncate">
                        {drug.drug_code}
                      </div>
                      <div className="text-white text-sm truncate mt-1">
                        {drug.drug}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 truncate" title={drug.smiles}>
                        {drug.smiles || 'No SMILES'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {hasMore && (
              <div className="p-4 text-center">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="bg-neonBlue/20 hover:bg-neonBlue/30 text-neonBlue px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? <Loader className="animate-spin" size={16} /> : 'Load More'}
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Visualization Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-panelBG/80 backdrop-blur-md border border-gray-800 rounded-xl shadow-xl lg:col-span-2 overflow-hidden"
        >
          <div className="p-4 border-b border-gray-800 bg-darkBG/50 flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2">
              <Box size={18} className="text-neonBlue" />
              Molecular Visualization
            </h3>
            {selectedDrug && (
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode(viewMode === '3d' ? '2d' : '3d')}
                  className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                    viewMode === '3d'
                      ? 'bg-neonBlue/20 text-neonBlue'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {viewMode === '3d' ? <Eye size={14} /> : <EyeOff size={14} />}
                  {viewMode === '3d' ? '3D' : '2D'}
                </button>
              </div>
            )}
          </div>

          <div className="h-96 relative">
            {!selectedDrug ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-24 h-24 border-4 border-dashed border-gray-700 rounded-full animate-[spin_20s_linear_infinite] flex justify-center items-center relative mx-auto mb-4">
                  <div className="w-16 h-16 border border-neonBlue rounded-full animate-[spin_10s_reverse_linear_infinite]" />
                  <div className="w-8 h-8 bg-neonPurple/20 backdrop-blur-md rounded-full absolute shadow-neon-purple animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-gray-300 mb-2">Select a Drug</h3>
                <p className="text-gray-500 text-sm">Choose a compound from the list to visualize its structure</p>
              </div>
            ) : molLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <Loader className="animate-spin text-neonBlue" size={32} />
                  <p className="text-gray-400">Loading molecular structure...</p>
                </div>
              </div>
            ) : viewMode === '3d' ? (
              <div className="h-full relative">
                <div ref={viewerRef} className="w-full h-full" />
                {molLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="flex flex-col items-center gap-3">
                      <Loader className="animate-spin text-neonBlue" size={28} />
                      <p className="text-gray-300">Rendering 3D structure...</p>
                    </div>
                  </div>
                )}
                {!molLoading && mol3dError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-center p-6">
                    <AlertCircle className="text-yellow-500 mb-4" size={48} />
                    <h3 className="text-xl font-bold text-gray-300 mb-2">3D Structure Not Available</h3>
                    <p className="text-gray-500 text-sm">{mol3dError}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="bg-gray-800/50 rounded-lg p-6 max-w-md">
                  <h3 className="text-lg font-bold text-white mb-4">2D Structure</h3>
                  <div className="bg-white rounded p-4 mb-4">
                    <p className="text-black font-mono text-sm break-all">
                      {selectedDrug.smiles || 'No SMILES available'}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(selectedDrug.smiles)}
                    className="flex items-center gap-2 bg-neonBlue/20 hover:bg-neonBlue/30 text-neonBlue px-3 py-2 rounded-lg transition-colors"
                  >
                    <Copy size={14} />
                    Copy SMILES
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Drug Details Panel */}
      <AnimatePresence>
        {selectedDrug && drugDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-panelBG/80 backdrop-blur-md border border-gray-800 rounded-xl p-6"
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Zap className="text-neonPurple" />
              Drug Details: {drugDetails.drug}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Scale className="text-neonBlue" size={16} />
                    <span className="text-sm font-medium text-gray-300">Molecular Weight</span>
                  </div>
                  <p className="text-lg font-bold text-white">
                    {drugDetails.molecular_weight || 'N/A'}
                  </p>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplets className="text-neonPurple" size={16} />
                    <span className="text-sm font-medium text-gray-300">LogP</span>
                  </div>
                  <p className="text-lg font-bold text-white">
                    {drugDetails.logp || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Atom className="text-green-400" size={16} />
                    <span className="text-sm font-medium text-gray-300">H-bond Donors</span>
                  </div>
                  <p className="text-lg font-bold text-white">
                    {drugDetails.hbd || 'N/A'}
                  </p>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Atom className="text-red-400" size={16} />
                    <span className="text-sm font-medium text-gray-300">H-bond Acceptors</span>
                  </div>
                  <p className="text-lg font-bold text-white">
                    {drugDetails.hba || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Copy className="text-neonBlue" size={16} />
                  <span className="text-sm font-medium text-gray-300">SMILES String</span>
                </div>
                <div className="bg-black rounded p-3 font-mono text-xs text-green-400 break-all max-h-20 overflow-y-auto">
                  {drugDetails.smiles || 'No SMILES available'}
                </div>
                <button
                  onClick={() => copyToClipboard(drugDetails.smiles)}
                  className="mt-2 flex items-center gap-2 bg-neonBlue/20 hover:bg-neonBlue/30 text-neonBlue px-3 py-1 rounded transition-colors text-sm"
                >
                  <Copy size={12} />
                  Copy
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
