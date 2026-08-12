import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, Activity, Thermometer, ShieldAlert, Zap, AlertTriangle, 
  CheckCircle2, ArrowRight, PhoneCall, Stethoscope, RefreshCw,
  Cpu, Bluetooth, Wifi, WifiOff, MapPin, AlertCircle, Sparkles, 
  RotateCcw, Users, User, ArrowUpRight, Eye, Battery
} from 'lucide-react';

// Village Patients database for the ASHA Monitoring panel
const INITIAL_VILLAGE_PATIENTS = [
  {
    id: 'P-101',
    name: 'Ramsevak Kumar',
    age: 54,
    gender: 'Male',
    vitals: { heartRate: 74, bpSystolic: 122, bpDiastolic: 81, spo2: 98, temp: 98.4, glucose: 104, aqi: 48 },
    riskScore: 92, // 0-100 (Health Score)
    status: 'Healthy',
    location: '25.3216 N, 84.8123 E (Ward 2, Chhatarpur)',
    lastCheckup: '2 hours ago',
    avatar: '👨🏽‍🌾',
    medications: ['Aspirin 75mg (Daily)', 'Atorvastatin 10mg (Night)']
  },
  {
    id: 'P-102',
    name: 'Laxmi Devi',
    age: 68,
    gender: 'Female',
    vitals: { heartRate: 98, bpSystolic: 145, bpDiastolic: 92, spo2: 93, temp: 99.1, glucose: 156, aqi: 52 },
    riskScore: 72,
    status: 'Moderate Risk',
    location: '25.3228 N, 84.8142 E (Ward 2, Chhatarpur)',
    lastCheckup: '30 mins ago',
    avatar: '👵🏽',
    medications: ['Metformin 500mg (Post-meal)', 'Amlodipine 5mg (Morning)']
  },
  {
    id: 'P-103',
    name: 'Amit Kumar',
    age: 22,
    gender: 'Male',
    vitals: { heartRate: 68, bpSystolic: 118, bpDiastolic: 78, spo2: 99, temp: 98.6, glucose: 92, aqi: 42 },
    riskScore: 98,
    status: 'Optimal',
    location: '25.3204 N, 84.8115 E (Ward 1, Chhatarpur)',
    lastCheckup: 'Yesterday',
    avatar: '👨🏽‍🎓',
    medications: []
  },
  {
    id: 'P-104',
    name: 'Rajeshwar Prasad (Elderly)',
    age: 79,
    gender: 'Male',
    vitals: { heartRate: 115, bpSystolic: 168, bpDiastolic: 98, spo2: 89, temp: 100.8, glucose: 210, aqi: 65 },
    riskScore: 48,
    status: 'High Risk',
    location: '25.3235 N, 84.8190 E (Outskirts, Chhatarpur)',
    lastCheckup: 'Just now',
    avatar: '👴🏽',
    medications: ['Insulin Glargine 10U (Night)', 'Clopidogrel 75mg (Morning)', 'Ramipril 5mg (Daily)']
  }
];

