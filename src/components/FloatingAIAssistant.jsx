import React, { useState, useRef, useEffect } from 'react';
import {
  Bot, X, Send, Mic, MicOff, ShieldAlert, Globe,
  ChevronDown, Volume2, Phone, Minimize2, Maximize2,
  MessageCircle, AlertTriangle, Stethoscope
} from 'lucide-react';
import { useGeoLang } from '../context/GeoLangContext';

/* ─── Quick reply suggestions ────────────────────────────── */
const QUICK_REPLIES = [
  'Mujhe bukhar hai',
  'BP high hai',
  'Pet dard ho raha hai',
  'Emergency help',
  'Doctor appointment',
];

/* ─── Emergency numbers ──────────────────────────────────── */
const EMERGENCY_CONTACTS = [
  { label: 'Ambulance',     number: '108', color: 'bg-rose-600 hover:bg-rose-500' },
  { label: 'Police',        number: '100', color: 'bg-blue-600 hover:bg-blue-500' },
  { label: 'Fire',          number: '101', color: 'bg-orange-600 hover:bg-orange-500' },
  { label: 'Women Helpline',number: '1091',color: 'bg-purple-600 hover:bg-purple-500' },
];

/* ─── AI response engine ─────────────────────────────────── */
const AI_RESPONSES = {
  bukhar:      '🤒 Bukhar ke liye: Paracetamol 500mg lein, paani zyada piyein, aur rest karein. Agar temperature 103°F se zyada ho ya 2 din mein sudhaar na ho, doctor se milein.',
  fever:       '🤒 For fever: Take Paracetamol 500mg, drink fluids, rest well. Consult doctor if temp > 103°F or no improvement in 2 days.',
  bp:          '❤️ High BP ke liye: Namak kam karein, stress se bachein, aur seedhe bethein. Agar 160/100 se zyada hai, turant doctor se milein. Emergency: 108.',
  pet:         '🫃 Pet dard ke liye: Thoda paani piyein, rest karein. Agar dard teez ho ya 4 ghante se zyada rahe, ya bukhar bhi aaye, turant doctor ko dikhayein.',
  emergency:   '🚨 EMERGENCY! Abhi 108 call karein. Patient ko comfortable position mein rakhein. Tight kapde dheelay karein. Haath mein haath pakdein. Aane tak CPR guidance ke liye line par rahein.',
  doctor:      '📅 Doctor appointment ke liye Dr. Rajesh Sharma available hain. Kal 10:00 AM video consultation book ki ja sakti hai. Confirm karein?',
  appointment: '✅ Appointment book ho gayi! Dr. Rajesh Sharma — Kal 10:00 AM. Confirmation SMS aapke number par bheja jayega.',
  headache:    '🧠 Sar dard ke liye: Andheri aur shant jagah mein aaraam karein. Thanda paani piyein. Agar dard 6 ghante se zyada ho ya aankhon mein problem ho, doctor se milein.',
  default:     'Main aapki baat samajh raha hoon. Kripya apne symptoms describe karein ya neeche ke options mein se chunein. Main aapki poori madad karunga. 🩺',
};

function getAIResponse(text) {
  const t = text.toLowerCase();
  if (t.includes('bukhar') || t.includes('fever') || t.includes('temperature') || t.includes('taap'))
    return AI_RESPONSES.bukhar;
  if (t.includes('bp') || t.includes('blood pressure') || t.includes('pressure'))
    return AI_RESPONSES.bp;
  if (t.includes('pet') || t.includes('stomach') || t.includes('abdomen') || t.includes('pait'))
    return AI_RESPONSES.pet;
  if (t.includes('emergency') || t.includes('heart attack') || t.includes('unconscious') || t.includes('snake') || t.includes('help'))
    return AI_RESPONSES.emergency;
  if (t.includes('appointment') || t.includes('book'))
    return AI_RESPONSES.appointment;
  if (t.includes('doctor'))
    return AI_RESPONSES.doctor;
  if (t.includes('sar') || t.includes('head') || t.includes('sir dard') || t.includes('headache'))
    return AI_RESPONSES.headache;
  return AI_RESPONSES.default;
}

/* ─── Language list ──────────────────────────────────────── */
const LANGUAGES = [
  { code: 'hi', native: 'हिंदी' },
  { code: 'en', native: 'English' },
  { code: 'bn', native: 'বাংলা' },
  { code: 'ta', native: 'தமிழ்' },
  { code: 'te', native: 'తెలుగు' },
  { code: 'mr', native: 'मराठी' },
  { code: 'gu', native: 'ગુજરાતી' },
  { code: 'pa', native: 'ਪੰਜਾਬੀ' },
];

