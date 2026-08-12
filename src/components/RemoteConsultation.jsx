import React, { useState, useEffect } from 'react';
import {
  Video, Star, Clock, CheckCircle2, RefreshCw, AlertCircle,
} from 'lucide-react';
import { doctorApi } from '../api/api';

export const RemoteConsultation = () => {
  const [doctors, setDoctors]             = useState([]);
  const [loading, setLoading]             = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [booking, setBooking]             = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError]   = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    doctorApi.getAll(controller.signal)
      .then(data => {
        const list = data.doctors || [];
        if (list.length > 0) {
          setDoctors(list);
          setSelectedDoctor(list[0]);
        }
        // empty list → fall through to demo data silently
      })
      .catch(() => {
        // Backend unavailable — demo doctors will be shown, no error shown to user
      })
      .finally(() => {
        clearTimeout(timeout);
        setLoading(false);
      });

    return () => { clearTimeout(timeout); controller.abort(); };
  }, []);

  const handleBook = async () => {
    if (!selectedDoctor) return;
    setBooking(true);
    setBookingError(null);

    try {
      // Schedule 24 hours from now as a sensible default
      const scheduledAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      await doctorApi.createAppointment({
        doctor: selectedDoctor._id,
        scheduledAt,
        reason: 'Video Consultation Request',
      });
      setBookingSuccess(true);
      setTimeout(() => setBookingSuccess(false), 4000);
    } catch (err) {
      setBookingError(err.message || 'Booking failed. Please try again.');
      setTimeout(() => setBookingError(null), 4000);
    } finally {
      setBooking(false);
    }
  };

  // Fallback demo doctors shown when API is unavailable / user not logged in
  const DEMO_DOCTORS = [
    {
      _id: 'demo-1',
      name: 'Dr. Rajesh Sharma',
      specialization: 'General Physician & AI Triage Specialist',
      experience: '14 Yrs Exp',
      rating: '4.9 (320+ consultations)',
      languages: ['Hindi', 'English', 'Bhojpuri'],
      availability: 'Available Now',
      isActive: true,
      image: 'https://randomuser.me/api/portraits/men/75.jpg',
    },
    {
      _id: 'demo-2',
      name: 'Dr. Ananya Patel',
      specialization: 'Pediatrician & Rural Health Lead',
      experience: '10 Yrs Exp',
      rating: '4.95 (410+ consultations)',
      languages: ['Hindi', 'Gujarati', 'English'],
      availability: 'In 15 Mins',
      isActive: false,
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      _id: 'demo-3',
      name: 'Dr. Vikram Sethi',
      specialization: 'Cardiologist & Emergency Care',
      experience: '18 Yrs Exp',
      rating: '4.88 (500+ consultations)',
      languages: ['Hindi', 'Punjabi', 'English'],
      availability: 'Available Today',
      isActive: true,
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
  ];

  const displayDoctors = (!loading && doctors.length === 0) ? DEMO_DOCTORS : doctors;

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
            Connect instantly with top urban specialist doctors via low-bandwidth video &amp; voice links integrated with AI triage notes.
          </p>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="flex items-center justify-center py-16 gap-3 text-slate-400 text-sm">
            <RefreshCw className="w-5 h-5 animate-spin" />
            Loading doctors…
          </div>
        )}

        {/* Doctors Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            {displayDoctors.map((doc) => (
              <div
                key={doc._id}
                onClick={() => setSelectedDoctor(doc)}
                className={`p-6 rounded-3xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  selectedDoctor?._id === doc._id
                    ? 'bg-slate-900 border-cyan-500 shadow-2xl shadow-cyan-500/20 scale-[1.02]'
                    : 'glass-card border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Doctor Avatar */}
                  <div className="relative mb-4">
                    <img
                      src={doc.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&size=200&background=0e7490&color=ffffff&bold=true`}
                      alt={doc.name}
                      className="w-24 h-24 rounded-2xl object-cover border-2 border-cyan-500/30 shadow-md bg-slate-800"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&size=200&background=0e7490&color=ffffff&bold=true&rounded=false`;
                      }}
                    />
                    <span className={`absolute top-2 right-2 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      doc.isActive
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}>
                      {doc.availability || (doc.isActive ? 'Available' : 'Busy')}
                    </span>
                  </div>

                  {/* Details */}
                  <h4 className="text-lg font-bold text-white mb-1">{doc.name}</h4>
                  <p className="text-xs text-cyan-400 font-semibold mb-2">
                    {doc.specialization || doc.role || 'Doctor'}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-400 mb-4">
                    {doc.rating && (
                      <div className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>{doc.rating}</span>
                      </div>
                    )}
                    {doc.experience && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{doc.experience}</span>
                      </div>
                    )}
                    {doc.languages && doc.languages.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {doc.languages.map((lang, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] rounded-md font-mono">
                            {lang}
                          </span>
                        ))}
                      </div>
                    )}
                    {doc.village && (
                      <p className="text-[10px] text-slate-500 mt-1">📍 {doc.village}</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedDoctor(doc); handleBook(); }}
                  disabled={booking}
                  className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {booking && selectedDoctor?._id === doc._id
                    ? <RefreshCw className="w-4 h-4 animate-spin" />
                    : <Video className="w-4 h-4" />
                  }
                  <span>Book Video Consultation</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Success Toast */}
        {bookingSuccess && (
          <div className="max-w-md mx-auto p-4 rounded-2xl bg-emerald-500 text-white shadow-2xl flex items-center gap-3 animate-in fade-in duration-300">
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            <div>
              <p className="font-bold text-xs">Video Call Reserved!</p>
              <p className="text-[11px] opacity-90">Joining link and AI clinical report sent to patient phone.</p>
            </div>
          </div>
        )}

        {/* Error Toast */}
        {bookingError && (
          <div className="max-w-md mx-auto p-4 rounded-2xl bg-rose-600 text-white shadow-2xl flex items-center gap-3">
            <AlertCircle className="w-6 h-6 shrink-0" />
            <p className="text-xs font-semibold">{bookingError}</p>
          </div>
        )}

      </div>
    </section>
  );
};
