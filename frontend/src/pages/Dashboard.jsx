import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  Activity, Beaker, Database, CheckCircle, Search, Zap, RotateCcw, Upload,
  TrendingUp, AlertTriangle, Target, Bell, Settings, ChevronRight,
  Play, Pause, Square, ArrowRight, Cpu, Server, HardDrive
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts';

export default function Dashboard() {
  const [kpiData, setKpiData] = useState({
    models: { value: 5, trend: '+2', sparkline: [3,4,4,5,5,5] },
    compounds: { value: 12402, trend: '+8%', sparkline: [11000,11500,11800,12000,12200,12402] },
    inferences: { value: 348, trend: '+15%', sparkline: [280,300,320,330,340,348] },
    status: 'online'
  });

  const [activityData, setActivityData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [distributionData, setDistributionData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [systemHealth, setSystemHealth] = useState([]);

  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New prediction model deployed', time: '5 min ago', read: false },
    { id: 2, message: 'System maintenance scheduled', time: '1 hour ago', read: false },
  ]);

  const [showNotifications, setShowNotifications] = useState(false);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, activityRes, performanceRes, distributionRes, activitiesRes, insightsRes, healthRes] = await Promise.all([
          axios.get('http://localhost:5000/api/dashboard/stats'),
          axios.get('http://localhost:5000/api/dashboard/activity'),
          axios.get('http://localhost:5000/api/dashboard/performance'),
          axios.get('http://localhost:5000/api/dashboard/distribution'),
          axios.get('http://localhost:5000/api/dashboard/activities'),
          axios.get('http://localhost:5000/api/dashboard/insights'),
          axios.get('http://localhost:5000/api/dashboard/health'),
        ]);

        setKpiData(statsRes.data);
        setActivityData(activityRes.data);
        setPerformanceData(performanceRes.data);
        setDistributionData(distributionRes.data.map(item => ({
          ...item,
          color: item.name === 'Antibiotics' ? '#00f2fe' :
                 item.name === 'Antivirals' ? '#4facfe' :
                 item.name === 'Oncology' ? '#ff6b6b' : '#ffd93d'
        })));
        setRecentActivities(activitiesRes.data);
        setAiInsights(insightsRes.data);
        setSystemHealth(healthRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Keep mock data as fallback
      }
    };

    fetchDashboardData();
  }, []);

  // Mock real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setKpiData(prev => ({
        ...prev,
        inferences: {
          ...prev.inferences,
          value: prev.inferences.value + Math.floor(Math.random() * 3),
          sparkline: [...(prev.inferences.sparkline || [280,300,320,330,340,348]).slice(1), prev.inferences.value + Math.floor(Math.random() * 3)]
        }
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const Sparkline = ({ data, color = '#00f2fe' }) => (
    <svg width="80" height="20" viewBox="0 0 80 20">
      <path
        d={`M ${data.map((val, i) => `${i * 13.3} ${20 - (val / Math.max(...data)) * 15}`).join(' L ')}`}
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-neonBlue to-neonPurple bg-clip-text text-transparent mb-2">
          AI PharmaX Control Center
        </h1>
        <p className="text-gray-400">Intelligent drug discovery powered by advanced AI</p>
      </motion.header>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-panelBG/50 backdrop-blur-md border border-gray-800 rounded-xl p-6"
      >
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Zap className="text-neonBlue" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Search, label: 'Search Drug', path: '/explorer' },
            { icon: Beaker, label: 'Run Prediction', path: '/predictions' },
            { icon: RotateCcw, label: 'Drug Repurposing', path: '/repurposing' },
            { icon: Upload, label: 'Upload Paper', path: '/analyzer' },
          ].map((action, index) => (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0, 242, 254, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              className="bg-panelBG border border-gray-700 rounded-lg p-4 hover:border-neonBlue/50 transition-all duration-300 group"
            >
              <action.icon className="w-8 h-8 text-gray-400 group-hover:text-neonBlue mb-2 mx-auto" />
              <span className="text-sm font-medium text-gray-300 group-hover:text-white">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {[
          { icon: Activity, label: 'Total Models', data: kpiData.models, color: 'text-neonBlue' },
          { icon: Database, label: 'Compounds', data: kpiData.compounds, color: 'text-neonPurple' },
          { icon: Beaker, label: 'Inferences', data: kpiData.inferences, color: 'text-neonBlue' },
          { icon: CheckCircle, label: 'System Status', data: { value: kpiData.status, trend: '' }, color: 'text-green-400' },
        ].map((kpi, index) => (
          <motion.div
            key={kpi.label}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-panelBG/80 backdrop-blur-md border border-gray-800 rounded-xl p-6 shadow-lg shadow-black/50 hover:shadow-neon/20 transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <kpi.icon className={`w-8 h-8 ${kpi.color}`} />
              <Sparkline data={kpi.data.sparkline || [1,2,3,4,5]} color="#00f2fe" />
            </div>
            <h3 className="font-bold text-gray-300 mb-2">{kpi.label}</h3>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-white tracking-widest">
                {typeof kpi.data.value === 'number' ? kpi.data.value.toLocaleString() : kpi.data.value}
              </p>
              {kpi.data.trend && (
                <span className="text-sm text-green-400 flex items-center gap-1">
                  <TrendingUp size={14} />
                  {kpi.data.trend}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-panelBG/80 backdrop-blur-md border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Activity className="text-neonBlue" />
            Prediction Activity (24h)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00f2fe" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Area
                type="monotone"
                dataKey="predictions"
                stroke="#00f2fe"
                fillOpacity={1}
                fill="url(#activityGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Model Performance */}
        <div className="bg-panelBG/80 backdrop-blur-md border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Target className="text-neonPurple" />
            Model Performance
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="metric" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" domain={[0, 1]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="value" fill="#4facfe" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Second Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Drug Distribution */}
        <div className="bg-panelBG/80 backdrop-blur-md border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Database className="text-neonBlue" />
            Drug Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {distributionData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-gray-300">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-panelBG/80 backdrop-blur-md border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Zap className="text-neonPurple" />
            AI Insights
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
            {aiInsights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border ${
                  insight.priority === 'high' ? 'border-red-500/50 bg-red-500/10' :
                  insight.priority === 'medium' ? 'border-yellow-500/50 bg-yellow-500/10' :
                  'border-blue-500/50 bg-blue-500/10'
                }`}
              >
                <div className="flex items-start gap-2">
                  {insight.type === 'alert' && <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />}
                  {insight.type === 'prediction' && <Target className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />}
                  {insight.type === 'suggestion' && <Zap className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />}
                  <p className="text-sm text-gray-300">{insight.message}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-panelBG/80 backdrop-blur-md border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Server className="text-green-400" />
            System Health
          </h3>
          <div className="space-y-4">
            {systemHealth.map((system, index) => (
              <div key={system.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full animate-pulse ${
                    system.status === 'online' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' :
                    system.status === 'warning' ? 'bg-yellow-500 shadow-[0_0_8px_#eab308]' :
                    'bg-red-500 shadow-[0_0_8px_#ef4444]'
                  }`} />
                  <span className="text-sm text-gray-300">{system.name}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  system.status === 'online' ? 'bg-green-500/20 text-green-400' :
                  system.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {system.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Third Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Recent Activity Feed */}
        <div className="bg-panelBG/80 backdrop-blur-md border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Activity className="text-neonBlue" />
            Recent Activity
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
            {recentActivities.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/30 border border-gray-700/50 hover:border-gray-600 transition-colors"
              >
                <div className={`w-2 h-2 rounded-full ${
                  activity.status === 'success' ? 'bg-green-500' :
                  activity.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-200">{activity.action}</p>
                  <p className="text-xs text-gray-400">{activity.target}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Drug Discovery Pipeline */}
        <div className="bg-panelBG/80 backdrop-blur-md border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <ChevronRight className="text-neonPurple" />
            Discovery Pipeline
          </h3>
          <div className="flex items-center justify-between">
            {[
              { step: 'Input Drug', icon: Upload, active: true },
              { step: 'Feature Extraction', icon: Cpu, active: true },
              { step: 'AI Model', icon: Beaker, active: true },
              { step: 'Prediction', icon: Target, active: false },
              { step: 'Output', icon: CheckCircle, active: false },
            ].map((step, index) => (
              <div key={step.step} className="flex flex-col items-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                    step.active
                      ? 'border-neonBlue bg-neonBlue/20 shadow-neon'
                      : 'border-gray-600 bg-gray-800'
                  } transition-all duration-300`}
                >
                  <step.icon className={`w-6 h-6 ${
                    step.active ? 'text-neonBlue' : 'text-gray-500'
                  }`} />
                </motion.div>
                <span className="text-xs text-center mt-2 text-gray-400">{step.step}</span>
                {index < 4 && (
                  <ArrowRight className="w-4 h-4 text-gray-600 absolute mt-6 ml-16" />
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
