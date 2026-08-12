import React, { useState } from 'react';
import { 
  Bot, Stethoscope, FileSearch, ShieldAlert, Cpu, Heart, CheckCircle2, 
  ArrowRight, AlertTriangle, Activity, Sparkles, RefreshCw, Zap
} from 'lucide-react';

export const VirtualClinic = () => {
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const symptomList = [
    "High Fever & Chills (तेज़ बुखार)",
    "Severe Joint Pain (जोड़ों में दर्द)",
    "Continuous Cough & Shortness of Breath (खांसी और सांस फूलना)",
    "Abdominal Pain & Vomiting (पेट दर्द)",
    "Dizziness & Low Blood Pressure (चक्कर आना)"
  ];

  const handleAnalyze = (symptom) => {
    setSelectedSymptom(symptom);
    setAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      setAnalyzing(false);
      if (symptom.includes("Fever") || symptom.includes("Joint")) {
        setResult({
          riskLevel: "Yellow (Moderate Risk)",
          riskColor: "border-amber-500/50 bg-amber-500/10 text-amber-300",
          badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
          summary: "Symptoms correlate with Vector-borne viral infection (Dengue/Chikungunya).",
          recommendations: [
            "Maintain high fluid intake (ORS, Coconut water)",
            "Get a CBC Blood Test at nearest Primary Health Centre",
            "Monitor body temp every 4 hours"
          ],
          emergencyAction: "Connect to Tele-Doctor within 30 minutes."
        });
      } else if (symptom.includes("Shortness") || symptom.includes("Dizziness")) {
        setResult({
          riskLevel: "Red (Critical Emergency Risk)",
          riskColor: "border-rose-500/50 bg-rose-500/10 text-rose-300",
          badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/40",
          summary: "Symptoms indicate acute respiratory distress or cardiovascular drop.",
          recommendations: [
            "Keep patient in an upright sitting posture",
            "Administer supplementary oxygen if ASHA worker kit available",
            "Immediate hospital referral required"
          ],
          emergencyAction: "Immediate Ambulance & Tele-Emergency Doctor Alerted!"
        });
      } else {
        setResult({
          riskLevel: "Green (Mild Risk)",
          riskColor: "border-emerald-500/50 bg-emerald-500/10 text-emerald-300",
          badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
          summary: "Common seasonal gastroenteritis or digestive inflammation.",
          recommendations: [
            "Light diet (Khichdi, Curd rice)",
            "Stay hydrated with boiled water",
            "Rest for 24 hours"
          ],
          emergencyAction: "Standard tele-consultation recommended."
        });
      }
    }, 1200);
  };

  const features = [
    {
      icon: Bot,
      title: "AI Symptom Checker",
      desc: "Conversational triage trained on WHO & Indian ICMR clinical protocols."
    },
    {
      icon: Stethoscope,
      title: "Smart Patient Assessment",
      desc: "Evaluates severity based on age, pre-existing conditions, and local outbreak data."
    },
    {
      icon: FileSearch,
      title: "Medical History Analyzer",
      desc: "Synthesizes previous prescriptions and vaccinations automatically."
    },
    {
      icon: Heart,
      title: "Preliminary Health Summary",
      desc: "Generates structured PDF reports for village health workers and doctors."
    },
    {
      icon: ShieldAlert,
      title: "Emergency Risk Detection",
      desc: "Instantly flags life-threatening red risks for fast track hospital referral."
    }
  ];

  return (
    <section id="ai-clinic" className="py-24 relative overflow-hidden bg-slate-950/60">
      
      {/* Glow Effects */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-bold text-cyan-400 mb-4">
            <Cpu className="w-4 h-4" />
            <span>Interactive Module 1</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            AI Virtual Clinic Engine
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Experience real-time AI triage designed to support village ASHA workers, rural clinic staff, and individual patients.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx}
                className="p-5 rounded-2xl glass-card border border-slate-800 hover:border-cyan-500/40 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {feat.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center gap-1 text-[11px] font-semibold text-cyan-400">
                  <span>Learn More</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Symptom Simulator Widget */}
        <div className="max-w-4xl mx-auto rounded-3xl glass-panel p-6 sm:p-10 border border-slate-800 shadow-2xl">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                Test AI Symptom Checker Live
              </h3>
              <p className="text-xs text-slate-400">Select a chief complaint to trigger AI clinical assessment</p>
            </div>
            <span className="text-xs font-mono px-3 py-1 bg-slate-900 border border-slate-800 text-slate-300 rounded-lg">
              Engine Status: Ready
            </span>
          </div>

          {/* Quick Select Buttons */}
          <div className="mb-8">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              Select Patient Symptom:
            </label>
            <div className="flex flex-wrap gap-2">
              {symptomList.map((sym, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnalyze(sym)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    selectedSymptom === sym 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 border-transparent' 
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>

          {/* Analysis Processing State */}
          {analyzing && (
            <div className="p-8 rounded-2xl bg-slate-900/90 border border-cyan-500/30 text-center flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
              <p className="text-sm font-semibold text-white">GramSwasthya AI is evaluating clinical parameters...</p>
              <p className="text-xs text-slate-400 font-mono">Cross-referencing rural health database & ICMR guidelines</p>
            </div>
          )}

          {/* Result Output Card */}
          {result && !analyzing && (
            <div className={`p-6 rounded-2xl border ${result.riskColor} transition-all animate-in fade-in duration-300`}>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  <span className="font-bold text-sm">Assessment Result:</span>
                  <span className={`px-3 py-0.5 rounded-full text-xs font-extrabold border ${result.badgeColor}`}>
                    {result.riskLevel}
                  </span>
                </div>
                <span className="text-xs font-mono opacity-70">AI Tele-Triage ID: #GS-9421</span>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs uppercase font-semibold text-slate-400 tracking-wider mb-1">Clinical Summary</h4>
                  <p className="text-sm text-white font-medium">{result.summary}</p>
                </div>

                <div>
                  <h4 className="text-xs uppercase font-semibold text-slate-400 tracking-wider mb-2">Immediate Recommendations</h4>
                  <ul className="space-y-1.5 text-xs text-slate-200">
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    {result.emergencyAction}
                  </span>
                  <a
                    href="#doctors"
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-xs font-bold hover:shadow-lg transition-all"
                  >
                    Connect Doctor Now
                  </a>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
