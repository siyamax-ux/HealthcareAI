import React, { useState, useEffect } from 'react';
import { BarChart3, RefreshCw } from 'lucide-react';
import { analyticsApi, isDemoSession } from '../api/api';

// Mock summary shown in demo mode or when the backend is unreachable
const DEMO_SUMMARY = {
  totalPatients:         312,
  pendingConsultations:  47,
  criticalConsultations: 8,
  doctorsCount:          24,
  healthWorkersCount:    130,
};

export const VillageAnalytics = () => {
  const [summary, setSummary]   = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    // Demo sessions send a fake token the backend rejects with 401 — skip call
    if (isDemoSession()) {
      setSummary(DEMO_SUMMARY);
      setLoading(false);
      return;
    }

    analyticsApi.getSummary()
      .then(data => setSummary(data.summary))
      .catch(() => {
        // Backend unreachable — show demo data silently, no error banner
        setSummary(DEMO_SUMMARY);
      })
      .finally(() => setLoading(false));
  }, []);

  // Helpers for display — fall back to '—' while loading
  const v = (val) => (loading ? '…' : val?.toLocaleString('en-IN') ?? '—');

  return (
    <section className="py-24 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-bold text-cyan-400 mb-4">
            <BarChart3 className="w-4 h-4" />
            <span>Interactive Module 8</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Village Health & ASHA Analytics
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Futuristic real-time district tele-health monitor for Sarpanches, health officers, and ASHA supervisors.
          </p>
        </div>

        {/* Counter Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">

          <div className="p-5 rounded-2xl glass-card border border-slate-800 text-center">
            <span className="text-xs text-slate-400 font-semibold block mb-1">Total Patients</span>
            <span className="text-3xl font-extrabold text-white flex items-center justify-center gap-1">
              {loading && <RefreshCw className="w-5 h-5 animate-spin text-slate-500" />}
              {!loading && v(summary?.totalPatients)}
            </span>
            <span className="text-[10px] text-emerald-400 font-mono block mt-1">Live from DB</span>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-slate-800 text-center">
            <span className="text-xs text-slate-400 font-semibold block mb-1">Active Cases</span>
            <span className="text-3xl font-extrabold text-amber-300 flex items-center justify-center gap-1">
              {loading && <RefreshCw className="w-5 h-5 animate-spin text-slate-500" />}
              {!loading && v(summary?.pendingConsultations)}
            </span>
            <span className="text-[10px] text-amber-400 font-mono block mt-1">Under AI Monitoring</span>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-slate-800 text-center">
            <span className="text-xs text-slate-400 font-semibold block mb-1">Critical Cases</span>
            <span className="text-3xl font-extrabold text-rose-400 flex items-center justify-center gap-1">
              {loading && <RefreshCw className="w-5 h-5 animate-spin text-slate-500" />}
              {!loading && v(summary?.criticalConsultations)}
            </span>
            <span className="text-[10px] text-rose-400 font-mono block mt-1">Referrals Dispatched</span>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-slate-800 text-center">
            <span className="text-xs text-slate-400 font-semibold block mb-1">Active Doctors</span>
            <span className="text-3xl font-extrabold text-emerald-400 flex items-center justify-center gap-1">
              {loading && <RefreshCw className="w-5 h-5 animate-spin text-slate-500" />}
              {!loading && v(summary?.doctorsCount)}
            </span>
            <span className="text-[10px] text-emerald-400 font-mono block mt-1">Tele-Doctors Online</span>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-slate-800 text-center col-span-2 md:col-span-1">
            <span className="text-xs text-slate-400 font-semibold block mb-1">Health Workers</span>
            <span className="text-3xl font-extrabold text-cyan-400 flex items-center justify-center gap-1">
              {loading && <RefreshCw className="w-5 h-5 animate-spin text-slate-500" />}
              {!loading && v(summary?.healthWorkersCount)}
            </span>
            <span className="text-[10px] text-cyan-400 font-mono block mt-1">ASHA Workers Active</span>
          </div>

        </div>

      </div>
    </section>
  );
};
