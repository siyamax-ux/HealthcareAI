import React, { useState, useEffect } from 'react';
import { MapPin, Globe, Mic, CheckCircle2, X, RefreshCw, ChevronDown, Languages, Bell } from 'lucide-react';
import { useGeoLang, STATE_LANG_MAP } from '../context/GeoLangContext';

/* ─── All unique languages for the manual picker ─── */
const ALL_LANGUAGES = [
  { code: 'hi', native: 'हिंदी',    name: 'Hindi' },
  { code: 'pa', native: 'ਪੰਜਾਬੀ',  name: 'Punjabi' },
  { code: 'gu', native: 'ગુજરાતી', name: 'Gujarati' },
  { code: 'mr', native: 'मराठी',    name: 'Marathi' },
  { code: 'bn', native: 'বাংলা',    name: 'Bengali' },
  { code: 'ta', native: 'தமிழ்',   name: 'Tamil' },
  { code: 'te', native: 'తెలుగు',  name: 'Telugu' },
  { code: 'kn', native: 'ಕನ್ನಡ',   name: 'Kannada' },
  { code: 'ml', native: 'മലയാളം',  name: 'Malayalam' },
  { code: 'as', native: 'অসমীয়া', name: 'Assamese' },
  { code: 'or', native: 'ଓଡ଼ିଆ',  name: 'Odia' },
  { code: 'en', native: 'English',  name: 'English' },
  { code: 'fr', native: 'Français', name: 'French' },
  { code: 'de', native: 'Deutsch',  name: 'German' },
  { code: 'es', native: 'Español',  name: 'Spanish' },
  { code: 'ja', native: '日本語',    name: 'Japanese' },
  { code: 'zh', native: '中文',      name: 'Chinese' },
  { code: 'ru', native: 'Русский',  name: 'Russian' },
  { code: 'ar', native: 'العربية',  name: 'Arabic' },
];

