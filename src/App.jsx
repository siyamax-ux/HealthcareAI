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

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [largeText, setLargeText] = useState(false);
  const [audioReadAloud, setAudioReadAloud] = useState(false);
  const [lowLiteracy, setLowLiteracy] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} ${largeText ? 'large-text-mode' : ''} transition-colors duration-300`}>
      
      {/* Top Scroll Progress Indicator */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-400 z-50 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Navigation Header */}
      <Navbar 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
      />

      {/* Main Content Modules */}
      <main>
        {/* 1. Hero Landing */}
        <Hero />

        {/* 2. AI Virtual Clinic */}
        <VirtualClinic />

        {/* 3. AI Voice Doctor */}
        <VoiceDoctor />

        {/* AI Multi-Language Communication Hub */}
        <MultiLanguageSystem 
          largeText={largeText} 
          setLargeText={setLargeText}
          audioReadAloud={audioReadAloud}
          setAudioReadAloud={setAudioReadAloud}
          lowLiteracy={lowLiteracy}
          setLowLiteracy={setLowLiteracy}
        />

        {/* AI IoT Sensor Vital Monitoring Systems */}
        <IoTSensorMonitoring />

        {/* 4. AI Emergency Risk Detection */}
        <EmergencyDetection />

        {/* 5. AI Medical OCR Scanner */}
        <MedicalOCR />

        {/* 6. Community Disease Analytics & Heatmap */}
        <DiseasePrediction />

        {/* 7. Family Health Dashboard & AI Twin */}
        <FamilyDashboard />

        {/* 8. Remote Specialist Doctors */}
        <RemoteConsultation />

        {/* 9. Village Health Analytics */}
        <VillageAnalytics />

        {/* 10. Success Stories Carousel */}
        <SuccessStories />

        {/* 12. Health Worker Portal Mockup */}
        <PortalPreview />

        {/* Offline Healthcare Sync */}
        <OfflineSection />

        {/* 14. FAQ Section */}
        <FAQSection />

        {/* 15. Contact Section */}
        <ContactSection />
      </main>

      {/* 16. Footer */}
      <Footer />

      {/* Floating AI Chat Assistant */}
      <FloatingAIAssistant />

      {/* Floating Emergency SOS Assistant */}
      <FloatingSOSButton />

    </div>
  );
}
