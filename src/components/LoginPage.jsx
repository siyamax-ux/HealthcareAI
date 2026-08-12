import React, { useState } from 'react';
import {
  Heart, Eye, EyeOff, User, Stethoscope, ShieldPlus,
  Mail, Lock, Phone, MapPin, ArrowRight, Sparkles,
  RefreshCw, CheckCircle2, AlertCircle, UserPlus, LogIn,
  Cpu, Activity, Globe,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/* ─── Role definitions ────────────────────────────────────── */
const ROLES = [
  {
    key: 'patient',
    label: 'Patient',
    nativeLabel: 'मरीज़ / Patient',
    icon: User,
    color: 'cyan',
    gradient: 'from-cyan-500 to-blue-600',
    border: 'border-cyan-500',
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    ring: 'ring-cyan-500/40',
    desc: 'Access your health records, book consultations and track vitals.',
    demoEmail: 'patient@demo.com',
    demoPass: 'demo1234',
  },
  {
    key: 'doctor',
    label: 'Doctor',
    nativeLabel: 'डॉक्टर / Doctor',
    icon: Stethoscope,
    color: 'purple',
    gradient: 'from-purple-500 to-indigo-600',
    border: 'border-purple-500',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    ring: 'ring-purple-500/40',
    desc: 'Manage patient queue, tele-consultations and AI clinical notes.',
    demoEmail: 'doctor@demo.com',
    demoPass: 'demo1234',
  },
  {
    key: 'healthworker',
    label: 'Health Worker',
    nativeLabel: 'स्वास्थ्य कार्यकर्ता',
    icon: ShieldPlus,
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-600',
    border: 'border-emerald-500',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    ring: 'ring-emerald-500/40',
    desc: 'Field data collection, village health camps and OCR scanning.',
    demoEmail: 'worker@demo.com',
    demoPass: 'demo1234',
  },
];

/* ─── Animated background orbs ───────────────────────────── */
function BgOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <div className="absolute -top-40 -left-40 w-[480px] h-[480px] rounded-full bg-cyan-600/10 blur-[120px] animate-pulse" />
      <div className="absolute top-1/3 -right-32 w-[400px] h-[400px] rounded-full bg-purple-600/10 blur-[100px]" style={{ animationDelay: '2s', animation: 'pulse 4s ease-in-out infinite' }} />
      <div className="absolute -bottom-32 left-1/3 w-[360px] h-[360px] rounded-full bg-emerald-600/8 blur-[90px]" style={{ animation: 'pulse 5s ease-in-out infinite' }} />
    </div>
  );
}

/* ─── Input field ─────────────────────────────────────────── */
function Field({ label, icon: Icon, type = 'text', value, onChange, placeholder, required, color = 'cyan', children }) {
  const focusRing = `focus:ring-2 focus:ring-${color}-500/40 focus:border-${color}-500/60`;
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-400 mb-1.5">{label}</label>
      <div className="relative">
        {Icon && <Icon className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-${color}-400/70`} />}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full ${Icon ? 'pl-9' : 'pl-3'} pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-600 outline-none ${focusRing} transition-all`}
        />
        {children}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LOGIN FORM
═══════════════════════════════════════════════════════════ */
function LoginForm({ role, onSwitch }) {
  const { login, demoLogin, authLoading, authError, setAuthError } = useAuth();
  const [email, setEmail]     = useState('');
  const [password, setPass]   = useState('');
  const [showPass, setShowPass] = useState(false);

  const Icon = role.icon;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch { /* error shown via authError */ }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email */}
      <Field label="Email Address" icon={Mail} type="email" value={email}
        onChange={e => { setEmail(e.target.value); setAuthError(null); }}
        placeholder={role.demoEmail} required color={role.color}
      />

      {/* Password */}
      <Field label="Password" icon={Lock} type={showPass ? 'text' : 'password'} value={password}
        onChange={e => { setPass(e.target.value); setAuthError(null); }}
        placeholder="••••••••" required color={role.color}
      >
        <button
          type="button"
          onClick={() => setShowPass(v => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
        >
          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </Field>

      {/* Error */}
      {authError && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          {authError}
        </div>
      )}

      {/* Forgot */}
      <div className="text-right">
        <button type="button" className={`text-xs ${role.text} hover:underline`}>Forgot password?</button>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={authLoading}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r ${role.gradient} text-white font-bold text-sm shadow-lg hover:opacity-90 disabled:opacity-50 transition-all`}
      >
        {authLoading
          ? <RefreshCw className="w-4 h-4 animate-spin" />
          : <LogIn className="w-4 h-4" />
        }
        Sign In as {role.label}
      </button>

      {/* Demo login */}
      <button
        type="button"
        onClick={() => demoLogin(role.key)}
        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border ${role.border} ${role.bg} ${role.text} text-xs font-semibold hover:opacity-80 transition-all`}
      >
        <Sparkles className="w-3.5 h-3.5" />
        Try Demo — {role.label} Account
      </button>

      <p className="text-center text-xs text-slate-500">
        New to SetuHealth?{' '}
        <button type="button" onClick={onSwitch} className={`${role.text} font-semibold hover:underline`}>
          Create account
        </button>
      </p>
    </form>
  );
}

