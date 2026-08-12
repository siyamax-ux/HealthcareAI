import React from 'react';
import { Heart, ArrowUp, Sparkles, Globe, Shield } from 'lucide-react';
import { FaLinkedin, FaTwitter, FaGithub, FaFacebook } from 'react-icons/fa';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-12 relative overflow-hidden text-slate-400 text-xs">
      
      {/* Mesh glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-t from-cyan-500/5 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-900">
          
          {/* Col 1 */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1.5px]">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Heart className="w-5 h-5 text-cyan-400 fill-cyan-400/20" />
                </div>
              </div>
              <span className="text-lg font-bold text-white tracking-tight">GramSwasthya AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering rural communities with intelligent clinical assistance, emergency triage, and tele-doctor connectivity.
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Platform Navigation</h4>
            <ul className="space-y-2">
              <li><a href="#hero" className="hover:text-cyan-400 transition-colors">Home Landing Page</a></li>
              <li><a href="#ai-clinic" className="hover:text-cyan-400 transition-colors">AI Virtual Clinic</a></li>
              <li><a href="#voice-doctor" className="hover:text-cyan-400 transition-colors">Hindi Voice Doctor</a></li>
              <li><a href="#emergency" className="hover:text-cyan-400 transition-colors">Emergency Risk Detection</a></li>
              <li><a href="#ocr" className="hover:text-cyan-400 transition-colors">Medical OCR Scanner</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Rural Health Modules</h4>
            <ul className="space-y-2">
              <li><a href="#analytics" className="hover:text-cyan-400 transition-colors">Outbreak Disease Analytics</a></li>
              <li><a href="#family" className="hover:text-cyan-400 transition-colors">Family AI Twin Profile</a></li>
              <li><a href="#doctors" className="hover:text-cyan-400 transition-colors">Remote Tele-Doctors</a></li>
              <li><a href="#offline" className="hover:text-cyan-400 transition-colors">Offline Data Auto-Sync</a></li>
              <li><a href="#faq" className="hover:text-cyan-400 transition-colors">FAQ & Support</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-1">Social Networks</h4>
            <div className="flex gap-2">
              <a href="#" className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all">
                <FaLinkedin className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all">
                <FaGithub className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all">
                <FaTwitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all">
                <FaFacebook className="w-4 h-4" />
              </a>
            </div>
            <p className="text-[11px] text-slate-500">
              Designed for Hackathons & Rural Innovation initiatives.
            </p>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 GramSwasthya AI Platform. All rights reserved.</p>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all shadow-md flex items-center gap-1.5 font-semibold text-xs"
          >
            <span>Back To Top</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
};
