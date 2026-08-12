import React, { useState, useEffect } from 'react';
import { 
  Heart, Sun, Moon, Sparkles, Menu, X, Shield, Activity, PhoneCall, Globe, Cpu 
} from 'lucide-react';

export const Navbar = ({ darkMode, setDarkMode, activeSection, setActiveSection }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'AI Virtual Clinic', href: '#ai-clinic' },
    { name: 'Voice Doctor', href: '#voice-doctor' },
    { name: 'AI Languages', href: '#multilingual' },
    { name: 'IoT Vitals', href: '#iot-sensors' },
    { name: 'Emergency Risk', href: '#emergency' },
    { name: 'Medical OCR', href: '#ocr' },
    { name: 'Disease Prediction', href: '#analytics' },
    { name: 'Remote Doctors', href: '#doctors' },
    { name: 'Offline Sync', href: '#offline' },
    { name: 'FAQ', href: '#faq' },
  ];

  const scrollToSection = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? darkMode 
          ? 'glass-panel border-b border-slate-800/80 shadow-2xl py-3' 
          : 'glass-panel-light border-b border-sky-100 shadow-lg py-3'
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-[2px] shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Heart className="w-6 h-6 text-cyan-400 fill-cyan-400/20 animate-pulse" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-sky-200 to-cyan-400">
                SetuHealthAI
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full">
                AI 3.0
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">Rural Health Empowerment</p>
          </div>
        </a>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-1 px-4 py-1.5 rounded-full bg-slate-900/60 border border-slate-800/80 backdrop-blur-lg">
          {navLinks.slice(0, 8).map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-cyan-400 rounded-full hover:bg-slate-800/60 transition-all"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#doctors"
            onClick={(e) => scrollToSection(e, '#doctors')}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-cyan-400 rounded-full hover:bg-slate-800/60 transition-all"
          >
            Doctors
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all duration-300 shadow-md"
            title="Toggle Dark / Light Mode"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Language Selector Globe */}
          <a
            href="#multilingual"
            onClick={(e) => scrollToSection(e, '#multilingual')}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all duration-300 shadow-md flex items-center gap-1.5"
            title="Switch Language / भाषा बदलें"
          >
            <Globe className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] font-bold">Languages</span>
          </a>

          {/* Emergency SOS Quick Button */}
          <a
            href="#emergency"
            onClick={(e) => scrollToSection(e, '#emergency')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-500/10 group"
          >
            <Activity className="w-4 h-4 animate-spin text-rose-500 group-hover:text-white" />
            <span>AI Emergency SOS</span>
          </a>

          {/* Consultation Button */}
          <a
            href="#voice-doctor"
            onClick={(e) => scrollToSection(e, '#voice-doctor')}
            className="relative group overflow-hidden rounded-xl p-[1px] font-medium text-xs shadow-lg shadow-cyan-500/20"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 rounded-xl group-hover:scale-105 transition-transform duration-300" />
            <span className="relative flex items-center gap-2 px-4 py-2.5 bg-slate-950 rounded-[11px] text-white group-hover:bg-opacity-0 transition-all">
              <Cpu className="w-4 h-4 text-cyan-400 group-hover:text-white" />
              <span>Launch AI Clinic</span>
            </span>
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-3 pb-6 bg-slate-950/95 border-b border-slate-800 backdrop-blur-xl animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-cyan-400 rounded-lg hover:bg-slate-900 transition-all"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
              <a
                href="#emergency"
                onClick={(e) => scrollToSection(e, '#emergency')}
                className="w-full text-center px-4 py-2.5 text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-xl"
              >
                AI Emergency SOS
              </a>
              <a
                href="#voice-doctor"
                onClick={(e) => scrollToSection(e, '#voice-doctor')}
                className="w-full text-center px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl"
              >
                Start AI Voice Consultation
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
