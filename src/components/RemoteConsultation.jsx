import React, { useState } from 'react';
import { 
  Video, Calendar, Star, Stethoscope, CheckCircle2, Clock, 
  MapPin, Phone, ShieldCheck, UserCheck 
} from 'lucide-react';
import { mockData } from '../data/mockData';

export const RemoteConsultation = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(mockData.doctors[0]);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleBook = () => {
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
    }, 4000);
  };

  return (
    <section id="doctors" className="py-24 relative overflow-hidden bg-slate-950/80">
      
      {/* Glow background */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-bold text-cyan-400 mb-4">
            <Video className="w-4 h-4" />
            <span>Interactive Module 7</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Remote Doctor Tele-Consultation
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Connect instantly with top urban specialist doctors via low-bandwidth video & voice links integrated with AI triage notes.
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {mockData.doctors.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setSelectedDoctor(doc)}
              className={`p-6 rounded-3xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                selectedDoctor.id === doc.id 
                  ? 'bg-slate-900 border-cyan-500 shadow-2xl shadow-cyan-500/20 scale-[1.02]' 
                  : 'glass-card border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Doctor Avatar */}
                <div className="relative mb-4">
                  <img 
                    src={doc.image} 
                    alt={doc.name} 
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-cyan-500/30 shadow-md"
                  />
                  <span className={`absolute top-2 right-2 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                    doc.status === 'online' 
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}>
                    {doc.availability}
                  </span>
                </div>

                {/* Details */}
                <h4 className="text-lg font-bold text-white mb-1">{doc.name}</h4>
                <p className="text-xs text-cyan-400 font-semibold mb-2">{doc.specialization}</p>

                <div className="space-y-1.5 text-xs text-slate-400 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{doc.rating}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{doc.experience}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {doc.languages.map((lang, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] rounded-md font-mono">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleBook}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Video className="w-4 h-4" />
                <span>Book Video Consultation</span>
              </button>
            </div>
          ))}
        </div>

        {/* Appointment Confirmation Toast */}
        {bookingSuccess && (
          <div className="max-w-md mx-auto p-4 rounded-2xl bg-emerald-500 text-white shadow-2xl flex items-center gap-3 animate-in fade-in duration-300">
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            <div>
              <p className="font-bold text-xs">Video Call Reserved!</p>
              <p className="text-[11px] opacity-90">Joining link and AI clinical report sent to patient phone.</p>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
