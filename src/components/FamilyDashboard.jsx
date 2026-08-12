import React, { useState, useEffect } from 'react';
import {
  Users, Heart, ShieldCheck, Activity, Plus, Sparkles,
  CheckCircle2, AlertCircle, RefreshCw
} from 'lucide-react';
import { patientApi } from '../api/api';
import { mockData } from '../data/mockData';

export const FamilyDashboard = () => {
  const [patients, setPatients]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    patientApi.getAll()
      .then(data => {
        const list = data.patients || [];
        if (list.length > 0) {
          setPatients(list);
          setSelectedMember(list[0]);
        } else {
          // No patients in DB yet — show mock data so UI isn't empty
          setPatients(mockData.familyMembers);
          setSelectedMember(mockData.familyMembers[0]);
        }
      })
      .catch(() => {
        // API not reachable (not logged in or backend down) — use mock
        setPatients(mockData.familyMembers);
        setSelectedMember(mockData.familyMembers[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Normalise fields — real Patient model uses different keys than mockData
  const field = (member, key, fallback = '—') => {
    if (!member) return fallback;
    const map = {
      id:               member._id        || member.id,
      name:             member.name,
      relation:         member.relation   || 'Patient',
      age:              member.age,
      bloodType:        member.bloodGroup || member.bloodType || '—',
      healthScore:      member.healthScore ?? 80,
      vaccination:      member.vaccination|| 'Unknown',
      lastCheckup:      member.lastCheckup|| 'Not recorded',
      chronicCondition: member.chronicCondition
                        || (member.medicalHistory?.join(', ')) || 'None',
    };
    return map[key] ?? fallback;
  };

  if (loading) {
    return (
      <section id="family" className="py-24 relative overflow-hidden">
        <div className="flex items-center justify-center py-16 gap-3 text-slate-400 text-sm">
          <RefreshCw className="w-5 h-5 animate-spin" />
          Loading family health data…
        </div>
      </section>
    );
  }

  return (
    <section id="family" className="py-24 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs font-bold text-purple-400 mb-4">
            <Users className="w-4 h-4" />
            <span>Interactive Module 6</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Family Health &amp; AI Twin Dashboard
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Manage your entire rural household's digital health profiles, vaccination history, and predictive risk trends in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">

          {/* Left Column: Member Selector Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Household Members ({patients.length})
              </h3>
              <button
                onClick={() => alert('Add Family Member Modal Opened')}
                className="px-3 py-1.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-semibold hover:bg-cyan-500 hover:text-white transition-all flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Member</span>
              </button>
            </div>

            {patients.map((member) => (
              <div
                key={field(member, 'id')}
                onClick={() => setSelectedMember(member)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  field(selectedMember, 'id') === field(member, 'id')
                    ? 'bg-slate-900 border-cyan-500 shadow-xl shadow-cyan-500/10'
                    : 'glass-card border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
                      {field(member, 'name').charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{field(member, 'name')}</h4>
                      <p className="text-xs text-slate-400">
                        {field(member, 'relation')} • {field(member, 'age')} Yrs
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold">
                    Score: {field(member, 'healthScore')}/100
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60 font-mono">
                  <span>Blood: <strong className="text-white">{field(member, 'bloodType')}</strong></span>
                  <span>Vaccine: <strong className="text-emerald-400">{field(member, 'vaccination')}</strong></span>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: AI Twin Detailed Profile */}
          <div className="lg:col-span-7 rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800 space-y-6">

            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  AI Digital Health Twin Profile
                </h3>
                <p className="text-xs text-slate-400">
                  Patient ID: {field(selectedMember, 'id')}
                </p>
              </div>
              <span className="px-3 py-1 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl text-xs font-mono">
                Synced with ABHA ID
              </span>
            </div>

            {/* Health Meter Progress */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">Overall Wellness Score</span>
                <span className="font-extrabold text-cyan-400 text-sm">
                  {field(selectedMember, 'healthScore')}% Optimal
                </span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${field(selectedMember, 'healthScore')}%` }}
                />
              </div>
            </div>

            {/* Vitals Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 font-semibold uppercase">Blood Group</span>
                <p className="text-base font-extrabold text-white">{field(selectedMember, 'bloodType')}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 font-semibold uppercase">Chronic Condition</span>
                <p className="text-base font-extrabold text-amber-300">{field(selectedMember, 'chronicCondition')}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 font-semibold uppercase">Last AI Checkup</span>
                <p className="text-base font-extrabold text-cyan-300">{field(selectedMember, 'lastCheckup')}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 font-semibold uppercase">Vaccination Status</span>
                <p className="text-base font-extrabold text-emerald-400">{field(selectedMember, 'vaccination')}</p>
              </div>
            </div>

            {/* AI Predictive Insight */}
            <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-1">
                  AI Health Twin Predictive Recommendation
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Based on age ({field(selectedMember, 'age')} Yrs) and chronic history, routine blood pressure
                  monitoring is recommended every 14 days. Next influenza booster scheduled for October.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
