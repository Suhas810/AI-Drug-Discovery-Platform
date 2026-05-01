const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';

app.use(cors());
app.use(express.json());

// Proxy requests to Python Microservice
app.get('/api/dataset', async (req, res) => {
    try {
        const response = await axios.get(`${PYTHON_SERVICE_URL}/dataset`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/predictions/predict', async (req, res) => {
    try {
        const response = await axios.post(`${PYTHON_SERVICE_URL}/predict`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/predictions/similarity', async (req, res) => {
    try {
        const response = await axios.get(`${PYTHON_SERVICE_URL}/similarity`, { params: req.query });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/predictions/options', async (req, res) => {
    try {
        const response = await axios.get(`${PYTHON_SERVICE_URL}/api/prediction/options`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Drugs endpoints for Drug Explorer
app.get('/api/drugs', async (req, res) => {
    try {
        const { page = 1, limit = 100, search = '' } = req.query;
        const response = await axios.get(`${PYTHON_SERVICE_URL}/dataset`);
        let data = response.data;

        // Apply search filter
        if (search) {
            data = data.filter(d =>
                d.drug?.toLowerCase().includes(search.toLowerCase()) ||
                d.drug_code?.toLowerCase().includes(search.toLowerCase()) ||
                d.smiles?.toLowerCase().includes(search.toLowerCase())
            );
        }

        const total = data.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + parseInt(limit);
        const paginatedData = data.slice(startIndex, endIndex);

        res.json({
            data: paginatedData,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/drugs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`${PYTHON_SERVICE_URL}/dataset`);
        const drug = response.data.find(d => d.drug_code === id);
        if (!drug) {
            return res.status(404).json({ error: 'Drug not found' });
        }
        res.json(drug);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/molecule3d', async (req, res) => {
    try {
        const response = await axios.get(`${PYTHON_SERVICE_URL}/molecule3d`, { params: req.query, responseType: 'text' });
        if (typeof response.data === 'string') {
            return res.json({ sdf: response.data });
        }
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// New AI Endpoints
app.post('/api/sider', async (req, res) => {
    try {
        const response = await axios.post(`${PYTHON_SERVICE_URL}/api/ml/sider`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/repurpose', async (req, res) => {
    try {
        const response = await axios.post(`${PYTHON_SERVICE_URL}/api/ml/repurpose`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/properties', async (req, res) => {
    try {
        const response = await axios.post(`${PYTHON_SERVICE_URL}/api/ml/properties`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/chat', async (req, res) => {
    try {
        const response = await axios.post(`${PYTHON_SERVICE_URL}/api/ml/chat`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// For summarizing, normally we would pipe the file upload to the Python backend using FormData.
app.post('/api/summarize', async (req, res) => {
    // For now we proxy a simple body, ideally we map multer directly to Python proxy
    try {
        res.status(200).json({ error: "Summarization proxy WIP. Frontend should call FastAPI directly for files if simpler." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mock data for dashboard
const mockDashboardData = {
  stats: {
    models: { value: 5, trend: '+2', sparkline: [3,4,4,5,5,5] },
    compounds: { value: 12402, trend: '+8%', sparkline: [11000,11500,11800,12000,12200,12402] },
    inferences: { value: 348, trend: '+15%', sparkline: [280,300,320,330,340,348] },
    status: 'online'
  },
  activity: [
    { time: '00:00', predictions: 12 },
    { time: '04:00', predictions: 8 },
    { time: '08:00', predictions: 25 },
    { time: '12:00', predictions: 45 },
    { time: '16:00', predictions: 38 },
    { time: '20:00', predictions: 22 },
  ],
  performance: [
    { metric: 'Accuracy', value: 0.92 },
    { metric: 'ROC-AUC', value: 0.88 },
    { metric: 'F1 Score', value: 0.85 },
  ],
  distribution: [
    { name: 'Antibiotics', value: 35 },
    { name: 'Antivirals', value: 25 },
    { name: 'Oncology', value: 20 },
    { name: 'Cardiology', value: 20 },
  ],
  recentActivities: [
    { id: 1, action: 'Prediction completed', target: 'CHEMBL123456', time: '2 min ago', status: 'success' },
    { id: 2, action: 'Model trained', target: 'SARS-CoV-2 Model', time: '15 min ago', status: 'success' },
    { id: 3, action: 'Paper uploaded', target: 'Drug Repurposing Study', time: '1 hour ago', status: 'info' },
    { id: 4, action: 'Chatbot query', target: 'Protein interaction', time: '2 hours ago', status: 'info' },
  ],
  aiInsights: [
    { type: 'prediction', message: 'High confidence drug-target interaction predicted for Aspirin vs COX-2 (95%)', priority: 'high' },
    { type: 'alert', message: 'Potential toxicity detected in compound CHEMBL987654', priority: 'medium' },
    { type: 'suggestion', message: 'Consider repurposing Ibuprofen for COVID-19 treatment (78% confidence)', priority: 'low' },
  ],
  systemHealth: [
    { name: 'API Gateway', status: 'online' },
    { name: 'ML Models', status: 'online' },
    { name: 'Database', status: 'online' },
    { name: 'File Storage', status: 'warning' },
  ]
};

const mockSearchResults = [
  { type: 'drug', name: 'Aspirin', id: 'CHEMBL25' },
  { type: 'protein', name: 'COX-2', id: 'P35354' },
  { type: 'drug', name: 'Ibuprofen', id: 'CHEMBL521' },
  { type: 'protein', name: 'SARS-CoV-2 Spike', id: 'P0DTC2' },
];

// Dashboard APIs
app.get('/api/dashboard/stats', (req, res) => {
  res.json(mockDashboardData.stats);
});

app.get('/api/dashboard/activity', (req, res) => {
  res.json(mockDashboardData.activity);
});

app.get('/api/dashboard/performance', (req, res) => {
  res.json(mockDashboardData.performance);
});

app.get('/api/dashboard/distribution', (req, res) => {
  res.json(mockDashboardData.distribution);
});

app.get('/api/dashboard/activities', (req, res) => {
  res.json(mockDashboardData.recentActivities);
});

app.get('/api/dashboard/insights', (req, res) => {
  res.json(mockDashboardData.aiInsights);
});

app.get('/api/dashboard/health', (req, res) => {
  res.json(mockDashboardData.systemHealth);
});

// Search API
app.get('/api/search', (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) {
    return res.json([]);
  }
  const results = mockSearchResults.filter(item =>
    item.name.toLowerCase().includes(q.toLowerCase()) ||
    item.id.toLowerCase().includes(q.toLowerCase())
  );
  res.json(results);
});

app.listen(PORT, () => {
    console.log(`Node.js API Gateway running on port ${PORT}`);
});
