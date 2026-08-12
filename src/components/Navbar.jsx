import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, Sun, Moon, Sparkles, Menu, X, Shield, Activity, PhoneCall, Globe, Cpu,
  Languages, ChevronDown, Check, MapPin
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useGeoLang } from '../context/GeoLangContext';

/* ── Full language list for the navbar picker ── */
const ALL_LANGUAGES = [
  { code: 'hi', native: 'हिंदी',    name: 'Hindi',     flag: '🇮🇳' },
  { code: 'mr', native: 'मराठी',    name: 'Marathi',   flag: '🇮🇳' },
  { code: 'gu', native: 'ગુજરાતી', name: 'Gujarati',  flag: '🇮🇳' },
  { code: 'pa', native: 'ਪੰਜਾਬੀ',  name: 'Punjabi',   flag: '🇮🇳' },
  { code: 'ta', native: 'தமிழ்',   name: 'Tamil',     flag: '🇮🇳' },
  { code: 'te', native: 'తెలుగు',  name: 'Telugu',    flag: '🇮🇳' },
  { code: 'kn', native: 'ಕನ್ನಡ',   name: 'Kannada',   flag: '🇮🇳' },
  { code: 'ml', native: 'മലയാളം',  name: 'Malayalam', flag: '🇮🇳' },
  { code: 'bn', native: 'বাংলা',    name: 'Bengali',   flag: '🇮🇳' },
  { code: 'en', native: 'English',  name: 'English',   flag: '🇺🇸' },
  { code: 'fr', native: 'Français', name: 'French',    flag: '🇫🇷' },
  { code: 'de', native: 'Deutsch',  name: 'German',    flag: '🇩🇪' },
  { code: 'es', native: 'Español',  name: 'Spanish',   flag: '🇪🇸' },
  { code: 'ja', native: '日本語',    name: 'Japanese',  flag: '🇯🇵' },
  { code: 'zh', native: '中文',      name: 'Chinese',   flag: '🇨🇳' },
  { code: 'ru', native: 'Русский',  name: 'Russian',   flag: '🇷🇺' },
  { code: 'ar', native: 'العربية',  name: 'Arabic',    flag: '🇸🇦' },
];

/* ── Inline language dropdown component ── */
function NavLangSwitcher() {
  const { activeLang, setLanguageManually } = useGeoLang();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = ALL_LANGUAGES.find(l => l.code === activeLang.code) || ALL_LANGUAGES[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 text-slate-300 hover:text-purple-300 transition-all duration-200 text-xs font-semibold shadow-md"
        title="Switch Language"
      >
        <span className="text-sm leading-none">{current.flag}</span>
        <span className="hidden sm:inline text-[11px]">{current.native}</span>
        <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-slate-900/98 border border-slate-700/80 rounded-2xl shadow-2xl shadow-slate-950/60 z-[60] overflow-hidden"
          style={{ backdropFilter: 'blur(16px)' }}>
          {/* Header */}
          <div className="px-3 py-2.5 border-b border-slate-800 flex items-center gap-2">
            <Languages className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Language</span>
          </div>
          <div className="max-h-72 overflow-y-auto py-1">
            {ALL_LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => { setLanguageManually(lang.code); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors hover:bg-slate-800/60
                  ${activeLang.code === lang.code ? 'text-purple-300 bg-purple-500/10' : 'text-slate-300'}`}
              >
                <span className="text-sm leading-none w-5 text-center">{lang.flag}</span>
                <span className="font-semibold flex-1 text-left">{lang.native}</span>
                <span className="text-slate-600 text-[10px]">{lang.name}</span>
                {activeLang.code === lang.code && (
                  <Check className="w-3 h-3 text-purple-400 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export const Navbar = ({ darkMode, setDarkMode, activeSection, setActiveSection }) => {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.home', 'Home'),              href: '#hero' },
    { name: t('nav.aiClinic', 'AI Clinic'),     href: '#ai-clinic' },
    { name: t('nav.voiceDoctor', 'Voice Dr.'),  href: '#voice-doctor' },
    { name: t('nav.languages', 'AI Languages'), href: '#multilingual' },
    { name: t('nav.iotVitals', 'IoT Vitals'),   href: '#iot-sensors' },
    { name: t('nav.emergency', 'Emergency'),    href: '#emergency' },
    { name: t('nav.ocr', 'Medical OCR'),        href: '#ocr' },
    { name: t('nav.disease', 'Disease AI'),     href: '#analytics' },
    { name: t('nav.doctors', 'Doctors'),        href: '#doctors' },
    { name: t('nav.offline', 'Offline'),        href: '#offline' },
    { name: t('nav.faq', 'FAQ'),                href: '#faq' },
  ];

  const scrollToSection = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
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
            {t('nav.doctors', 'Doctors')}
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all duration-300 shadow-md"
            title="Toggle Dark / Light Mode"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* 🌍 Live Language Switcher */}
          <NavLangSwitcher />

          {/* Emergency SOS Quick Button */}
          <a
            href="#emergency"
            onClick={(e) => scrollToSection(e, '#emergency')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-500/10 group"
          >
            <Activity className="w-4 h-4 animate-spin text-rose-500 group-hover:text-white" />
            <span>{t('nav.emergencySOS', 'AI Emergency SOS')}</span>
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
              <span>{t('nav.launchClinic', 'Launch AI Clinic')}</span>
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
          {/* Mobile lang switcher (compact) */}
          <NavLangSwitcher />
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
                {t('nav.emergencySOS', 'AI Emergency SOS')}
              </a>
              <a
                href="#voice-doctor"
                onClick={(e) => scrollToSection(e, '#voice-doctor')}
                className="w-full text-center px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl"
              >
                {t('nav.launchClinic', 'Start AI Voice Consultation')}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
