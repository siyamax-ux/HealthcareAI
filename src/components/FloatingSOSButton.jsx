import React, { useState } from 'react';
import { ShieldAlert, X, PhoneCall, Heart, AlertTriangle } from 'lucide-react';

export const FloatingSOSButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const emergencyOptions = [
    { id: 'heart-attack', label: 'Heart Attack', icon: '❤️' },
    { id: 'cpr', label: 'Cardiac Arrest / CPR', icon: '⚡' },
    { id: 'choking', label: 'Choking', icon: '💨' },
    { id: 'snake-bite', label: 'Snake Bite', icon: '🐍' },
    { id: 'bleeding', label: 'Severe Bleeding', icon: '🩹' },
    { id: 'burns', label: 'Severe Burns', icon: '🔥' },
  ];

  const handleSelect = (id) => {
    // 1. Dispatch custom event to trigger the active emergency in the main assistant
    const event = new CustomEvent('trigger-emergency', { detail: { id } });
    window.dispatchEvent(event);

    // 2. Smooth scroll to the emergency section
    const element = document.querySelector('#emergency');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }

    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      
      {/* SOS Button (Pulsing Red) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group px-5 py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white shadow-2xl shadow-red-600/40 hover:scale-105 transition-all flex items-center gap-2 border border-red-500/50"
        >
          <div className="absolute inset-0 rounded-2xl bg-red-600 animate-ping opacity-25" />
          <ShieldAlert className="w-6 h-6 animate-pulse" />
          <span className="font-black text-xs tracking-widest">SOS EMERGENCY</span>
        </button>
      )}

      {/* SOS Menu Panel */}
      {isOpen && (
        <div className="w-80 rounded-3xl bg-slate-900 border border-red-500/30 shadow-2xl overflow-hidden flex flex-col h-[400px] animate-in slide-in-from-bottom duration-300">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-red-950 to-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500">
                <ShieldAlert className="w-4 h-4 animate-bounce" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-xs tracking-wider">AI EMERGENCY SOS</h4>
                <p className="text-[9px] text-red-400 font-bold uppercase tracking-widest font-mono">Instant First Aid</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Select Options */}
          <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-slate-950/80">
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-center mb-2">
              <span className="text-[10px] text-red-300 font-extrabold uppercase tracking-wide block">Call Govt Services first</span>
              <a 
                href="tel:108"
                className="inline-flex items-center gap-1.5 text-xs font-black text-white hover:underline mt-1"
              >
                <PhoneCall className="w-3.5 h-3.5 text-red-400 animate-bounce" />
                <span>Call Ambulance (108)</span>
              </a>
            </div>

            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-2">Launch First-Aid Guide:</span>
            
            {emergencyOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                className="w-full p-3 rounded-xl bg-slate-900 hover:bg-red-950/30 border border-slate-800 hover:border-red-500/40 text-left text-xs font-bold text-slate-200 transition-all flex items-center justify-between group"
              >
                <span className="flex items-center gap-2">
                  <span>{opt.icon}</span>
                  <span>{opt.label}</span>
                </span>
                <span className="text-[9px] text-red-500 group-hover:text-red-400 font-mono font-bold tracking-wider">Trigger &gt;</span>
              </button>
            ))}
          </div>

          {/* Warning disclaimer footer in panel */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 text-[9px] text-slate-500 text-center flex items-center justify-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-500/70" />
            <span>AI support only. Dispatches standard services.</span>
          </div>

        </div>
      )}
    </div>
  );
};