/* ═══════════════════════════════════════════════════════════
   REGISTER FORM
═══════════════════════════════════════════════════════════ */
function RegisterForm({ role, onSwitch }) {
  const { register, authLoading, authError, setAuthError } = useAuth();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', village: '', specialization: '',
  });
  const [showPass, setShowPass]   = useState(false);
  const [success, setSuccess]     = useState(false);

  const set = (key) => (e) => {
    setAuthError(null);
    setForm(f => ({ ...f, [key]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }
    try {
      await register({ ...form, role: role.key });
      setSuccess(true);
    } catch { /* error shown via authError */ }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${role.gradient} flex items-center justify-center shadow-2xl`}>
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-bold text-white">Account Created!</h3>
        <p className="text-sm text-slate-400">Welcome to SetuHealth AI, <strong className="text-white">{form.name}</strong>.<br />You are now logged in as a <span className={role.text}>{role.label}</span>.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      {/* Full name */}
      <Field label="Full Name" icon={User} value={form.name} onChange={set('name')}
        placeholder="Ramsevak Kumar" required color={role.color}
      />

      {/* Email */}
      <Field label="Email Address" icon={Mail} type="email" value={form.email} onChange={set('email')}
        placeholder={role.demoEmail} required color={role.color}
      />

      {/* Phone */}
      <Field label="Mobile Number" icon={Phone} type="tel" value={form.phone} onChange={set('phone')}
        placeholder="+91 98765 43210" color={role.color}
      />

      {/* Role-specific field */}
      {role.key === 'doctor' && (
        <Field label="Specialization" icon={Stethoscope} value={form.specialization} onChange={set('specialization')}
          placeholder="General Physician" color={role.color}
        />
      )}
      {(role.key === 'patient' || role.key === 'healthworker') && (
        <Field label="Village / District" icon={MapPin} value={form.village} onChange={set('village')}
          placeholder="Sonbhadra, Uttar Pradesh" color={role.color}
        />
      )}

      {/* Password */}
      <Field label="Password" icon={Lock} type={showPass ? 'text' : 'password'} value={form.password} onChange={set('password')}
        placeholder="Min. 8 characters" required color={role.color}
      >
        <button type="button" onClick={() => setShowPass(v => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </Field>

      {/* Confirm password */}
      <Field label="Confirm Password" icon={Lock} type="password" value={form.confirmPassword} onChange={set('confirmPassword')}
        placeholder="Re-enter password" required color={role.color}
      />

      {/* Error */}
      {authError && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          {authError}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={authLoading}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r ${role.gradient} text-white font-bold text-sm shadow-lg hover:opacity-90 disabled:opacity-50 transition-all`}
      >
        {authLoading
          ? <RefreshCw className="w-4 h-4 animate-spin" />
          : <UserPlus className="w-4 h-4" />
        }
        Create {role.label} Account
      </button>

      <p className="text-center text-xs text-slate-500">
        Already have an account?{' '}
        <button type="button" onClick={onSwitch} className={`${role.text} font-semibold hover:underline`}>
          Sign in
        </button>
      </p>
    </form>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN LOGIN PAGE
═══════════════════════════════════════════════════════════ */
export function LoginPage() {
  const [activeRole, setActiveRole] = useState(0);   // index into ROLES
  const [formMode, setFormMode]     = useState('login'); // 'login' | 'register'
  const { setAuthError }            = useAuth();

  const role = ROLES[activeRole];

  const switchRole = (idx) => {
    setActiveRole(idx);
    setFormMode('login');
    setAuthError(null);
  };

  const switchMode = () => {
    setFormMode(m => m === 'login' ? 'register' : 'login');
    setAuthError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      <BgOrbs />

      {/* ── Header bar ── */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Heart className="w-5 h-5 text-white fill-white/20" />
          </div>
          <div>
            <span className="text-base font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-sky-200 to-cyan-400 leading-none">
              SetuHealthAI
            </span>
            <p className="text-[9px] text-slate-500 font-medium tracking-wide leading-none mt-0.5">Rural Health Empowerment</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-500">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>AI Systems Online</span>
        </div>
      </header>

      {/* ── Main layout ── */}
      <div className="relative z-10 flex flex-1 flex-col lg:flex-row">

        {/* ── Left panel — hero / info ── */}
        <div className="hidden lg:flex flex-col justify-between w-[44%] xl:w-[46%] p-10 xl:p-14 border-r border-slate-800/60">
          {/* Top content */}
          <div className="space-y-8 mt-8">
            <div>
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${role.bg} border ${role.border}/40 text-xs font-bold ${role.text} mb-5`}>
                <Cpu className="w-3.5 h-3.5" />
                AI-Powered · Multilingual · Rural
              </div>
              <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-4">
                Healthcare<br />
                <span className={`bg-clip-text text-transparent bg-gradient-to-r ${role.gradient}`}>
                  for Every Village
                </span>
              </h1>
              <p className="text-slate-400 text-base leading-relaxed">
                Instant AI diagnosis, tele-doctor consultations, emergency SOS and multilingual support — built for Bharat.
              </p>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { icon: Globe,     text: '17 Languages' },
                { icon: Activity,  text: '24/7 AI Doctor' },
                { icon: ShieldPlus,text: 'Emergency Ready' },
                { icon: Sparkles,  text: '2,450+ Villages' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-400`}>
                  <Icon className={`w-3.5 h-3.5 ${role.text}`} />
                  {text}
                </div>
              ))}
            </div>

            {/* Role cards */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Choose Your Portal</p>
              {ROLES.map((r, i) => {
                const RIcon = r.icon;
                return (
                  <button
                    key={r.key}
                    onClick={() => switchRole(i)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                      activeRole === i
                        ? `bg-gradient-to-r ${r.gradient} border-transparent shadow-lg shadow-${r.color}-500/20`
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${activeRole === i ? 'bg-white/20' : `${r.bg} border ${r.border}/30`}`}>
                      <RIcon className={`w-5 h-5 ${activeRole === i ? 'text-white' : r.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold ${activeRole === i ? 'text-white' : 'text-slate-200'}`}>{r.nativeLabel}</p>
                      <p className={`text-xs leading-tight mt-0.5 ${activeRole === i ? 'text-white/70' : 'text-slate-500'} truncate`}>{r.desc}</p>
                    </div>
                    {activeRole === i && (
                      <ArrowRight className="w-4 h-4 text-white/80 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom note */}
          <p className="text-[11px] text-slate-600">
            © 2026 SetuHealthAI · HIPAA-grade encryption · Powered by Google Gemini
          </p>
        </div>

        {/* ── Right panel — form ── */}
        <div className="flex-1 flex items-center justify-center px-4 py-8 sm:px-8">
          <div className="w-full max-w-[420px]">

            {/* Mobile role switcher */}
            <div className="lg:hidden flex gap-2 mb-6 p-1 rounded-2xl bg-slate-900 border border-slate-800">
              {ROLES.map((r, i) => {
                const RIcon = r.icon;
                return (
                  <button
                    key={r.key}
                    onClick={() => switchRole(i)}
                    className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl text-[10px] font-bold transition-all ${
                      activeRole === i
                        ? `bg-gradient-to-b ${r.gradient} text-white shadow-md`
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <RIcon className="w-4 h-4" />
                    {r.label}
                  </button>
                );
              })}
            </div>

            {/* Card */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl overflow-hidden"
              style={{ backdropFilter: 'blur(24px)' }}>

              {/* Card header */}
              <div className={`px-6 pt-6 pb-5 bg-gradient-to-br from-${role.color}-900/30 to-slate-900/0 border-b border-slate-800/60`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${role.gradient} flex items-center justify-center shadow-lg shadow-${role.color}-500/30`}>
                    <role.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-white leading-none">
                      {formMode === 'login' ? 'Welcome back' : 'Join SetuHealth'}
                    </h2>
                    <p className={`text-xs ${role.text} font-semibold mt-0.5`}>{role.nativeLabel} Portal</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{role.desc}</p>
              </div>

              {/* Form body */}
              <div className="px-6 py-5">
                {formMode === 'login'
                  ? <LoginForm    role={role} onSwitch={switchMode} />
                  : <RegisterForm role={role} onSwitch={switchMode} />
                }
              </div>
            </div>

            {/* Bottom hint */}
            <p className="mt-5 text-center text-[11px] text-slate-600">
              By continuing you agree to our{' '}
              <span className={`${role.text} cursor-pointer hover:underline`}>Terms of Service</span>{' '}
              &amp; <span className={`${role.text} cursor-pointer hover:underline`}>Privacy Policy</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