/* ─── Small animated India SVG map (schematic) ─── */
function IndiaSVG({ pulse }) {
  return (
    <svg
      viewBox="0 0 220 260"
      className="w-full h-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M80 10 L130 8 L155 30 L175 55 L180 80 L175 110
           L195 130 L200 155 L185 175 L170 200 L155 230
           L145 255 L130 250 L120 235 L110 215
           L95 235 L80 220 L70 195 L55 175
           L40 155 L35 130 L45 105 L35 80
           L45 55 L60 35 Z"
        fill={pulse ? 'rgba(6,182,212,0.15)' : 'rgba(30,41,59,0.6)'}
        stroke={pulse ? 'rgba(6,182,212,0.7)' : 'rgba(100,116,139,0.5)'}
        strokeWidth="2"
        style={{ transition: 'all 0.8s ease' }}
      />
      {[
        { label: 'UP',  x: 115, y: 90,  active: true  },
        { label: 'MH',  x: 90,  y: 145, active: false },
        { label: 'TN',  x: 120, y: 210, active: false },
        { label: 'GJ',  x: 60,  y: 115, active: false },
        { label: 'PB',  x: 88,  y: 55,  active: false },
        { label: 'WB',  x: 155, y: 115, active: false },
        { label: 'KA',  x: 105, y: 175, active: false },
        { label: 'KL',  x: 100, y: 200, active: false },
      ].map(({ label, x, y, active }) => (
        <g key={label}>
          <circle
            cx={x} cy={y} r={active && pulse ? 7 : 4}
            fill={active && pulse ? 'rgba(6,182,212,0.9)' : 'rgba(100,116,139,0.5)'}
            style={{ transition: 'all 0.5s ease' }}
          />
          {active && pulse && (
            <circle cx={x} cy={y} r="10"
              fill="none"
              stroke="rgba(6,182,212,0.4)"
              strokeWidth="2"
              style={{ animation: 'pingSlow 1.5s ease-in-out infinite' }}
            />
          )}
          <text x={x + 10} y={y + 4} fontSize="8" fill="rgba(148,163,184,0.8)" fontFamily="monospace">{label}</text>
        </g>
      ))}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   LANGUAGE CHANGED TOAST
═══════════════════════════════════════════════════════════ */
function LangChangedToast() {
  const { langToast, setLangToast } = useGeoLang();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (langToast) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [langToast]);

  if (!langToast) return null;

  return (
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-[9998] flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-2xl shadow-emerald-500/20 transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
      style={{
        background: 'linear-gradient(135deg, rgba(6,78,59,0.97) 0%, rgba(7,15,30,0.97) 100%)',
        border: '1px solid rgba(52,211,153,0.4)',
        backdropFilter: 'blur(16px)',
        minWidth: '280px',
        maxWidth: '90vw',
      }}
    >
      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
        <Bell className="w-4 h-4 text-emerald-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-emerald-300 leading-tight">{langToast.message}</p>
        {langToast.lang && (
          <p className="text-[10px] text-emerald-500 mt-0.5">
            {langToast.lang.flag} {langToast.lang.native} · {langToast.lang.name}
          </p>
        )}
      </div>
      <button
        onClick={() => setLangToast(null)}
        className="p-1 rounded-lg text-emerald-600 hover:text-emerald-300 transition-colors shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DETECTION POPUP (shows on page load)
═══════════════════════════════════════════════════════════ */
function DetectionPopup() {
  const {
    activeLang, detectedState, detectedCity, detectedDistrict,
    detectionStatus, showPopup, setShowPopup,
    setLanguageManually, detectLocation, greeting,
  } = useGeoLang();

  const [showLangPicker, setShowLangPicker] = useState(false);

  if (!showPopup) return null;

  const stateName = detectedState
    ? detectedState.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
    : 'India';
  const locationStr = [detectedCity, stateName].filter(Boolean).join(', ');

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center sm:justify-end sm:p-6 pointer-events-none">
      <div className="absolute inset-0 sm:hidden bg-slate-950/40 backdrop-blur-sm pointer-events-auto" onClick={() => setShowPopup(false)} />

      <div className="relative pointer-events-auto w-full sm:w-[380px] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-cyan-500/20 border border-cyan-500/30"
        style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(7,15,30,0.99) 100%)' }}>

        {/* Animated gradient header */}
        <div className="relative px-5 pt-5 pb-4 overflow-hidden" style={{
          background: 'linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(139,92,246,0.1) 100%)',
          borderBottom: '1px solid rgba(6,182,212,0.2)'
        }}>
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-24 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                <Globe className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">GramSwasthya · Smart Localization</h3>
                <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse inline-block" />
                  {detectionStatus === 'detecting' ? 'Detecting location…' : 'Location detected'}
                </p>
              </div>
            </div>
            <button onClick={() => setShowPopup(false)} className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Detecting spinner */}
          {detectionStatus === 'detecting' && (
            <div className="flex items-center justify-center gap-3 py-4">
              <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin" />
              <p className="text-sm text-slate-300">Detecting your location…</p>
            </div>
          )}

          {/* Success: two-column — India map + info */}
          {(detectionStatus === 'done' || detectionStatus === 'manual') && (
            <div className="flex gap-4 items-start">
              <div className="w-28 h-32 shrink-0 opacity-90">
                <IndiaSVG pulse={true} />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Detected Location</p>
                    <p className="text-xs font-bold text-white">{locationStr || 'India'}</p>
                    {detectedDistrict && <p className="text-[10px] text-slate-400">{detectedDistrict}</p>}
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30">
                  <Languages className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Language Switched To</p>
                    <p className="text-xs font-bold text-emerald-300">{activeLang.flag} {activeLang.native} · {activeLang.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/30">
                  <Mic className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">AI Assistant Ready In</p>
                    <p className="text-xs font-bold text-purple-300">{activeLang.native}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Greeting message */}
          {(detectionStatus === 'done' || detectionStatus === 'manual') && (
            <div className="p-3 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-purple-950/40 border border-cyan-500/20">
              <p className="text-sm font-bold text-white mb-0.5">{greeting.greeting}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{greeting.welcome}</p>
            </div>
          )}

          {/* Failed state */}
          {detectionStatus === 'failed' && (
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-center">
              <p className="text-xs text-amber-300 mb-2">Could not detect location automatically.</p>
              <button onClick={detectLocation} className="text-xs text-cyan-400 underline">Try again</button>
            </div>
          )}

          {/* Manual override */}
          <div>
            <button
              onClick={() => setShowLangPicker(p => !p)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Languages className="w-3.5 h-3.5 text-slate-400" />
                Change Language Manually
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${showLangPicker ? 'rotate-180' : ''}`} />
            </button>

            {showLangPicker && (
              <div className="mt-2 grid grid-cols-3 gap-1.5 max-h-44 overflow-y-auto pr-1">
                {ALL_LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => { setLanguageManually(lang.code); setShowLangPicker(false); }}
                    className={`px-2 py-2 rounded-lg text-[10px] font-semibold border transition-all
                      ${activeLang.code === lang.code
                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                      }`}
                  >
                    <span className="block text-center">{lang.native}</span>
                    <span className="block text-center text-slate-600 text-[9px]">{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dismiss */}
          <button
            onClick={() => setShowPopup(false)}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-xs font-bold text-cyan-300 hover:from-cyan-500/30 hover:to-purple-500/30 transition-all"
          >
            <CheckCircle2 className="w-3.5 h-3.5 inline mr-1.5" />
            Continue in {activeLang.native}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PERSISTENT LANGUAGE INDICATOR BAR (top of page, under navbar)
═══════════════════════════════════════════════════════════ */
function LangIndicatorBar() {
  const { activeLang, detectedState, detectedCity, detectionStatus, setShowPopup, setLanguageManually } = useGeoLang();
  const [showMini, setShowMini] = useState(false);
  const [showBar,  setShowBar]  = useState(true);

  if (!showBar || detectionStatus === 'idle' || detectionStatus === 'detecting') return null;

  const stateName = detectedState
    ? detectedState.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
    : null;

  return (
    <div className="fixed top-[57px] left-0 right-0 z-40 flex justify-center pointer-events-none animate-slide-up">
      <div className="pointer-events-auto mx-4 mt-1 flex items-center gap-3 px-4 py-2 rounded-full shadow-xl border border-cyan-500/25"
        style={{ background: 'rgba(7,15,30,0.92)', backdropFilter: 'blur(12px)', maxWidth: '520px', width: '100%' }}>

        {/* Pulse dot */}
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>

        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          {detectedCity || stateName
            ? <>
                <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                <span className="text-[10px] text-slate-400 font-mono truncate">
                  {[detectedCity, stateName].filter(Boolean).join(', ')}
                </span>
                <span className="text-slate-700 mx-1">·</span>
              </>
            : null
          }
          <span className="text-sm leading-none">{activeLang.flag}</span>
          <span className="text-[10px] text-purple-300 font-semibold">{activeLang.native}</span>
          <span className="text-[10px] text-slate-500">({activeLang.name})</span>
        </div>

        {/* Quick lang switcher pill */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowMini(m => !m)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 hover:border-purple-500/50 text-[10px] text-slate-300 transition-colors"
          >
            <Languages className="w-3 h-3" />
            Change
          </button>
          {showMini && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="max-h-52 overflow-y-auto py-1">
                {ALL_LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => { setLanguageManually(lang.code); setShowMini(false); }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 text-xs hover:bg-slate-800 transition-colors
                      ${activeLang.code === lang.code ? 'text-cyan-400 bg-slate-800/50' : 'text-slate-300'}`}
                  >
                    <span>{lang.name}</span>
                    <span className="text-slate-500 text-[10px]">{lang.native}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowBar(false)}
          className="text-slate-600 hover:text-slate-400 transition-colors shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   STATE HEALTH SCHEMES PANEL (compact banner)
═══════════════════════════════════════════════════════════ */
export function StateSchemesBanner() {
  const { schemes, detectedState, activeLang, detectionStatus } = useGeoLang();
  const [open, setOpen] = useState(false);

  if (detectionStatus !== 'done' && detectionStatus !== 'manual') return null;
  if (!detectedState) return null;

  const stateName = detectedState.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');

  return (
    <div className="fixed bottom-[4.5rem] left-6 z-40 w-64">
      {open ? (
        <div className="rounded-2xl bg-slate-900/98 border border-emerald-500/30 shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2.5 bg-emerald-950/60 border-b border-emerald-500/20">
            <div>
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Health Schemes</p>
              <p className="text-[10px] text-slate-400">{stateName}</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-white"><X className="w-3.5 h-3.5" /></button>
          </div>
          <ul className="p-3 space-y-2">
            {schemes.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-[10px] text-slate-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/90 border border-emerald-500/30 shadow-xl hover:border-emerald-400/50 transition-all text-[10px] text-emerald-400 font-semibold"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          {stateName} Health Schemes
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN EXPORT — renders all geo-UI layers
═══════════════════════════════════════════════════════════ */
export const GeoLangDetector = () => (
  <>
    <LangChangedToast />
    <DetectionPopup />
    <LangIndicatorBar />
    <StateSchemesBanner />
  </>
);
