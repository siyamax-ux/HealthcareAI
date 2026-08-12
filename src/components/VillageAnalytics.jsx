import React from 'react';
import { 
  BarChart3, Activity, Heart, ShieldAlert, Users, TrendingUp, CheckCircle2 
} from 'lucide-react';

export const VillageAnalytics = () => {
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
            <span className="text-3xl font-extrabold text-white">48,250</span>
            <span className="text-[10px] text-emerald-400 font-mono block mt-1">+12% this month</span>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-slate-800 text-center">
            <span className="text-xs text-slate-400 font-semibold block mb-1">Active Cases</span>
            <span className="text-3xl font-extrabold text-amber-300">1,140</span>
            <span className="text-[10px] text-amber-400 font-mono block mt-1">Under AI Monitoring</span>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-slate-800 text-center">
            <span className="text-xs text-slate-400 font-semibold block mb-1">Critical Cases</span>
            <span className="text-3xl font-extrabold text-rose-400">42</span>
            <span className="text-[10px] text-rose-400 font-mono block mt-1">Referrals Dispatched</span>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-slate-800 text-center">
            <span className="text-xs text-slate-400 font-semibold block mb-1">Recovery Rate</span>
            <span className="text-3xl font-extrabold text-emerald-400">96.8%</span>
            <span className="text-[10px] text-emerald-400 font-mono block mt-1">High Outbreak Prevention</span>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-slate-800 text-center col-span-2 md:col-span-1">
            <span className="text-xs text-slate-400 font-semibold block mb-1">Healthcare Coverage</span>
            <span className="text-3xl font-extrabold text-cyan-400">99.1%</span>
            <span className="text-[10px] text-cyan-400 font-mono block mt-1">2,450 Gram Panchayats</span>
          </div>

        </div>

      </div>
    </section>
  );
};
