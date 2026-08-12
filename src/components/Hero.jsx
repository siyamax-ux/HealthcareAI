import React, { useState, useEffect, useRef } from 'react';
import {
  Mic, MicOff, Bot, Sparkles, ArrowRight, CheckCircle2,
  ShieldAlert, Globe, Activity, Heart, Zap, Clock,
  Volume2, Phone, X, ChevronDown, Stethoscope, AlertTriangle
} from 'lucide-react';
import { mockData } from '../data/mockData';

/* ─── Static demo conversations ─────────────────────────── */
const DEMO_SCRIPTS = {
  fever: [
    { role: 'user',  text: 'Mujhe kal se tez bukhar hai aur sar dard bhi ho raha hai.' },
    { role: 'ai',    text: 'Aapko fever ke symptoms lag rahe hain. Kripya apna temperature bataye aur paani peete rahein. Main aapke liye ek doctor se connect karta hoon.' },
    { role: 'user',  text: 'Temperature 102°F hai.' },
    { role: 'ai',    text: '⚠️ 102°F fever moderate level hai. Paracetamol 500mg lein, thanda paani se pocha karein. Agar 24 ghante mein sudhaar na ho, turant doctor se milein.' },
  ],
  bp: [
    { role: 'user',  text: 'Mere BP ka level high hai, chakkar aa rahe hain.' },
    { role: 'ai',    text: 'Aapka blood pressure high ho sakta hai. Kripya abhi lait jayein aur namak wali cheezein na khayein. Main Dr. Rajesh Sharma se appointment book kar raha hoon.' },
    { role: 'user',  text: 'BP reading 160/100 hai.' },
    { role: 'ai',    text: '🔴 Stage 2 Hypertension detected. Turant doctor consultation zaroori hai. Emergency helpline: 108. Apne paas koi paani rakhein aur stress se bachein.' },
  ],
  emergency: [
    { role: 'user',  text: 'Heart attack emergency! Patient ko seene mein dard ho raha hai.' },
    { role: 'ai',    text: '🚨 EMERGENCY MODE ACTIVATED\n\n1. Abhi 108 call karein\n2. Patient ko seedha lita dein\n3. Tight kapde dheelay karein\n4. Aspirin 325mg dein agar available ho\n5. CPR shuru karein agar patient saans nahi le raha' },
  ],
  appointment: [
    { role: 'user',  text: 'Mujhe doctor se appointment chahiye.' },
    { role: 'ai',    text: 'Zaroor! Kaunsa specialist chahiye? General Physician, Pediatrician, ya Cardiologist?' },
    { role: 'user',  text: 'General physician chahiye.' },
    { role: 'ai',    text: '✅ Dr. Rajesh Sharma ke saath appointment book ho gayi!\n📅 Kal, 10:00 AM\n📍 Video Consultation\nConfirmation SMS bheja ja raha hai.' },
  ],
};

const LANGUAGES = [
  { code: 'hi', label: 'Hindi', native: 'हिंदी' },
  { code: 'en', label: 'English', native: 'English' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'or', label: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'as', label: 'Assamese', native: 'অসমীয়া' },
];

const TRUST_BADGES = [
  { icon: Clock,        label: 'Available 24/7',         color: 'text-cyan-400' },
  { icon: Globe,        label: 'Multi-Language',          color: 'text-purple-400' },
  { icon: ShieldAlert,  label: 'Emergency Ready',         color: 'text-rose-400' },
  { icon: Sparkles,     label: 'AI Powered',              color: 'text-amber-400' },
];

/* ─── Voice Wave bars ────────────────────────────────────── */
function VoiceWave({ active }) {
  const bars = [3, 6, 9, 5, 11, 7, 4, 8, 6, 10, 5, 7, 9, 4, 6];
  return (
    <div className="flex items-center justify-center gap-[3px] h-10">
      {bars.map((h, i) => (
        <span
          key={i}
          className={`w-[3px] rounded-full transition-all ${active ? 'bg-cyan-400' : 'bg-slate-700'}`}
          style={{
            height: active ? `${h * 3}px` : '6px',
            animation: active ? `soundBar 0.9s ease-in-out ${i * 0.07}s infinite alternate` : 'none',
          }}
        />
      ))}
    </div>
  );
}

