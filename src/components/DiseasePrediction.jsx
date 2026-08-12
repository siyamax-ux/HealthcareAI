import React, { useState } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  BarChart, Bar, LineChart, Line, Legend, ReferenceLine,
} from 'recharts';
import {
  Activity, BarChart3, AlertOctagon, TrendingUp, MapPin, Sparkles,
  AlertTriangle, Thermometer, Droplets, Wind, ShieldAlert,
} from 'lucide-react';
import { mockData } from '../data/mockData';

/* ── Risk level colour helpers ── */
const RISK_COLORS = {
  'Low':               { bg: 'bg-emerald-500/15', border: 'border-emerald-500/40', text: 'text-emerald-400', dot: '#10b981' },
  'Moderate':          { bg: 'bg-amber-500/15',   border: 'border-amber-500/40',   text: 'text-amber-400',   dot: '#f59e0b' },
  'High':              { bg: 'bg-orange-500/15',  border: 'border-orange-500/40',  text: 'text-orange-400',  dot: '#f97316' },
  'Critical Outbreak': { bg: 'bg-rose-500/15',    border: 'border-rose-500/40',    text: 'text-rose-400',    dot: '#f43f5e' },
};

/* ── Custom tooltip ── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const month = mockData.diseaseForecast.find(d => d.month === label);
  const risk = month?.riskLevel || '';
  const rc = RISK_COLORS[risk] || RISK_COLORS['Low'];
  return (
    <div className="bg-slate-900/98 border border-slate-700 rounded-2xl p-3 shadow-2xl min-w-[160px]"
      style={{ backdropFilter: 'blur(12px)' }}>
      <p className="text-xs font-bold text-white mb-1">{label} 2026</p>
      {month && (
        <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold mb-2 ${rc.bg} ${rc.border} ${rc.text} border`}>
          {risk}
        </span>
      )}
      <div className="space-y-1">
        {payload.map(p => (
          <div key={p.dataKey} className="flex items-center justify-between gap-4 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
              <span className="text-slate-400">{p.name}</span>
            </span>
            <span className="font-bold text-white">{p.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Comparison tooltip ── */
function CompareTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const prev = payload.find(p => p.dataKey === 'actual2025');
  const next = payload.find(p => p.dataKey === 'forecast2026');
  const delta = prev && next ? next.value - prev.value : 0;
  return (
    <div className="bg-slate-900/98 border border-slate-700 rounded-2xl p-3 shadow-2xl min-w-[170px]"
      style={{ backdropFilter: 'blur(12px)' }}>
      <p className="text-xs font-bold text-white mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 text-[11px] mb-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
            <span className="text-slate-400">{p.name}</span>
          </span>
          <span className="font-bold text-white">{p.value}</span>
        </div>
      ))}
      {delta !== 0 && (
        <div className={`mt-1.5 pt-1.5 border-t border-slate-800 text-[10px] font-semibold ${delta < 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {delta < 0 ? '▼' : '▲'} {Math.abs(delta)} AI forecast vs last year
        </div>
      )}
    </div>
  );
}

/* ── Peak months helper ── */
const CRITICAL_MONTHS = mockData.diseaseForecast
  .filter(d => d.alert)
  .map(d => d.month);

/* ── Risk summary stats ── */
const peakMonth = mockData.diseaseForecast.reduce((a, b) => (a.dengue + a.malaria + a.viral + a.cholera) > (b.dengue + b.malaria + b.viral + b.cholera) ? a : b);
const totalCritical = mockData.diseaseForecast.filter(d => d.riskLevel === 'Critical Outbreak').length;

export const DiseasePrediction = () => {
  const [chartType,  setChartType]  = useState('area');
  const [viewMode,   setViewMode]   = useState('forecast');   // 'forecast' | 'compare'
  const [showCholera, setShowCholera] = useState(true);

  const data = viewMode === 'compare' ? mockData.forecastComparison : mockData.diseaseForecast;

  return (
    <section id="analytics" className="py-24 relative overflow-hidden bg-slate-950/70">

      {/* Background glows */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-rose-500/6 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-400 mb-4">
            <BarChart3 className="w-4 h-4" />
            <span>Interactive Module 5</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Community Disease Prediction &amp; Heatmap
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            AI epidemiological forecasting model predicting vector-borne outbreaks before seasonal monsoon surges.
          </p>
        </div>

        {/* ── CRITICAL SEASON ALERT BANNER ── */}
        <div className="mb-6 px-4 py-3 rounded-2xl flex flex-wrap items-center gap-3
          bg-rose-950/40 border border-rose-500/40 shadow-lg shadow-rose-500/10">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <span className="text-xs font-bold text-rose-300">⚠ AI Seasonal Alert 2026</span>
          </div>
          <p className="text-xs text-rose-200/80 flex-1 min-w-0">
            Critical outbreak risk projected for <strong className="text-rose-300">{CRITICAL_MONTHS.join(', ')}</strong>.
            Monsoon peak at <strong className="text-rose-300">{peakMonth.month} 2026</strong> — pre-emptive intervention required.
          </p>
          <span className="shrink-0 px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-[10px] font-bold text-rose-400">
            {totalCritical} Critical Months
          </span>
        </div>

        {/* ── SUMMARY STAT CARDS ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { icon: Thermometer, label: 'Dengue Peak',   value: `${peakMonth.dengue} cases`, color: 'cyan',   month: peakMonth.month },
            { icon: Droplets,    label: 'Malaria Peak',  value: `${peakMonth.malaria} cases`,color: 'emerald', month: peakMonth.month },
            { icon: Wind,        label: 'Viral Peak',    value: `${peakMonth.viral} cases`,  color: 'purple',  month: peakMonth.month },
            { icon: AlertOctagon,label: 'Cholera Peak',  value: `${peakMonth.cholera} cases`,color: 'rose',    month: peakMonth.month },
          ].map(({ icon: Icon, label, value, color, month }) => (
            <div key={label} className={`p-3.5 rounded-2xl border bg-${color}-950/20 border-${color}-500/25 flex items-start gap-3`}>
              <div className={`w-8 h-8 rounded-xl bg-${color}-500/15 flex items-center justify-center text-${color}-400 shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className={`text-[10px] font-semibold text-${color}-400 uppercase tracking-wider`}>{label}</p>
                <p className="text-xs font-bold text-white">{value}</p>
                <p className="text-[10px] text-slate-500">{month} 2026</p>
              </div>
            </div>
          ))}
        </div>

        {/* Dashboard Shell */}
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800 shadow-2xl">

          {/* Controls Bar */}
          <div className="flex flex-wrap items-start justify-between gap-4 pb-6 mb-6 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Seasonal Outbreak Risk Projection (2026)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Aggregated real-time data from 2,450 rural PHCs · Jan – Dec 2026
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('forecast')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'forecast' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  2026 Forecast
                </button>
                <button
                  onClick={() => setViewMode('compare')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'compare' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  vs 2025 Actual
                </button>
              </div>

              {/* Chart Format Switch */}
              <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
                {['area', 'bar', 'line'].map(type => (
                  <button
                    key={type}
                    onClick={() => setChartType(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                      chartType === type ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {type === 'area' ? 'Area' : type === 'bar' ? 'Bar' : 'Line'}
                  </button>
                ))}
              </div>

              {/* Cholera toggle (only on forecast mode) */}
              {viewMode === 'forecast' && (
                <button
                  onClick={() => setShowCholera(v => !v)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    showCholera
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                      : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Cholera {showCholera ? '✓' : '+'}
                </button>
              )}
            </div>
          </div>

          {/* Chart */}
          <div className="h-80 w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              {viewMode === 'compare' ? (
                /* ── Year-over-Year comparison ── */
                <LineChart data={mockData.forecastComparison}>
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip content={<CompareTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="actual2025"   name="2025 Actual"      stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 4" dot={{ r: 3, fill: '#94a3b8' }} />
                  <Line type="monotone" dataKey="forecast2026" name="2026 AI Forecast"  stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, fill: '#0ea5e9' }} />
                </LineChart>
              ) : chartType === 'area' ? (
                <AreaChart data={mockData.diseaseForecast}>
                  <defs>
                    <linearGradient id="gDengue"  x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.7}/><stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/></linearGradient>
                    <linearGradient id="gMalaria" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.7}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                    <linearGradient id="gViral"   x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.7}/><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/></linearGradient>
                    <linearGradient id="gCholera" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f43f5e" stopOpacity={0.7}/><stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/></linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  {/* Monsoon reference band */}
                  <ReferenceLine x="Jun" stroke="rgba(251,191,36,0.4)" strokeDasharray="4 3" label={{ value: '▶ Monsoon', fill: '#fbbf24', fontSize: 10, position: 'insideTopLeft' }} />
                  <ReferenceLine x="Sep" stroke="rgba(251,191,36,0.4)" strokeDasharray="4 3" label={{ value: 'End ◀',    fill: '#fbbf24', fontSize: 10, position: 'insideTopRight' }} />
                  <Area type="monotone" dataKey="dengue"  name="Dengue"  stroke="#0ea5e9" fill="url(#gDengue)"  strokeWidth={2} />
                  <Area type="monotone" dataKey="malaria" name="Malaria" stroke="#10b981" fill="url(#gMalaria)" strokeWidth={2} />
                  <Area type="monotone" dataKey="viral"   name="Viral Fever" stroke="#8b5cf6" fill="url(#gViral)"   strokeWidth={2} />
                  {showCholera && <Area type="monotone" dataKey="cholera" name="Cholera" stroke="#f43f5e" fill="url(#gCholera)" strokeWidth={2} />}
                </AreaChart>
              ) : chartType === 'bar' ? (
                <BarChart data={mockData.diseaseForecast}>
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <ReferenceLine x="Jun" stroke="rgba(251,191,36,0.4)" strokeDasharray="4 3" />
                  <ReferenceLine x="Sep" stroke="rgba(251,191,36,0.4)" strokeDasharray="4 3" />
                  <Bar dataKey="dengue"  name="Dengue"     fill="#0ea5e9" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="malaria" name="Malaria"    fill="#10b981" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="viral"   name="Viral Fever" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
                  {showCholera && <Bar dataKey="cholera" name="Cholera" fill="#f43f5e" radius={[3, 3, 0, 0]} />}
                </BarChart>
              ) : (
                <LineChart data={mockData.diseaseForecast}>
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <ReferenceLine x="Jun" stroke="rgba(251,191,36,0.4)" strokeDasharray="4 3" label={{ value: '▶ Monsoon', fill: '#fbbf24', fontSize: 10 }} />
                  <ReferenceLine x="Sep" stroke="rgba(251,191,36,0.4)" strokeDasharray="4 3" />
                  <Line type="monotone" dataKey="dengue"  name="Dengue"     stroke="#0ea5e9" strokeWidth={3} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="malaria" name="Malaria"    stroke="#10b981" strokeWidth={3} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="viral"   name="Viral Fever" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 3 }} />
                  {showCholera && <Line type="monotone" dataKey="cholera" name="Cholera" stroke="#f43f5e" strokeWidth={3} dot={{ r: 3 }} />}
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Monthly risk level strip */}
          {viewMode === 'forecast' && (
            <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
              {mockData.diseaseForecast.map(d => {
                const rc = RISK_COLORS[d.riskLevel] || RISK_COLORS['Low'];
                return (
                  <div key={d.month} className={`flex-1 min-w-[44px] flex flex-col items-center gap-1 px-1 py-2 rounded-xl border ${rc.bg} ${rc.border}`}>
                    <span className="text-[9px] font-bold text-slate-400">{d.month}</span>
                    <span className={`w-2 h-2 rounded-full`} style={{ background: rc.dot }} />
                    {d.alert && <AlertTriangle className={`w-2.5 h-2.5 ${rc.text}`} />}
                  </div>
                );
              })}
            </div>
          )}

          {/* Regional Outbreak Alert Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-800">
            <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-cyan-300 font-bold block">District 1 (Sonbhadra)</span>
                <span className="text-xs text-slate-300">Dengue Vector Index: <strong className="text-rose-400">High Alert</strong></span>
                <span className="block text-[10px] text-slate-500 mt-0.5">Pre-emptive camp scheduled Jul 2026</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-emerald-300 font-bold block">District 2 (Chhatarpur)</span>
                <span className="text-xs text-slate-300">Malaria Index: <strong className="text-emerald-400">Controlled</strong></span>
                <span className="block text-[10px] text-slate-500 mt-0.5">Bed-net distribution complete</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-purple-300 font-bold block">Preventive Action</span>
                <span className="text-xs text-slate-300">Larvicidal Spraying Dispatched</span>
                <span className="block text-[10px] text-slate-500 mt-0.5">Targeting 380 water bodies</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
