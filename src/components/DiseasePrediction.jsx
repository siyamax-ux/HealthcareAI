import React, { useState } from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, LineChart, Line, Legend 
} from 'recharts';
import { 
  Activity, BarChart3, AlertOctagon, TrendingUp, MapPin, Sparkles, Filter 
} from 'lucide-react';
import { mockData } from '../data/mockData';

export const DiseasePrediction = () => {
  const [chartType, setChartType] = useState('area');
  const [selectedDisease, setSelectedDisease] = useState('all');

  return (
    <section id="analytics" className="py-24 relative overflow-hidden bg-slate-950/70">
      
      {/* Glow */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-400 mb-4">
            <BarChart3 className="w-4 h-4" />
            <span>Interactive Module 5</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Community Disease Prediction & Heatmap
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            AI epidemiological forecasting model predicting vector-borne outbreaks before seasonal monsoon surges.
          </p>
        </div>

        {/* Dashboard Shell */}
        <div className="rounded-3xl glass-panel p-6 sm:p-10 border border-slate-800 shadow-2xl">
          
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Seasonal Outbreak Risk Projection (2026)
              </h3>
              <p className="text-xs text-slate-400">Aggregated real-time data from 2,450 rural PHCs</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Chart Format Switch */}
              <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setChartType('area')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    chartType === 'area' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Area Trend
                </button>
                <button
                  onClick={() => setChartType('bar')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    chartType === 'bar' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Bar Chart
                </button>
                <button
                  onClick={() => setChartType('line')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    chartType === 'line' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Line Graph
                </button>
              </div>
            </div>
          </div>

          {/* Recharts Render Container */}
          <div className="h-80 w-full mb-8">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'area' ? (
                <AreaChart data={mockData.diseaseForecast}>
                  <defs>
                    <linearGradient id="colorDengue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorMalaria" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorViral" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="dengue" name="Dengue Risk" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorDengue)" />
                  <Area type="monotone" dataKey="malaria" name="Malaria Risk" stroke="#10b981" fillOpacity={1} fill="url(#colorMalaria)" />
                  <Area type="monotone" dataKey="viral" name="Viral Infections" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorViral)" />
                </AreaChart>
              ) : chartType === 'bar' ? (
                <BarChart data={mockData.diseaseForecast}>
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fill: '#94a3b8' }} />
                  <YAxis stroke="#64748b" tick={{ fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                  <Legend />
                  <Bar dataKey="dengue" name="Dengue Risk" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="malaria" name="Malaria Risk" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="viral" name="Viral Infections" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <LineChart data={mockData.diseaseForecast}>
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fill: '#94a3b8' }} />
                  <YAxis stroke="#64748b" tick={{ fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                  <Legend />
                  <Line type="monotone" dataKey="dengue" name="Dengue Risk" stroke="#0ea5e9" strokeWidth={3} />
                  <Line type="monotone" dataKey="malaria" name="Malaria Risk" stroke="#10b981" strokeWidth={3} />
                  <Line type="monotone" dataKey="viral" name="Viral Infections" stroke="#8b5cf6" strokeWidth={3} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Regional Outbreak Alert Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-800">
            <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-cyan-300 font-bold block">District 1 (Sonbhadra)</span>
                <span className="text-xs text-slate-300">Dengue Vector Index: <strong>High Alert</strong></span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-emerald-300 font-bold block">District 2 (Chhatarpur)</span>
                <span className="text-xs text-slate-300">Malaria Index: <strong>Controlled</strong></span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-purple-300 font-bold block">Preventive Action</span>
                <span className="text-xs text-slate-300">Larvicidal Spraying Dispatched</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
