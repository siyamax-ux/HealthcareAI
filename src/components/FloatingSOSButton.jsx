import React, { useState } from 'react';
import { ShieldAlert, X, PhoneCall, Heart, AlertTriangle } from 'lucide-react';
import { useGeoLang } from '../context/GeoLangContext';

export const FloatingSOSButton = () => {
  const [isOpen, setIsOpen]         = useState(false);
  const [selected, setSelected]     = useState(null);
  const { emergency, activeLang }   = useGeoLang();

  const emergencyOptions = [
    { id: 'heart-attack', label: 'Heart Attack',       icon: '❤️', steps: emergency.heartAttack },
    { id: 'cpr',          label: 'Cardiac Arrest/CPR', icon: '⚡', steps: emergency.heartAttack },
    { id: 'snake-bite',   label: 'Snake Bite',         icon: '🐍', steps: emergency.snakeBite  },
    { id: 'burns',        label: 'Severe Burns',       icon: '🔥', steps: emergency.burns      },
    { id: 'bleeding',     label: 'Severe Bleeding',    icon: '🩹', steps: emergency.heartAttack },
    { id: 'choking',      label: 'Choking',            icon: '💨', steps: emergency.heartAttack },
  ];

  const handleSelect = (opt) => {
    setSelected(opt);
    const event = new CustomEvent('trigger-emergency', { detail: { id: opt.id } });
    window.dispatchEvent(event);
  };

  const handleScrollToEmergency = () => {
    const el = document.querySelector('#emergency');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
    setSelected(null);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">

      {/* SOS Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group px-5 py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white shadow-2xl shadow-red-600/40 hover:scale-105 transition-all flex items-center gap-2 border border-red-500/50"
        >
          <div className="absolute inset-0 rounded-2xl bg-red-600 animate-ping opacity-20" />
          <ShieldAlert className="w-6 h-6 animate-pulse" />
          <span className="font-black text-xs tracking-widest">SOS EMERGENCY</span>
        </button>
      )}

      {/* SOS Panel */}
      {isOpen && (
        <div className="w-80 rounded-3xl bg-slate-900 border border-red-500/30 shadow-2xl overflow-hidden flex flex-col"
          style={{ maxHeight: '520px' }}>

          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-red-950 to-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4 text-red-500 animate-bounce" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-xs tracking-wider">AI EMERGENCY SOS</h4>
                <p className="text-[9px] text-red-400 font-bold uppercase font-mono tracking-widest">
                  {activeLang.native} · {activeLang.name}
                </p>
              </div>
            </div>
            <button onClick={() => { setIsOpen(false); setSelected(null); }} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto bg-slate-950/80">
            {/* Call 108 */}
            <div className="p-4 space-y-2">
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
                <span className="text-[10px] text-red-300 font-extrabold uppercase tracking-wide block mb-1">
                  {emergency.cta}
                </span>
                <a href="tel:108"
                  className="inline-flex items-center gap-1.5 text-sm font-black text-white hover:underline">
                  <PhoneCall className="w-4 h-4 text-red-400 animate-bounce" />
                  108 — Ambulance
                </a>
              </div>

              {/* First aid steps for selected scenario */}
              {selected && (
                <div className="p-3 bg-slate-900 border border-red-500/30 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">{selected.icon}</span>
                    <h5 className="text-xs font-bold text-red-300">{selected.label} — First Aid</h5>
                  </div>
                  <ol className="space-y-1.5">
                    {selected.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-2 text-[11px] text-slate-300">
                        <span className="w-4 h-4 rounded-full bg-red-500/25 text-red-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                  <button
                    onClick={handleScrollToEmergency}
                    className="mt-3 w-full py-2 rounded-xl bg-red-600/20 border border-red-500/30 text-[10px] text-red-300 font-bold hover:bg-red-600/30 transition-colors"
                  >
                    Full Emergency Guide →
                  </button>
                </div>
              )}

              {/* Emergency option list */}
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">
                First-Aid Guide ({activeLang.native}):
              </span>
              {emergencyOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt)}
                  className={`w-full p-3 rounded-xl border text-left text-xs font-bold text-slate-200 transition-all flex items-center justify-between group
                    ${selected?.id === opt.id
                      ? 'bg-red-950/40 border-red-500/50'
                      : 'bg-slate-900 hover:bg-red-950/30 border-slate-800 hover:border-red-500/40'
                    }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </span>
                  <span className="text-[9px] text-red-500 group-hover:text-red-400 font-mono font-bold tracking-wider">
                    Guide &gt;
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 text-[9px] text-slate-500 text-center flex items-center justify-center gap-1 shrink-0">
            <AlertTriangle className="w-3 h-3 text-amber-500/70" />
            AI support only. Always contact certified medical professionals.
          </div>
        </div>
      )}
    </div>
  );
};
