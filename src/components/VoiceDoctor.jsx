import React, { useState, useEffect } from 'react';
import { 
  Mic, MicOff, Volume2, Globe, Sparkles, Play, Pause, RefreshCw, 
  MessageSquare, User, Bot, CheckCircle2, ChevronRight
} from 'lucide-react';

export const VoiceDoctor = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('Hindi');
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const languages = [
    { name: 'Hindi (हिंदी)', code: 'Hindi' },
    { name: 'Bhojpuri (भोजपुरी)', code: 'Bhojpuri' },
    { name: 'Maithili (मैथिली)', code: 'Maithili' },
    { name: 'Gujarati (ગુજરાતી)', code: 'Gujarati' },
    { name: 'Punjabi (ਪੰਜਾਬੀ)', code: 'Punjabi' },
    { name: 'English', code: 'English' }
  ];

  const handleToggleMic = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTranscript("सुनिए डॉक्टर साहब, मुझे पिछले 2 दिनों से तेज़ ठंड लगकर बुखार आ रहा है...");
      setAiResponse('');

      setTimeout(() => {
        setIsRecording(false);
        setAiResponse("आपकी बातें समझ आ गई हैं। ठंड लगकर बुखार आना मलेरिया (Malaria) या मौसमी संक्रमण का संकेत हो सकता है। कृपया पास के प्राथमिक स्वास्थ्य केंद्र से blood smear परीक्षण करवाएं और ORS घोल लेते रहें।");
      }, 3500);
    } else {
      setIsRecording(false);
    }
  };

  const handlePlayAudio = () => {
    setIsPlayingAudio(true);
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 4000);
  };

  return (
    <section id="voice-doctor" className="py-24 relative overflow-hidden">
      
      {/* Background Gradient Orbs */}
      <div className="absolute top-1/2 left-10 w-[500px] h-[500px] bg-gradient-to-r from-purple-600/10 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs font-bold text-purple-400 mb-4">
            <Mic className="w-4 h-4" />
            <span>Interactive Module 2</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            AI Voice Doctor Engine
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Speech-to-Text & Text-to-Speech specifically tuned for rural Indian dialects. Speak naturally without needing typing skills.
          </p>
        </div>

        {/* Main Interface Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
          
          {/* Left Column: Voice Assistant Widget */}
          <div className="lg:col-span-5 rounded-3xl glass-panel p-8 border border-slate-800 text-center relative overflow-hidden shadow-2xl">
            
            {/* Language Selector Selector Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>Select Dialect:</span>
              </div>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-cyan-300 text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>

            {/* Central Animated Microphone Circle */}
            <div className="my-10 flex flex-col items-center justify-center">
              <div className="relative">
                {/* Pulse Ripples when Recording */}
                {isRecording && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-cyan-500/20 animate-ping" />
                    <div className="absolute -inset-4 rounded-full bg-purple-500/20 animate-pulse" />
                  </>
                )}

                <button
                  onClick={handleToggleMic}
                  className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
                    isRecording 
                      ? 'bg-rose-500 text-white shadow-rose-500/50 scale-105' 
                      : 'bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 text-white shadow-cyan-500/30 hover:scale-105'
                  }`}
                >
                  {isRecording ? (
                    <MicOff className="w-10 h-10 animate-bounce" />
                  ) : (
                    <Mic className="w-10 h-10" />
                  )}
                </button>
              </div>

              <p className="mt-6 text-sm font-bold text-white">
                {isRecording ? "Listening to your voice..." : "Click Microphone & Speak"}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {isRecording ? "Transcribing dialect in real time" : `Configured for ${selectedLanguage}`}
              </p>
            </div>

            {/* Voice Wave Visualizer Simulation */}
            <div className="h-12 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-center justify-center gap-1.5 px-4 overflow-hidden">
              {[40, 70, 25, 90, 50, 80, 30, 95, 60, 40, 75, 30, 85, 50, 90, 60, 40, 80, 20].map((h, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-200 ${
                    isRecording || isPlayingAudio 
                      ? 'bg-gradient-to-t from-cyan-500 to-purple-500 animate-pulse' 
                      : 'bg-slate-700 h-2'
                  }`}
                  style={{ height: isRecording || isPlayingAudio ? `${h}%` : '8px' }}
                />
              ))}
            </div>

          </div>

          {/* Right Column: Real-Time Conversation Preview */}
          <div className="lg:col-span-7 rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800 space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-400" />
                Live AI Voice Conversation
              </h3>
              <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Speech-to-Text Active
              </span>
            </div>

            {/* User Speech Card */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                  <User className="w-3.5 h-3.5" />
                  Village Patient Voice Input
                </span>
                <span>Language: {selectedLanguage}</span>
              </div>
              <p className="text-sm text-slate-200 font-medium italic">
                {transcript || '"Click the microphone on the left and speak your health issue..."'}
              </p>
            </div>

            {/* AI Speech Response Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-purple-950/40 to-slate-900 border border-purple-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-bold text-purple-300">
                  <Bot className="w-4 h-4 text-purple-400" />
                  AI Voice Doctor Diagnosis
                </span>
                {aiResponse && (
                  <button
                    onClick={handlePlayAudio}
                    className="flex items-center gap-1.5 px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-lg text-xs hover:bg-purple-500/30 transition-all"
                  >
                    {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{isPlayingAudio ? "Playing Voice..." : "Listen Audio"}</span>
                  </button>
                )}
              </div>

              <p className="text-sm text-slate-100 font-normal leading-relaxed">
                {aiResponse || "Press microphone button to start a multi-lingual medical conversation."}
              </p>

              {aiResponse && (
                <div className="pt-3 border-t border-purple-500/20 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Audio Transcript Saved to Health History
                  </span>
                  <a href="#doctors" className="text-cyan-400 font-bold hover:underline">
                    Forward to Doctor →
                  </a>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