/* ─── AI Pulse Ring ──────────────────────────────────────── */
function AIPulse({ listening }) {
  return (
    <div className="relative flex items-center justify-center w-28 h-28">
      {/* outer rings */}
      {listening && (
        <>
          <span className="absolute inset-0 rounded-full border-2 border-cyan-400/40 animate-ping-slow" />
          <span className="absolute inset-2 rounded-full border-2 border-cyan-400/30 animate-ping-slow" style={{ animationDelay: '0.3s' }} />
        </>
      )}
      {/* glow */}
      <div className={`absolute inset-0 rounded-full blur-2xl transition-all duration-700 ${listening ? 'bg-cyan-500/30' : 'bg-slate-800/50'}`} />
      {/* core circle */}
      <div className={`relative w-20 h-20 rounded-full flex items-center justify-center border-2 transition-all duration-500 shadow-2xl
        ${listening
          ? 'bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 border-cyan-400 shadow-cyan-500/50 animate-glow'
          : 'bg-slate-900 border-slate-700'
        }`}>
        {listening
          ? <Volume2 className="w-8 h-8 text-white drop-shadow" />
          : <Bot className="w-8 h-8 text-slate-400" />
        }
      </div>
    </div>
  );
}

/* ─── Chat Message ───────────────────────────────────────── */
function ChatBubble({ msg, isNew }) {
  const isUser = msg.role === 'user';
  const isEmergency = msg.text.startsWith('🚨');
  return (
    <div className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'} ${isNew ? 'animate-slide-up' : ''}`}>
      {!isUser && (
        <div className="w-6 h-6 rounded-md bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-1">
          <Bot className="w-3 h-3 text-cyan-400" />
        </div>
      )}
      <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed whitespace-pre-line
        ${isUser
          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none'
          : isEmergency
            ? 'bg-rose-950 border border-rose-500/50 text-rose-100 rounded-tl-none'
            : 'bg-slate-800 border border-slate-700/80 text-slate-200 rounded-tl-none'
        }`}>
        {msg.text}
      </div>
    </div>
  );
}

/* ─── Typing indicator ───────────────────────────────────── */
function TypingDots() {
  return (
    <div className="flex gap-2 justify-start">
      <div className="w-6 h-6 rounded-md bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
        <Bot className="w-3 h-3 text-cyan-400" />
      </div>
      <div className="bg-slate-800 border border-slate-700/80 px-3 py-2.5 rounded-2xl rounded-tl-none flex items-center gap-1">
        {[0, 1, 2].map(i => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN HERO COMPONENT
═══════════════════════════════════════════════════════════ */
export const Hero = () => {
  /* voice-assistant state */
  const [listening, setListening]       = useState(false);
  const [messages, setMessages]         = useState([]);
  const [typing, setTyping]             = useState(false);
  const [activeLang, setActiveLang]     = useState(LANGUAGES[0]);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [demoKey, setDemoKey]           = useState(null);
  const [demoStep, setDemoStep]         = useState(0);
  const [newIdx, setNewIdx]             = useState(null);
  const chatRef = useRef(null);

  /* scroll chat to bottom */
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, typing]);

  /* initial greeting */
  useEffect(() => {
    setTimeout(() => {
      setMessages([{
        role: 'ai',
        text: `Namaste! Main aapka AI Health Assistant hoon. Koi bhi health sawaal poochein ya neeche se ek demo chunein. 🩺`,
      }]);
    }, 600);
  }, []);

  /* run demo script step by step */
  useEffect(() => {
    if (demoKey === null) return;
    const script = DEMO_SCRIPTS[demoKey];
    if (demoStep >= script.length) { setDemoKey(null); setDemoStep(0); return; }

    const step = script[demoStep];
    const delay = step.role === 'user' ? 400 : 900;

    const timer = setTimeout(() => {
      if (step.role === 'user') {
        setMessages(prev => [...prev, step]);
        setNewIdx(prev => (prev ?? 0) + 1);
        setTyping(true);
        setDemoStep(s => s + 1);
      } else {
        setTyping(false);
        setMessages(prev => [...prev, step]);
        setNewIdx(prev => (prev ?? 0) + 1);
        setDemoStep(s => s + 1);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [demoKey, demoStep]);

  const startDemo = (key) => {
    setMessages([{
      role: 'ai',
      text: `Namaste! Main aapka AI Health Assistant hoon. Koi bhi health sawaal poochein ya neeche se ek demo chunein. 🩺`,
    }]);
    setDemoKey(key);
    setDemoStep(0);
    setTyping(false);
  };

  const toggleMic = () => {
    setListening(l => {
      if (!l) {
        // simulate "listening" then auto AI response
        setTimeout(() => {
          setListening(false);
          setMessages(prev => [...prev, { role: 'user', text: 'Mujhe kal se bukhar hai...' }]);
          setTyping(true);
          setTimeout(() => {
            setTyping(false);
            setMessages(prev => [...prev, {
              role: 'ai',
              text: 'Aapko fever ke symptoms lag rahe hain. Kripya apna temperature bataye aur paani peete rahein.',
            }]);
          }, 1400);
        }, 2500);
      }
      return !l;
    });
  };

  const DEMO_BTNS = [
    { key: 'fever',       label: '🤒 Fever',          color: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-300' },
    { key: 'bp',          label: '❤️ High BP',         color: 'from-rose-500/20 to-rose-600/10 border-rose-500/30 text-rose-300' },
    { key: 'emergency',   label: '🚨 Emergency',       color: 'from-red-500/20 to-red-700/10 border-red-500/40 text-red-300' },
    { key: 'appointment', label: '📅 Appointment',     color: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-300' },
  ];

  return (
    <section id="hero" className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden">

      {/* ── Background orbs ── */}
      <div className="absolute top-1/4 left-1/3 w-[700px] h-[700px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-purple-600/15 rounded-full blur-[130px] pointer-events-none animate-pulse-slow" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-emerald-500/8 rounded-full blur-[100px] pointer-events-none animate-float" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-purple-500/10 rounded-full blur-[110px] pointer-events-none animate-float-delayed" />

      {/* ── Grid overlay ── */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Trusted Badge ── */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-cyan-500/30 text-xs font-semibold text-cyan-300 shadow-xl shadow-cyan-500/10 cursor-pointer group">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Trusted by 2,450+ Rural Indian Villages & Health ASHA Workers</span>
            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            TWO-COLUMN LAYOUT
        ══════════════════════════════════════════════ */}
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center mb-20">

          {/* ── LEFT COLUMN ── */}
          <div>
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.12] mb-5">
              AI-Powered Healthcare{' '}
              <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400">
                For Every Village
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-xl">
              Talk to our AI Health Assistant in your own language and get instant healthcare guidance,
              emergency support, and doctor recommendations — completely free, 24/7.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <button
                onClick={toggleMic}
                className="flex items-center justify-center gap-3 px-7 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold text-sm shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.03] transition-all group"
              >
                <Mic className="w-5 h-5 group-hover:animate-bounce" />
                Start Voice Consultation
              </button>
              <a
                href="#ai-clinic"
                className="flex items-center justify-center gap-3 px-7 py-4 rounded-2xl glass-card border border-slate-700 text-slate-200 font-semibold text-sm hover:border-slate-500 hover:text-white transition-all group"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                Explore Features
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3">
              {TRUST_BADGES.map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex items-center gap-2.5 px-4 py-3 rounded-xl glass-card border border-slate-800">
                  <Icon className={`w-4 h-4 shrink-0 ${color}`} />
                  <span className="text-xs font-semibold text-slate-300">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT COLUMN — AI Voice Assistant Card ── */}
          <div className="relative">

            {/* Glow behind card */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-600/10 to-purple-600/20 rounded-3xl blur-3xl scale-110 pointer-events-none" />

            <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-br from-cyan-500/50 via-blue-500/30 to-purple-500/50 shadow-2xl">
              <div className="bg-slate-950/95 rounded-[22px] overflow-hidden">

                {/* Card Header */}
                <div className="flex items-center justify-between px-5 py-4 bg-slate-900/80 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                      <Stethoscope className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white">GramSwasthya AI</h3>
                      <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                        Online · Healthcare AI Active
                      </p>
                    </div>
                  </div>

                  {/* Language Selector */}
                  <div className="relative">
                    <button
                      onClick={() => setShowLangMenu(m => !m)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:border-purple-500/60 transition-colors"
                    >
                      <Globe className="w-3 h-3 text-purple-400" />
                      <span className="font-semibold text-purple-300">{activeLang.native}</span>
                      <ChevronDown className="w-3 h-3 text-slate-500" />
                    </button>
                    {showLangMenu && (
                      <div className="absolute right-0 top-full mt-1 w-44 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-30 overflow-hidden">
                        <div className="max-h-52 overflow-y-auto py-1">
                          {LANGUAGES.map(lang => (
                            <button
                              key={lang.code}
                              onClick={() => { setActiveLang(lang); setShowLangMenu(false); }}
                              className={`w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-slate-800 transition-colors ${activeLang.code === lang.code ? 'text-cyan-400 bg-slate-800/60' : 'text-slate-300'}`}
                            >
                              <span>{lang.label}</span>
                              <span className="text-slate-500">{lang.native}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Avatar + Wave area */}
                <div className="flex flex-col items-center gap-3 py-6 px-5 bg-gradient-to-b from-slate-900/60 to-slate-950/80 border-b border-slate-800/60">
                  <AIPulse listening={listening} />
                  <VoiceWave active={listening} />
                  <p className={`text-xs font-mono font-semibold transition-colors ${listening ? 'text-cyan-400' : 'text-slate-500'}`}>
                    {listening ? '🎤 Listening… speak now' : 'Tap mic to start voice input'}
                  </p>

                  {/* Mic Button */}
                  <button
                    onClick={toggleMic}
                    className={`relative mt-1 w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 group
                      ${listening
                        ? 'bg-rose-600 border-2 border-rose-400 shadow-rose-500/40 hover:bg-rose-500 animate-glow'
                        : 'bg-gradient-to-br from-cyan-500 to-blue-600 border-2 border-cyan-400/60 shadow-cyan-500/40 hover:scale-110'
                      }`}
                  >
                    {listening
                      ? <MicOff className="w-6 h-6 text-white" />
                      : <Mic className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                    }
                    {!listening && <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950 animate-ping" />}
                  </button>
                </div>

                {/* Chat Messages */}
                <div ref={chatRef} className="h-52 overflow-y-auto p-4 space-y-3 bg-slate-950/90 scroll-smooth">
                  {messages.map((msg, i) => (
                    <ChatBubble key={i} msg={msg} isNew={i === newIdx} />
                  ))}
                  {typing && <TypingDots />}
                  {messages.length === 0 && !typing && (
                    <p className="text-center text-xs text-slate-600 mt-8">Start a demo below or tap the mic ↑</p>
                  )}
                </div>

                {/* Demo Scenario Buttons */}
                <div className="px-4 py-3 bg-slate-900/80 border-t border-slate-800/80">
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest mb-2">Interactive Demo</p>
                  <div className="grid grid-cols-2 gap-2">
                    {DEMO_BTNS.map(({ key, label, color }) => (
                      <button
                        key={key}
                        onClick={() => startDemo(key)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold border bg-gradient-to-r ${color} hover:scale-[1.03] transition-all`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Floating health icon badges */}
            <div className="absolute -top-3 -left-4 w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center animate-float shadow-xl">
              <Heart className="w-5 h-5 text-rose-400" />
            </div>
            <div className="absolute top-1/3 -right-4 w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center animate-float-delayed shadow-xl">
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="absolute -bottom-3 -left-4 w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center animate-float shadow-xl">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {mockData.stats.map((stat, idx) => {
            const IconComp = stat.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl glass-card border border-slate-800 hover:border-slate-700 relative overflow-hidden group"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${stat.color} p-0.5 mb-4 shadow-lg`}>
                  <div className="w-full h-full bg-slate-950 rounded-[9px] flex items-center justify-center">
                    <IconComp className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1 group-hover:text-cyan-400 transition-colors">
                  {stat.value}
                </h4>
                <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
                <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/15 transition-all" />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
