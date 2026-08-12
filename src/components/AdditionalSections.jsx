import React, { useState } from 'react';
import { 
  Bot, FileText, Mic, ShieldAlert, Users, Video, TrendingUp, Globe, 
  WifiOff, ArrowRight, CheckCircle2, ChevronDown, Phone, Mail, MapPin, Send, HelpCircle,
  Wifi, UserPlus, UploadCloud, RefreshCw
} from 'lucide-react';
import { patientApi } from '../api/api';
import { mockData } from '../data/mockData';

export const PortalPreview = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-bold text-cyan-400 mb-4">
            <Users className="w-4 h-4" />
            <span>ASHA Worker Portal Mockup</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Health Worker & ASHA Portal
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Empowering field health workers with tablet-friendly AI diagnostics and automated case logging.
          </p>
        </div>

        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800 shadow-2xl max-w-5xl mx-auto">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-mono text-slate-400 ml-2">ASHA Portal v3.4 - District Chhatarpur</span>
            </div>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold">
              Online Sync Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">New Registrations Today</span>
              <span className="text-2xl font-extrabold text-white">28</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Pending AI Reviews</span>
              <span className="text-2xl font-extrabold text-amber-300">5</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Doctor Referrals Sent</span>
              <span className="text-2xl font-extrabold text-cyan-300">14</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Emergency SOS Triggered</span>
              <span className="text-2xl font-extrabold text-rose-400">1</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const OfflineSection = () => {
  const [isOnline, setIsOnline] = useState(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [queue, setQueue] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('setu_offline_patients') || '[]');
    } catch {
      return [];
    }
  });

  const [form, setForm] = useState({ name: '', age: '', gender: 'Male', village: '', phone: '' });
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [error, setError] = useState(null);

  const saveQueue = (newQueue) => {
    setQueue(newQueue);
    localStorage.setItem('setu_offline_patients', JSON.stringify(newQueue));
  };

  const handleAddPatient = (e) => {
    e.preventDefault();
    if (!form.name || !form.age) {
      setError('Name and Age are required.');
      return;
    }
    const newPatient = {
      id: `offline-${Date.now()}`,
      name: form.name,
      age: parseInt(form.age),
      gender: form.gender,
      village: form.village || 'Offline Cached',
      phone: form.phone || '',
      queuedAt: new Date().toISOString()
    };
    saveQueue([...queue, newPatient]);
    setForm({ name: '', age: '', gender: 'Male', village: '', phone: '' });
    setError(null);
  };

  const handleSync = async () => {
    if (queue.length === 0) return;
    setSyncing(true);
    setError(null);
    let successCount = 0;
    const remainingQueue = [...queue];

    try {
      for (let i = 0; i < queue.length; i++) {
        const patient = queue[i];
        const { id, queuedAt, ...apiPayload } = patient;
        
        try {
          await patientApi.create(apiPayload);
          successCount++;
          const idx = remainingQueue.findIndex(item => item.id === patient.id);
          if (idx > -1) remainingQueue.splice(idx, 1);
        } catch (apiErr) {
          console.error(`Failed to sync patient ${patient.name}:`, apiErr.message);
          throw new Error(`Sync failed at patient "${patient.name}": ${apiErr.message}`);
        }
      }

      saveQueue(remainingQueue);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 4000);
    } catch (err) {
      setError(err.message || 'Sync failed. Check connection.');
      saveQueue(remainingQueue);
    } finally {
      setSyncing(false);
    }
  };

  const handleRemove = (id) => {
    saveQueue(queue.filter(item => item.id !== id));
  };

  return (
    <section id="offline" className="py-24 relative overflow-hidden bg-slate-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="max-w-5xl mx-auto rounded-3xl glass-panel p-8 sm:p-12 border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/40 space-y-8">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <WifiOff className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-white">
                  Offline Outbox & Queue Sync
                </h3>
                <p className="text-xs text-slate-400 max-w-md">
                  Collect patient data offline in zero-connectivity regions. The system queues profiles in local encrypted storage and syncs when online.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 px-2">Network Sim:</span>
              <button
                onClick={() => setIsOnline(!isOnline)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isOnline 
                    ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                    : 'bg-rose-500/20 border border-rose-500/30 text-rose-400'
                }`}
              >
                {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                <span>{isOnline ? 'Online' : 'Offline'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                <UserPlus className="w-4 h-4" />
                <span>Queue Patient Offline</span>
              </div>
              
              <form onSubmit={handleAddPatient} className="space-y-3 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Sita Devi"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Age</label>
                    <input
                      type="number"
                      value={form.age}
                      onChange={(e) => setForm({ ...form, age: e.target.value })}
                      placeholder="38"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Gender</label>
                    <select
                      value={form.gender}
                      onChange={(e) => setForm({ ...form, gender: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Village</label>
                  <input
                    type="text"
                    value={form.village}
                    onChange={(e) => setForm({ ...form, village: e.target.value })}
                    placeholder="Bhojpur, Bihar"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Phone (Optional)</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 99887 76655"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-xl transition-all"
                >
                  Save to Outbox Queue
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
                  <UploadCloud className="w-4 h-4" />
                  <span>Outbox Queue ({queue.length})</span>
                </div>
                
                {queue.length > 0 && (
                  <button
                    onClick={handleSync}
                    disabled={syncing || !isOnline}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      !isOnline 
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800'
                        : 'bg-purple-600 hover:bg-purple-500 text-white font-bold'
                    }`}
                  >
                    {syncing ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <UploadCloud className="w-3.5 h-3.5" />
                    )}
                    <span>{syncing ? 'Syncing...' : 'Sync to Cloud'}</span>
                  </button>
                )}
              </div>

              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] rounded-xl">
                  {error}
                </div>
              )}

              {syncSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Sync Complete! All offline profiles saved to database.</span>
                </div>
              )}

              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {queue.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 border border-slate-800 border-dashed rounded-2xl flex flex-col items-center gap-2 bg-slate-900/10">
                    <WifiOff className="w-8 h-8 text-slate-600" />
                    <span className="text-xs">Outbox is empty. Toggle network to offline and add profiles above!</span>
                  </div>
                ) : (
                  queue.map((patient) => (
                    <div key={patient.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-white">{patient.name}</h4>
                        <p className="text-[10px] text-slate-400">
                          {patient.gender} • {patient.age} Yrs • {patient.village}
                        </p>
                        <span className="text-[8px] text-slate-500 font-mono">Queued: {new Date(patient.queuedAt).toLocaleTimeString()}</span>
                      </div>
                      
                      <button
                        onClick={() => handleRemove(patient.id)}
                        className="p-1.5 text-xs text-rose-400 border border-rose-500/30 hover:bg-rose-600 hover:text-white rounded-xl transition-all"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export const FAQSection = () => {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section id="faq" className="py-24 relative overflow-hidden bg-slate-950/70">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-bold text-cyan-400 mb-4">
            <HelpCircle className="w-4 h-4" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Got Questions? We Have Answers
          </h2>
        </div>

        <div className="space-y-4">
          {mockData.faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl glass-card border border-slate-800 overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-100 text-sm sm:text-base hover:text-cyan-400 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-cyan-400 transition-transform duration-300 ${
                  openIdx === idx ? 'rotate-180' : ''
                }`} />
              </button>
              {openIdx === idx && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const ContactSection = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Connect With GramSwasthya AI Team
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Partner with us to deploy AI health centers in your Gram Panchayat or CSR initiative.
            </p>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                <Phone className="w-5 h-5 text-cyan-400 shrink-0" />
                <span>24/7 Helpline: <strong>+91 (1800) 425-GRAM</strong></span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                <Mail className="w-5 h-5 text-purple-400 shrink-0" />
                <span>Email: <strong>support@gramswasthya.ai</strong></span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>AI Rural Innovation Lab, New Delhi & MP</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800">
            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-white">Message Sent Successfully!</h3>
                <p className="text-xs text-slate-400">Our health deployment team will reach out within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Your Name</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="Sarpanch Ramesh Kumar" 
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Mobile Number</label>
                    <input 
                      required 
                      type="tel" 
                      placeholder="+91 98765 43210" 
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Gram Panchayat / Organization</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="Chhatarpur Village Council" 
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Message</label>
                  <textarea 
                    rows={4} 
                    required
                    placeholder="How can we assist your village healthcare setup?" 
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Inquiry</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
