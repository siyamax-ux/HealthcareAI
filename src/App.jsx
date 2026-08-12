import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { VirtualClinic } from './components/VirtualClinic';
import { VoiceDoctor } from './components/VoiceDoctor';
import { EmergencyDetection } from './components/EmergencyDetection';
import { MedicalOCR } from './components/MedicalOCR';
import { DiseasePrediction } from './components/DiseasePrediction';
import { FamilyDashboard } from './components/FamilyDashboard';
import { RemoteConsultation } from './components/RemoteConsultation';
import { VillageAnalytics } from './components/VillageAnalytics';
import { SuccessStories } from './components/SuccessStories';
import { PortalPreview, OfflineSection, FAQSection, ContactSection } from './components/AdditionalSections';
import { Footer } from './components/Footer';
import { FloatingAIAssistant } from './components/FloatingAIAssistant';
import { FloatingSOSButton } from './components/FloatingSOSButton';
import { MultiLanguageSystem } from './components/MultiLanguageSystem';
import { IoTSensorMonitoring } from './components/IoTSensorMonitoring';
import { GeoLangProvider } from './context/GeoLangContext';
import { GeoLangDetector } from './components/GeoLangDetector';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/LoginPage';

/* ── Role-based welcome badge shown in the navbar area ── */
const ROLE_CONFIG = {
  patient:      { label: 'Patient',      color: 'text-cyan-400',    bg: 'bg-cyan-500/10',    border: 'border-cyan-500/30'    },
  doctor:       { label: 'Doctor',       color: 'text-purple-400',  bg: 'bg-purple-500/10',  border: 'border-purple-500/30'  },
  healthworker: { label: 'Health Worker',color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
};

/* ── Logout button floating in top-right after login ── */
function UserBadge() {
  const { user, logout } = useAuth();
  if (!user) return null;
  const rc = ROLE_CONFIG[user.role] || ROLE_CONFIG.patient;
  return (
    <div className="fixed top-3 right-[12rem] z-[55] hidden sm:flex items-center gap-2">
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${rc.bg} border ${rc.border} shadow-md`}>
        <span className={`w-1.5 h-1.5 rounded-full bg-current ${rc.color} animate-pulse`} />
        <span className={`text-[11px] font-bold ${rc.color}`}>{user.name}</span>
        <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${rc.bg} ${rc.color} font-semibold uppercase tracking-wide`}>{rc.label}</span>
      </div>
      <button
        onClick={logout}
        className="px-2.5 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-[11px] text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-all"
      >
        Sign out
      </button>
    </div>
  );
}

/* ── Main app shell (shown only when authenticated) ── */
function MainApp() {
  const [darkMode, setDarkMode]         = useState(true);
  const [largeText, setLargeText]       = useState(false);
  const [audioReadAloud, setAudioReadAloud] = useState(false);
  const [lowLiteracy, setLowLiteracy]   = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress((window.scrollY / totalHeight) * 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} ${largeText ? 'large-text-mode' : ''} transition-colors duration-300`}>

      {/* Scroll progress bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-400 z-50 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* User badge + sign out */}
      <UserBadge />

      {/* Navbar */}
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <main>
        <Hero />
        <VirtualClinic />
        <VoiceDoctor />
        <MultiLanguageSystem
          largeText={largeText}       setLargeText={setLargeText}
          audioReadAloud={audioReadAloud} setAudioReadAloud={setAudioReadAloud}
          lowLiteracy={lowLiteracy}   setLowLiteracy={setLowLiteracy}
        />
        <IoTSensorMonitoring />
        <EmergencyDetection />
        <MedicalOCR />
        <DiseasePrediction />
        <FamilyDashboard />
        <RemoteConsultation />
        <VillageAnalytics />
        <SuccessStories />
        <PortalPreview />
        <OfflineSection />
        <FAQSection />
        <ContactSection />
      </main>

      <Footer />
      <FloatingAIAssistant />
      <FloatingSOSButton />
      <GeoLangDetector />
    </div>
  );
}

/* ── Root: gate on authentication ── */
function AppGate() {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <MainApp /> : <LoginPage />;
}

export default function App() {
  return (
    <GeoLangProvider>
      <AuthProvider>
        <AppGate />
      </AuthProvider>
    </GeoLangProvider>
  );
}