export const IoTSensorMonitoring = () => {
  // Database state
  const [patients, setPatients] = useState(INITIAL_VILLAGE_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState('P-101');
  
  // Simulated IoT Device Connectivity toggles
  const [iotStatus, setIotStatus] = useState({
    esp32: true,
    arduino: false,
    smartwatch: true,
    pulseOx: true,
    bpMonitor: true,
    glucoseMeter: false
  });

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  // Active vital adjustment overrides (representing live IoT streams)
  const [heartRate, setHeartRate] = useState(selectedPatient.vitals.heartRate);
  const [bpSystolic, setBpSystolic] = useState(selectedPatient.vitals.bpSystolic);
  const [bpDiastolic, setBpDiastolic] = useState(selectedPatient.vitals.bpDiastolic);
  const [spo2, setSpo2] = useState(selectedPatient.vitals.spo2);
  const [temp, setTemp] = useState(selectedPatient.vitals.temp);
  const [glucose, setGlucose] = useState(selectedPatient.vitals.glucose);
  const [aqi, setAqi] = useState(selectedPatient.vitals.aqi);

  // Sync state variables when selected patient changes
  useEffect(() => {
    setHeartRate(selectedPatient.vitals.heartRate);
    setBpSystolic(selectedPatient.vitals.bpSystolic);
    setBpDiastolic(selectedPatient.vitals.bpDiastolic);
    setSpo2(selectedPatient.vitals.spo2);
    setTemp(selectedPatient.vitals.temp);
    setGlucose(selectedPatient.vitals.glucose);
    setAqi(selectedPatient.vitals.aqi);
  }, [selectedPatientId]);

  // Fall Detection Status state
  const [fallDetected, setFallDetected] = useState(false);
  const [showFallModal, setShowFallModal] = useState(false);

  // References for drawing live ECG and Pulse wave graphs
  const ecgCanvasRef = useRef(null);
  const pulseCanvasRef = useRef(null);

  // Real-Time Health Score and Status calculation
  const calculateAIHealthScore = () => {
    let penalty = 0;
    
    // SpO2 check
    if (spo2 < 95) penalty += (95 - spo2) * 5;
    if (spo2 < 90) penalty += 20; // Critical drop

    // Heart rate check
    if (heartRate > 100) penalty += (heartRate - 100) * 0.8;
    if (heartRate < 60) penalty += (60 - heartRate) * 1.2;
    if (heartRate === 0) penalty += 90; // Flatline

    // Blood Pressure check
    if (bpSystolic > 130) penalty += (bpSystolic - 130) * 0.5;
    if (bpSystolic > 160) penalty += 15;
    if (bpSystolic < 90) penalty += (90 - bpSystolic) * 0.8;

    // Temp check
    if (temp > 99) penalty += (temp - 99) * 8;
    if (temp < 95) penalty += (95 - temp) * 10;

    // Glucose check
    if (glucose > 140) penalty += (glucose - 140) * 0.15;
    if (glucose < 70) penalty += (70 - glucose) * 0.8;

    const score = Math.max(10, Math.min(100, Math.round(100 - penalty)));
    
    let status = 'Healthy';
    let colorClass = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score < 90) { status = 'Good'; colorClass = 'text-teal-400 border-teal-500/30 bg-teal-500/10'; }
    if (score < 80) { status = 'Moderate Risk'; colorClass = 'text-amber-400 border-amber-500/30 bg-amber-500/10'; }
    if (score < 70) { status = 'High Risk'; colorClass = 'text-orange-400 border-orange-500/30 bg-orange-500/10'; }
    if (score < 55) { status = 'Critical Crisis'; colorClass = 'text-red-400 border-red-500/40 bg-red-500/20 animate-pulse'; }

    return { score, status, colorClass };
  };

  const aiScore = calculateAIHealthScore();

  // Trigger emergency alert popup if critical thresholds breached
  useEffect(() => {
    if (spo2 < 90 || bpSystolic >= 180 || heartRate >= 140 || heartRate === 0) {
      // Auto-trigger safety alarm
      const triggerEvent = new CustomEvent('trigger-emergency', { 
        detail: { id: heartRate === 0 ? 'cpr' : 'heart-attack' } 
      });
      window.dispatchEvent(triggerEvent);
    }
  }, [spo2, bpSystolic, heartRate]);

  // Simulated Live ECG Monitor waveform drawing effect
  useEffect(() => {
    const canvas = ecgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationId;
    let points = [];
    const width = canvas.width;
    const height = canvas.height;
    
    // Fill initial flat points
    for (let i = 0; i < width; i++) {
      points.push(height / 2);
    }

    let cycle = 0;
    const draw = () => {
      // Clear
      ctx.fillStyle = '#020617'; // slate-950
      ctx.fillRect(0, 0, width, height);

      // Draw Grid
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)'; // Green grid lines
      ctx.lineWidth = 1;
      
      // Vertical grid lines
      for (let i = 0; i < width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      // Horizontal grid lines
      for (let i = 0; i < height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }

      // Calculate new y point based on cycle phase
      let nextY = height / 2;
      const bpm = heartRate || 0;
      
      if (bpm > 0) {
        // Calculate cycle rate. Standard 60 FPS.
        // Heartbeat spans roughly 30 frames for 120BPM, 60 frames for 60BPM
        const framesPerBeat = Math.round((60 * 60) / bpm);
        const mod = cycle % framesPerBeat;
        
        if (mod === 0) {
          // P Wave (gentle bump up)
          nextY = height / 2;
        } else if (mod === Math.round(framesPerBeat * 0.1)) {
          nextY = height / 2 - 4;
        } else if (mod === Math.round(framesPerBeat * 0.15)) {
          nextY = height / 2;
        } 
        // QRS Complex (sharp spike down, high spike up, sharp spike down)
        else if (mod === Math.round(framesPerBeat * 0.25)) {
          nextY = height / 2 + 8; // Q
        } else if (mod === Math.round(framesPerBeat * 0.28)) {
          nextY = height / 2 - 35; // R peak
        } else if (mod === Math.round(framesPerBeat * 0.32)) {
          nextY = height / 2 + 15; // S drop
        } else if (mod === Math.round(framesPerBeat * 0.35)) {
          nextY = height / 2;
        }
        // T Wave (medium bump up)
        else if (mod === Math.round(framesPerBeat * 0.5)) {
          nextY = height / 2 - 8;
        } else if (mod === Math.round(framesPerBeat * 0.55)) {
          nextY = height / 2 - 10;
        } else if (mod === Math.round(framesPerBeat * 0.6)) {
          nextY = height / 2;
        }
      }

      // Add noise occasionally
      if (Math.random() > 0.98) {
        nextY += (Math.random() - 0.5) * 4;
      }

      // Shift points
      points.push(nextY);
      points.shift();

      // Draw line
      ctx.strokeStyle = bpm === 0 ? '#ef4444' : '#10b981'; // Red for flatline, green for alive
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 4;
      ctx.shadowColor = bpm === 0 ? '#ef4444' : '#10b981';
      ctx.beginPath();
      
      for (let i = 0; i < points.length; i++) {
        if (i === 0) {
          ctx.moveTo(i, points[i]);
        } else {
          ctx.lineTo(i, points[i]);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // reset shadow

      cycle++;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [heartRate]);

  // Pulse Waveform simulator effect
  useEffect(() => {
    const canvas = pulseCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationId;
    let points = [];
    const width = canvas.width;
    const height = canvas.height;
    
    for (let i = 0; i < width; i++) {
      points.push(height - 10);
    }

    let cycle = 0;
    const draw = () => {
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      let nextY = height - 10;
      const bpm = heartRate || 0;
      
      if (bpm > 0) {
        const framesPerBeat = Math.round((60 * 60) / bpm);
        const mod = cycle % framesPerBeat;
        
        // Simulates typical dicrotic notch pulse wave shape
        if (mod < framesPerBeat * 0.4) {
          const t = mod / (framesPerBeat * 0.4);
          // Rise to peak (sin curve)
          nextY = height - 10 - Math.sin(t * Math.PI) * (height - 20);
        } else if (mod < framesPerBeat * 0.6) {
          // Notch
          const t = (mod - framesPerBeat * 0.4) / (framesPerBeat * 0.2);
          nextY = height - 15 - Math.sin(t * Math.PI) * 10;
        } else {
          // Decay
          nextY = height - 10;
        }
      }

      points.push(nextY);
      points.shift();

      ctx.strokeStyle = '#06b6d4'; // Cyan wave
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let i = 0; i < points.length; i++) {
        if (i === 0) {
          ctx.moveTo(i, points[i]);
        } else {
          ctx.lineTo(i, points[i]);
        }
      }
      ctx.stroke();

      cycle++;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationId);
  }, [heartRate]);

  // Fall Detection Simulator trigger
  const triggerFallSimulation = () => {
    setFallDetected(true);
    setShowFallModal(true);

    // Update patient status in main grid database list
    setPatients(prev => prev.map(p => {
      if (p.id === selectedPatientId) {
        return {
          ...p,
          status: 'Critical Crisis',
          riskScore: 25,
          vitals: { ...p.vitals, heartRate: 110, bpSystolic: 95, bpDiastolic: 60, spo2: 91 }
        };
      }
      return p;
    }));

    // Trigger local state updates
    setHeartRate(110);
    setBpSystolic(95);
    setBpDiastolic(60);
    setSpo2(91);

    // Fire window event to launch CPR Emergency Guide
    const triggerEvent = new CustomEvent('trigger-emergency', { 
      detail: { id: 'unconscious' } 
    });
    window.dispatchEvent(triggerEvent);
  };

  const resetFallStatus = () => {
    setFallDetected(false);
    setShowFallModal(false);

    // Reset patient in database list
    setPatients(prev => prev.map(p => {
      if (p.id === selectedPatientId) {
        const orig = INITIAL_VILLAGE_PATIENTS.find(op => op.id === selectedPatientId);
        return orig ? { ...orig } : p;
      }
      return p;
    }));

    // Reset local states
    const orig = INITIAL_VILLAGE_PATIENTS.find(op => op.id === selectedPatientId);
    if (orig) {
      setHeartRate(orig.vitals.heartRate);
      setBpSystolic(orig.vitals.bpSystolic);
      setBpDiastolic(orig.vitals.bpDiastolic);
      setSpo2(orig.vitals.spo2);
      setTemp(orig.vitals.temp);
    }
  };

  // IoT sensor device toggle handler
  const toggleDevice = (device) => {
    setIotStatus(prev => ({
      ...prev,
      [device]: !prev[device]
    }));
  };

  return (
    <section id="iot-sensors" className="py-24 relative overflow-hidden bg-slate-950/80">
      
      {/* Glow blobs */}
      <div className="absolute top-10 left-1/3 w-[450px] h-[450px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-bold text-cyan-400 mb-4">
            <Cpu className="w-4 h-4 animate-pulse" />
            <span>Interactive Module 8</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            AI-Powered Smart IoT Health Monitor
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Real-time biometric sensor visualizer, AI risk diagnostics engine, ECG rhythm plotting, and village health worker dashboard.
          </p>
        </div>

        {/* TOP STATUS BAR: IoT Device Integration Simulator */}
        <div className="p-5 rounded-2xl glass-card border border-slate-800/80 bg-slate-900/10 backdrop-blur-md mb-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                <Cpu className="w-5 h-5 animate-spin-slow" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-300 block uppercase tracking-wider">IoT Hardware Sync Hub</span>
                <p className="text-[10px] text-slate-500">Toggle simulated Arduino/ESP32 WiFi nodes and Bluetooth wearables.</p>
              </div>
            </div>

            {/* Simulated Toggles */}
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => toggleDevice('esp32')}
                className={`px-3 py-1.5 rounded-xl border text-[10px] font-extrabold flex items-center gap-1.5 transition-all ${
                  iotStatus.esp32 
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${iotStatus.esp32 ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
                <span>ESP32 (WiFi)</span>
              </button>
              <button 
                onClick={() => toggleDevice('arduino')}
                className={`px-3 py-1.5 rounded-xl border text-[10px] font-extrabold flex items-center gap-1.5 transition-all ${
                  iotStatus.arduino 
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${iotStatus.arduino ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
                <span>Arduino Node</span>
              </button>
              <button 
                onClick={() => toggleDevice('smartwatch')}
                className={`px-3 py-1.5 rounded-xl border text-[10px] font-extrabold flex items-center gap-1.5 transition-all ${
                  iotStatus.smartwatch 
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${iotStatus.smartwatch ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
                <Bluetooth className="w-3.5 h-3.5" />
                <span>Smart Watch</span>
              </button>
              <button 
                onClick={() => toggleDevice('bpMonitor')}
                className={`px-3 py-1.5 rounded-xl border text-[10px] font-extrabold flex items-center gap-1.5 transition-all ${
                  iotStatus.bpMonitor 
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${iotStatus.bpMonitor ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
                <span>Digital BP Sync</span>
              </button>
              <button 
                onClick={() => toggleDevice('glucoseMeter')}
                className={`px-3 py-1.5 rounded-xl border text-[10px] font-extrabold flex items-center gap-1.5 transition-all ${
                  iotStatus.glucoseMeter 
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${iotStatus.glucoseMeter ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
                <span>Smart Glucose</span>
              </button>
            </div>
          </div>
        </div>

        {/* DUAL DIVISION: Village Monitoring Center Grid & Patient Detail Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (4/12): Village Patient Monitor Center */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4.5 h-4.5 text-cyan-400" />
                  <span>Village Monitor Center</span>
                </h3>
                <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[9px] font-bold border border-cyan-500/20">
                  {patients.length} Active
                </span>
              </div>

              {/* Patient mini list card grid */}
              <div className="space-y-3">
                {patients.map((p) => {
                  const isSelected = selectedPatientId === p.id;
                  
                  // Quick health score math for mini badge
                  let badgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                  if (p.riskScore < 90) badgeColor = "bg-teal-500/10 text-teal-400 border-teal-500/20";
                  if (p.riskScore < 80) badgeColor = "bg-amber-500/10 text-amber-400 border-amber-500/20";
                  if (p.riskScore < 70) badgeColor = "bg-orange-500/10 text-orange-400 border-orange-500/20";
                  if (p.riskScore < 55) badgeColor = "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse";

                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPatientId(p.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-gradient-to-tr from-slate-900 to-cyan-950/20 border-cyan-500 shadow-md shadow-cyan-500/5'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{p.avatar}</span>
                        <div>
                          <strong className="text-xs font-bold text-white block">{p.name}</strong>
                          <span className="text-[10px] text-slate-500 font-medium block">
                            Age: {p.age} • {p.gender}
                          </span>
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end gap-1">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${badgeColor}`}>
                          Score: {p.riskScore}
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono block">Vitals sync ok</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Village Vitals Summary Box */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900 space-y-2.5">
                <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block">Village Triage Health alert summary:</span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-slate-900 rounded-lg border border-slate-850">
                    <span className="text-[9px] text-slate-500 block">Critical</span>
                    <strong className="text-xs text-red-500 font-bold">
                      {patients.filter(p => p.riskScore < 55).length} Patient
                    </strong>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-lg border border-slate-850">
                    <span className="text-[9px] text-slate-500 block">Alerts</span>
                    <strong className="text-xs text-orange-400 font-bold">
                      {patients.filter(p => p.riskScore < 85 && p.riskScore >= 55).length} Active
                    </strong>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-lg border border-slate-850">
                    <span className="text-[9px] text-slate-500 block">Optimal</span>
                    <strong className="text-xs text-emerald-400 font-bold">
                      {patients.filter(p => p.riskScore >= 85).length} Safe
                    </strong>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (8/12): Patient Sensor dashboard & Adjusters */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Patient overview banner */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <span className="text-4xl p-3 bg-slate-950 border border-slate-800 rounded-2xl">
                  {selectedPatient.avatar}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-white">{selectedPatient.name}</h3>
                    <span className="text-[9px] font-mono text-slate-500 font-semibold px-2 py-0.5 rounded bg-slate-950 border border-slate-850">
                      ID: {selectedPatient.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400 mt-1 font-medium">
                    <span>Age: {selectedPatient.age}</span>
                    <span>Gender: {selectedPatient.gender}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      {selectedPatient.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Fall Sensor trigger */}
              <div className="flex items-center gap-3">
                <button
                  onClick={triggerFallSimulation}
                  className="px-4 py-2.5 bg-red-600/10 hover:bg-red-600 border border-red-500/30 hover:border-red-500 text-red-400 hover:text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Simulate Fall Sensor</span>
                </button>
              </div>
            </div>

            {/* DUAL SCREEN: SENSOR GRID & Live Wave charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Box (1): Interactive sensor metrics grid */}
              <div className="space-y-6">
                
                {/* AI Risk engine calculator badge dial */}
                <div className={`p-6 rounded-3xl border shadow-xl flex items-center justify-between gap-6 ${aiScore.colorClass}`}>
                  <div className="space-y-1">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest block opacity-75">AI Health Diagnostics</span>
                    <h4 className="text-base font-black text-white">Risk Status: {aiScore.status}</h4>
                    <p className="text-[10px] text-slate-300 leading-relaxed font-medium">
                      {aiScore.score >= 90 ? 'Vitals optimal. Normal monitoring routine recommended.' : 
                       aiScore.score >= 70 ? 'Moderate alert. Ensure local checkup is scheduled.' : 
                       'CRITICAL: Emergency actions active. Ambulance dispatch alerted!'}
                    </p>
                  </div>

                  <div className="w-20 h-20 rounded-full border-4 border-slate-900 flex flex-col items-center justify-center relative bg-slate-950">
                    <span className="text-[10px] text-slate-500">Score</span>
                    <span className="text-xl font-black text-white">{aiScore.score}</span>
                  </div>
                </div>

                {/* 9 Health Sensors Cards */}
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Blood Pressure Sensor */}
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">1. Blood Pressure</span>
                    <div className="flex items-baseline gap-1">
                      <strong className="text-xl font-black text-white">{bpSystolic} / {bpDiastolic}</strong>
                      <span className="text-[9px] text-slate-400">mmHg</span>
                    </div>
                    <div className="text-[9px] text-slate-400 flex items-center justify-between">
                      <span>BP Limit: 120/80</span>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold ${
                        bpSystolic >= 160 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {bpSystolic >= 140 ? 'Stage 2 HP' : bpSystolic >= 120 ? 'Pre-HP' : 'Normal'}
                      </span>
                    </div>
                  </div>

                  {/* Heart Rate Sensor */}
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">2. Heart Rate</span>
                    <div className="flex items-baseline gap-1">
                      <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20 animate-pulse mr-0.5" />
                      <strong className="text-xl font-black text-white">{heartRate}</strong>
                      <span className="text-[9px] text-slate-400">BPM</span>
                    </div>
                    <div className="text-[9px] text-slate-400 flex items-center justify-between">
                      <span>Pulse Limit: 60-100</span>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold ${
                        heartRate > 100 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {heartRate > 100 ? 'High' : 'Normal'}
                      </span>
                    </div>
                  </div>

                  {/* SpO2 Sensor */}
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">3. Blood Oxygen</span>
                    <div className="flex items-baseline gap-1">
                      <strong className="text-xl font-black text-white">{spo2}%</strong>
                      <span className="text-[9px] text-slate-400">SpO2</span>
                    </div>
                    <div className="text-[9px] text-slate-400 flex items-center justify-between">
                      <span>Normal: &gt;95%</span>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold ${
                        spo2 < 92 ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {spo2 < 90 ? 'Deficit' : 'Safe'}
                      </span>
                    </div>
                  </div>

                  {/* Body Temp Sensor */}
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">4. Temperature</span>
                    <div className="flex items-baseline gap-1">
                      <Thermometer className="w-4 h-4 text-orange-400 mr-0.5" />
                      <strong className="text-xl font-black text-white">{temp}°F</strong>
                    </div>
                    <div className="text-[9px] text-slate-400 flex items-center justify-between">
                      <span>Normal: 98.6°F</span>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold ${
                        temp > 100 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {temp > 100 ? 'Fever' : 'Safe'}
                      </span>
                    </div>
                  </div>

                  {/* Glucose Sensor */}
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">5. Blood Sugar</span>
                    <div className="flex items-baseline gap-1">
                      <strong className="text-xl font-black text-white">{glucose}</strong>
                      <span className="text-[9px] text-slate-400">mg/dL</span>
                    </div>
                    <div className="text-[9px] text-slate-400 flex items-center justify-between">
                      <span>Fasting: &lt;100</span>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold ${
                        glucose > 140 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {glucose > 140 ? 'Elevated' : 'Safe'}
                      </span>
                    </div>
                  </div>

                  {/* Air Quality Sensor */}
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">6. Local AQI</span>
                    <div className="flex items-baseline gap-1">
                      <strong className="text-xl font-black text-white">{aqi}</strong>
                      <span className="text-[9px] text-slate-400">AQI</span>
                    </div>
                    <div className="text-[9px] text-slate-400 flex items-center justify-between">
                      <span>PM 2.5 Index</span>
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-emerald-500/10 text-emerald-400">
                        {aqi < 50 ? 'Good' : 'Moderate'}
                      </span>
                    </div>
                  </div>

                </div>

              </div>

              {/* Right Box (2): Live ECG Canvas Waves */}
              <div className="space-y-6">
                
                {/* Interactive Real-Time ECG wave */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-900 relative">
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Activity className="w-4.5 h-4.5 animate-pulse" />
                      <span>7. Real-Time ECG Stream</span>
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono">Lead II Rhythm</span>
                  </div>

                  {/* Wave canvas */}
                  <div className="rounded-xl overflow-hidden border border-slate-900 shadow-inner">
                    <canvas 
                      ref={ecgCanvasRef} 
                      width={320} 
                      height={120}
                      className="w-full h-auto bg-slate-950 block"
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2.5">
                    <span>Grid: 1mm/0.04s</span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      <span>Sweeping: 25mm/s</span>
                    </span>
                  </div>
                </div>

                {/* Pulse wave graph */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-900 relative">
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Zap className="w-4.5 h-4.5" />
                      <span>8. Pulse Plethysmograph (PPG)</span>
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono">SpO2 Pleth</span>
                  </div>

                  {/* Wave canvas */}
                  <div className="rounded-xl overflow-hidden border border-slate-900 shadow-inner">
                    <canvas 
                      ref={pulseCanvasRef} 
                      width={320} 
                      height={80}
                      className="w-full h-auto bg-slate-950 block"
                    />
                  </div>
                </div>

              </div>

            </div>

            {/* AI HEALTH TWIN: Historical sensor patterns & recommendations */}
            <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-cyan-400" />
                <span>AI Health Twin & Disease Predictor</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Vitals History logs */}
                <div className="space-y-2 font-mono text-xs">
                  <span className="font-sans font-bold text-slate-400 block">Biometric Logs (3 Days)</span>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    <div className="p-2 bg-slate-950 border border-slate-900 rounded-lg flex justify-between">
                      <span className="text-slate-500">12-Aug</span>
                      <span className="text-slate-200">122/81 BP • 74 HR</span>
                    </div>
                    <div className="p-2 bg-slate-950 border border-slate-900 rounded-lg flex justify-between">
                      <span className="text-slate-500">11-Aug</span>
                      <span className="text-slate-200">124/83 BP • 78 HR</span>
                    </div>
                    <div className="p-2 bg-slate-950 border border-slate-900 rounded-lg flex justify-between">
                      <span className="text-slate-500">10-Aug</span>
                      <span className="text-slate-200">120/80 BP • 72 HR</span>
                    </div>
                  </div>
                </div>

                {/* Chronic Disease Prediction */}
                <div className="space-y-2">
                  <span className="font-bold text-slate-400 block text-xs">Disease Risk Warnings</span>
                  <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl space-y-2.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Hypertension</span>
                      <span className="text-amber-400 font-bold">Moderate (32%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Diabetes / Sugar</span>
                      <span className="text-emerald-400">Low Risk (12%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Respiratory (COPD)</span>
                      <span className="text-emerald-400">Low Risk (8%)</span>
                    </div>
                  </div>
                </div>

                {/* AI twin prescriptions recommendations */}
                <div className="space-y-2 text-xs">
                  <span className="font-bold text-slate-400 block">AI Lifestyle Advise</span>
                  <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl space-y-1.5 text-slate-300">
                    <p className="leading-relaxed">
                      💡 <strong>Diet Recommendation:</strong> Reduce salt in diet to lower blood pressure. Avoid fried foods.
                    </p>
                    <p className="leading-relaxed">
                      💊 <strong>Adherence Check:</strong> Ensure Tab Aspirin 75mg is taken daily after breakfast.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* LIVE SENSOR ADJUSTMENT OVERRIDES (Simulate hardware inputs) */}
            <div className="p-6 rounded-3xl bg-slate-900/30 border border-slate-900 backdrop-blur-sm">
              <h4 className="text-xs font-extrabold text-cyan-400 uppercase tracking-widest mb-4">Simulate Active IoT Device Input (Calibration Sliders)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Heart Rate (BPM)</span>
                    <strong className="text-white">{heartRate}</strong>
                  </div>
                  <input
                    type="range" min="0" max="160" value={heartRate}
                    onChange={(e) => setHeartRate(Number(e.target.value))}
                    className="w-full accent-cyan-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                    <button onClick={() => setHeartRate(0)} className="hover:underline">Flatline (0)</button>
                    <button onClick={() => setHeartRate(72)} className="hover:underline">Normal (72)</button>
                    <button onClick={() => setHeartRate(135)} className="hover:underline">High (135)</button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Blood Oxygen (SpO2)</span>
                    <strong className="text-white">{spo2}%</strong>
                  </div>
                  <input
                    type="range" min="80" max="100" value={spo2}
                    onChange={(e) => setSpo2(Number(e.target.value))}
                    className="w-full accent-cyan-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                    <button onClick={() => setSpo2(85)} className="hover:underline">Critical (85)</button>
                    <button onClick={() => setSpo2(98)} className="hover:underline">Normal (98)</button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Systolic Pressure</span>
                    <strong className="text-white">{bpSystolic}</strong>
                  </div>
                  <input
                    type="range" min="80" max="200" value={bpSystolic}
                    onChange={(e) => setBpSystolic(Number(e.target.value))}
                    className="w-full accent-cyan-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                    <button onClick={() => setBpSystolic(190)} className="hover:underline">Hypertensive (190)</button>
                    <button onClick={() => setBpSystolic(120)} className="hover:underline">Normal (120)</button>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>

        {/* FALL DETECTION MODAL DIALOG DISPLAY */}
        {showFallModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/85 backdrop-blur-md animate-in fade-in duration-200">
            <div className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-red-500/50 shadow-2xl space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-red-600/20 border border-red-500 animate-ping absolute pointer-events-none opacity-40 mx-auto left-0 right-0" />
              <div className="w-16 h-16 rounded-full bg-red-600 border border-red-500 text-white flex items-center justify-center shadow-lg mx-auto relative z-10">
                <AlertCircle className="w-8 h-8 animate-bounce" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-black text-white">💥 ACCELEROMETER ALERT: FALL DETECTED!</h3>
                <p className="text-xs text-red-400 font-mono font-bold uppercase tracking-widest animate-pulse">Critical Incident Warning</p>
                <p className="text-xs text-slate-300 leading-relaxed pt-2">
                  A high-impact deceleration fall shock signature has been received from <strong>{selectedPatient.name}</strong>'s connected Smart Watch.
                </p>
              </div>

              {/* Location details */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-left space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">GPS Location Coordinates</span>
                <span className="font-bold text-slate-200 block flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-400" />
                  {selectedPatient.location}
                </span>
                <span className="text-[10px] text-slate-500 block">Dispatch Status: Dispatched 108 Emergency Ambulance.</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={resetFallStatus}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs rounded-xl transition-all border border-slate-700"
                >
                  Clear Sensor Status
                </button>
                <a
                  href="#emergency"
                  onClick={() => setShowFallModal(false)}
                  className="flex-grow py-3 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Launch Rescue Guide</span>
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