/* ─── Typing dots ────────────────────────────────────────── */
function TypingDots() {
  return (
    <div className="flex gap-2 items-start">
      <div className="w-6 h-6 rounded-md bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
        <Bot className="w-3 h-3 text-cyan-400" />
      </div>
      <div className="bg-slate-900 border border-slate-700 px-3 py-2.5 rounded-2xl rounded-tl-none flex gap-1">
        {[0, 1, 2].map(i => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN FLOATING WIDGET
═══════════════════════════════════════════════════════════ */
export const FloatingAIAssistant = () => {
  /* ── consume geo-lang context ── */
  const { activeLang: geoLang, greeting, emergency, setLanguageManually } = useGeoLang();

  const [isOpen, setIsOpen]             = useState(false);
  const [activeTab, setActiveTab]       = useState('chat');
  const [messages, setMessages]         = useState([]);
  const [input, setInput]               = useState('');
  const [typing, setTyping]             = useState(false);
  const [listening, setListening]       = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const chatEndRef = useRef(null);

  /* initialise greeting from geo context whenever language changes */
  useEffect(() => {
    setMessages([{
      sender: 'bot',
      text: `${greeting.greeting}\n${greeting.subtitle}`,
    }]);
  }, [geoLang.code]);

  /* scroll to bottom */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const pushBotMessage = (text) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { sender: 'bot', text }]);
    }, 900 + Math.random() * 500);
  };

  const handleSend = (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages(prev => [...prev, { sender: 'user', text }]);
    setInput('');
    pushBotMessage(getAIResponse(text));
  };

  const handleQuickReply = (text) => {
    setMessages(prev => [...prev, { sender: 'user', text }]);
    pushBotMessage(getAIResponse(text));
  };

  const recognitionRef = React.useRef(null);

  const handleMicToggle = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Fallback for browsers without Web Speech API
      const voiceText = 'Mujhe bukhar aur sar dard hai';
      setMessages(prev => [...prev, { sender: 'user', text: `🎤 ${voiceText}` }]);
      pushBotMessage(getAIResponse(voiceText));
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    /* Build a proper BCP-47 locale tag for the Web Speech API */
    const LANG_LOCALES = {
      hi: 'hi-IN', mr: 'mr-IN', gu: 'gu-IN', pa: 'pa-IN', ta: 'ta-IN',
      te: 'te-IN', kn: 'kn-IN', ml: 'ml-IN', bn: 'bn-IN', as: 'as-IN',
      or: 'or-IN', en: 'en-US', fr: 'fr-FR', de: 'de-DE', es: 'es-ES',
      ja: 'ja-JP', zh: 'zh-CN', ru: 'ru-RU', ar: 'ar-SA',
    };
    recognition.lang = LANG_LOCALES[geoLang.code] || geoLang.code;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);
    recognition.onend   = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMessages(prev => [...prev, { sender: 'user', text: `🎤 ${transcript}` }]);
      pushBotMessage(getAIResponse(transcript));
    };

    recognition.start();
    setListening(true);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {/* ── Expanded panel ── */}
      {isOpen && (
        <div className="w-80 sm:w-[360px] rounded-3xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 overflow-hidden flex flex-col bg-slate-950/98 backdrop-blur-xl"
          style={{ maxHeight: '560px' }}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                <Stethoscope className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white leading-none mb-0.5">GramSwasthya AI</h4>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse inline-block" />
                  Active · Multilingual
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Language switcher */}
              <div className="relative">
                <button
                  onClick={() => setShowLangMenu(m => !m)}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-[10px] text-purple-300 hover:border-purple-500/60 transition-colors"
                >
                  <Globe className="w-3 h-3" />
                  {geoLang.native}
                  <ChevronDown className="w-2.5 h-2.5 text-slate-500" />
                </button>
                {showLangMenu && (
                  <div className="absolute right-0 top-full mt-1 w-32 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-40 overflow-hidden">
                    <div className="max-h-44 overflow-y-auto py-1">
                      {LANGUAGES.map(lang => (
                        <button
                          key={lang.code}
                          onClick={() => { setLanguageManually(lang.code); setShowLangMenu(false); }}
                          className={`w-full text-left px-3 py-1.5 text-xs transition-colors hover:bg-slate-800 ${geoLang.code === lang.code ? 'text-cyan-400' : 'text-slate-300'}`}
                        >
                          {lang.native}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tab Bar */}
          <div className="flex border-b border-slate-800">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold transition-colors ${activeTab === 'chat' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-slate-900/60' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              AI Chat
            </button>
            <button
              onClick={() => setActiveTab('emergency')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold transition-colors ${activeTab === 'emergency' ? 'text-rose-400 border-b-2 border-rose-400 bg-rose-950/30' : 'text-slate-500 hover:text-rose-400'}`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Emergency
            </button>
          </div>

          {/* ── CHAT TAB ── */}
          {activeTab === 'chat' && (
            <>
              {/* Voice wave indicator */}
              {listening && (
                <div className="flex items-center justify-center gap-1 py-2 bg-cyan-500/10 border-b border-cyan-500/20">
                  {[4,7,10,6,9,5,8,11,4,7].map((h, i) => (
                    <span key={i} className="w-[2px] bg-cyan-400 rounded-full"
                      style={{ height: `${h * 2}px`, animation: `soundBar 0.8s ease-in-out ${i * 0.08}s infinite alternate` }} />
                  ))}
                  <span className="ml-2 text-[10px] text-cyan-400 font-mono font-semibold">Listening…</span>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs bg-slate-950/80" style={{ minHeight: 0, maxHeight: '260px' }}>
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.sender === 'bot' && (
                      <div className="w-5 h-5 rounded-md bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-3 h-3 text-cyan-400" />
                      </div>
                    )}
                    <div className={`px-3 py-2 rounded-2xl max-w-[82%] leading-relaxed whitespace-pre-line
                      ${msg.sender === 'user'
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none'
                        : msg.text.startsWith('🚨')
                          ? 'bg-rose-950 border border-rose-500/50 text-rose-100 rounded-tl-none'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                      }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {typing && <TypingDots />}
                <div ref={chatEndRef} />
              </div>

              {/* Quick replies */}
              <div className="px-3 py-2 border-t border-slate-800/60 flex gap-1.5 overflow-x-auto scrollbar-hide">
                {QUICK_REPLIES.map(r => (
                  <button
                    key={r}
                    onClick={() => handleQuickReply(r)}
                    className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-[10px] text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300 transition-colors whitespace-nowrap"
                  >
                    {r}
                  </button>
                ))}
              </div>

              {/* Input Bar */}
              <form onSubmit={handleSend} className="flex items-center gap-2 p-3 bg-slate-900/80 border-t border-slate-800">
                {/* Mic button */}
                <button
                  type="button"
                  onClick={handleMicToggle}
                  className={`p-2 rounded-xl transition-all shrink-0 ${listening
                    ? 'bg-rose-600 border border-rose-400 shadow-lg shadow-rose-500/30'
                    : 'bg-slate-800 border border-slate-700 hover:border-cyan-500/50'
                  }`}
                >
                  {listening
                    ? <MicOff className="w-3.5 h-3.5 text-white" />
                    : <Mic className="w-3.5 h-3.5 text-cyan-400" />
                  }
                </button>

                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type or speak your health query…"
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="p-2 rounded-xl bg-cyan-500 text-white hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          )}

          {/* ── EMERGENCY TAB (geo-localized) ── */}
          {activeTab === 'emergency' && (
            <div className="p-4 space-y-3 overflow-y-auto" style={{ maxHeight: '400px' }}>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <p className="text-xs text-rose-300 font-semibold">{emergency.cta}</p>
              </div>

              {/* Emergency call buttons */}
              <div className="grid grid-cols-2 gap-2">
                {EMERGENCY_CONTACTS.map(({ label, number, color }) => (
                  <a
                    key={number}
                    href={`tel:${number}`}
                    className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl text-white text-xs font-bold transition-all hover:scale-[1.03] shadow-lg ${color}`}
                  >
                    <Phone className="w-4 h-4" />
                    <span>{label}</span>
                    <span className="text-base font-extrabold">{number}</span>
                  </a>
                ))}
              </div>

              {/* First aid scenarios — pulled from geo context */}
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest mt-2">
                AI First Aid · {geoLang.native}
              </p>
              {[
                { title: '🫀 Heart Attack', steps: emergency.heartAttack },
                { title: '🐍 Snake Bite',   steps: emergency.snakeBite   },
                { title: '🔥 Burns',         steps: emergency.burns       },
              ].map(({ title, steps }) => (
                <div key={title} className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <h5 className="text-xs font-bold text-white mb-2">{title}</h5>
                  <ol className="space-y-1">
                    {steps.map((s, i) => (
                      <li key={i} className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                        {s}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Floating trigger button ── */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className={`relative group flex items-center gap-2 px-4 py-3.5 rounded-2xl text-white font-bold text-sm shadow-2xl transition-all duration-300
          ${isOpen
            ? 'bg-slate-800 border border-slate-700 shadow-none'
            : 'bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 shadow-cyan-500/40 hover:scale-110'
          }`}
      >
        {isOpen
          ? <X className="w-5 h-5" />
          : <>
              <Bot className="w-5 h-5 animate-bounce" />
              <span className="hidden sm:inline">AI Assistant</span>
              {/* notification dot */}
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-950 rounded-full animate-ping" />
            </>
        }
      </button>
    </div>
  );
};
