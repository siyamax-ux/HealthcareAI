import React, { useState } from 'react';
import { 
  Sparkles, Bot, Mic, ShieldAlert, ArrowRight, Play, CheckCircle2, 
  Activity, Users, MapPin, Stethoscope, Heart, Zap, Globe, FileText 
} from 'lucide-react';
import { mockData } from '../data/mockData';

export const Hero = () => {
  const [activeTab, setActiveTab] = useState('symptom');

  return (
    <section id="hero" className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      
      {/* Dynamic Animated Blobs Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/20 via-blue-600/15 to-purple-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-[90px] pointer-events-none animate-float" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-purple-500/15 rounded-full blur-[100px] pointer-events-none animate-float-delayed" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Trusted Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-cyan-500/30 text-xs font-semibold text-cyan-300 shadow-xl shadow-cyan-500/10 hover:border-cyan-400 transition-all cursor-pointer group">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <Sparkles className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
            <span>Trusted by 2,450+ Rural Indian Villages & Health ASHA Workers</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Main Hero Header */}
        <div className="text-center max-w-4xl mx-auto mb-14">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.15] mb-6">
            AI-Powered Healthcare <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400">
              For Every Village
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-3xl mx-auto mb-10">
            Connecting rural communities with intelligent multilingual healthcare assistance, remote specialist doctors, offline data sync, and instant life-saving emergency support.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#ai-clinic"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold text-base shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#voice-doctor"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-200 font-semibold text-base hover:bg-slate-800 hover:text-white hover:border-slate-700 transition-all flex items-center justify-center gap-3 glass-card"
            >
              <Mic className="w-5 h-5 text-cyan-400" />
              <span>Try AI Voice Doctor (Hindi/Bhojpuri)</span>
            </a>
          </div>
        </div>

        {/* Interactive AI Assistant Preview Card */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="relative rounded-3xl p-1 bg-gradient-to-r from-cyan-500/30 via-blue-500/20 to-purple-500/30 shadow-2xl backdrop-blur-2xl">
            <div className="bg-slate-950/90 rounded-[22px] p-6 sm:p-8 border border-slate-800/80">
              
              {/* Card Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Bot className="w-6 h-6 animate-bounce" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      GramSwasthya AI Tele-Triage
                      <span className="px-2 py-0.5 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">Active Sync</span>
                    </h3>
                    <p className="text-xs text-slate-400">Real-time Multilingual Clinical Engine</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300">
                  <Globe className="w-4 h-4 text-purple-400" />
                  <span>Language: <strong className="text-cyan-400">Hindi (हिंदी)</strong></span>
                </div>
              </div>

              {/* Chat Simulation Preview */}
              <div className="space-y-4">
                {/* AI Question */}
                <div className="flex gap-3 max-w-2xl">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl rounded-tl-none text-sm text-slate-200 shadow-md">
                    <p className="font-medium text-cyan-300 mb-1">GramSwasthya AI Assistant</p>
                    <p className="leading-relaxed">
                      "नमस्ते! मुझे बताइए आपको या आपके परिवार के सदस्य को क्या तकलीफ है? आप अपनी भाषा में बोल भी सकते हैं।"
                    </p>
                    <p className="text-xs text-slate-400 mt-2 font-mono">
                      (Hello! Please tell me what symptoms you or your family member have. You can speak in your regional language.)
                    </p>
                  </div>
                </div>

                {/* Patient Answer */}
                <div className="flex gap-3 max-w-2xl ml-auto justify-end">
                  <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-4 rounded-2xl rounded-tr-none text-sm text-white shadow-lg">
                    <p className="font-medium text-cyan-100 mb-1">Village Patient (Voice Input)</p>
                    <p className="leading-relaxed">
                      "पिछले 3 दिनों से तेज़ बुखार है, सिर दर्द और जोड़ों में काफी दर्द हो रहा है।"
                    </p>
                    <p className="text-xs text-cyan-200/80 mt-1 font-mono">
                      [High fever, severe headache, and joint pain for last 3 days.]
                    </p>
                  </div>
                </div>

                {/* AI Instant Diagnosis Output */}
                <div className="flex gap-3 max-w-3xl">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="bg-slate-900/90 border border-purple-500/30 p-5 rounded-2xl rounded-tl-none text-sm text-slate-200 shadow-xl w-full">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-amber-400" />
                        AI Risk Assessment: Yellow (Moderate Dengue Risk)
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Confidence: 94.2%</span>
                    </div>
                    <ul className="text-xs space-y-2 text-slate-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span><strong>Recommended Step:</strong> Hydration + Complete Blood Count (CBC) test for Platelets.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span><strong>Tele-Doctor Referral:</strong> Dr. Rajesh Sharma notified (ETA: 4 mins).</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Dynamic Animated Statistics Counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {mockData.stats.map((stat, idx) => {
            const IconComp = stat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl glass-card border border-slate-800 hover:border-slate-700 relative overflow-hidden group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${stat.color} p-0.5 mb-4 shadow-lg`}>
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <IconComp className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1 group-hover:text-cyan-400 transition-colors">
                  {stat.value}
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">{stat.label}</p>
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/15 transition-all" />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
