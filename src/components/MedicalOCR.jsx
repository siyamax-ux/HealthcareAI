import React, { useState } from 'react';
import { 
  FileText, Upload, CheckCircle2, Sparkles, AlertCircle, FileSearch, 
  ArrowRight, RefreshCw, Eye, Download 
} from 'lucide-react';

export const MedicalOCR = () => {
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [ocrOutput, setOcrOutput] = useState(null);

  const samplePrescriptions = [
    {
      id: 1,
      title: "Handwritten Doctor Note (Dr. Verma)",
      file: "prescription_sample_1.jpg",
      extractedText: "Tab. Paracetamol 550mg 1-0-1 (3 Days)\nTab. Cetirizine 10mg 0-0-1\nAdvice: CBC Test for Platelets & WFH Rest",
      doctorName: "Dr. A. K. Verma (MD)",
      diagnosis: "Acute Viral Fever with Myalgia",
      medicines: [
        { name: "Paracetamol 550mg", dosage: "Morning & Night after food", duration: "3 Days" },
        { name: "Cetirizine 10mg", dosage: "Night before sleep", duration: "5 Days" }
      ]
    },
    {
      id: 2,
      title: "Lab Blood Report (Primary Health Centre)",
      file: "blood_report_2.pdf",
      extractedText: "Hemoglobin: 11.2 g/dL (Normal: 12-16)\nPlatelet Count: 95,000 /uL (Low Risk - Dengue Suspicion)\nWBC Count: 4,100 /uL",
      doctorName: "PHC Pathology Lab",
      diagnosis: "Thrombocytopenia (Low Platelets)",
      medicines: [
        { name: "Papaya Leaf Extract Syrup", dosage: "10ml 2 times daily", duration: "7 Days" },
        { name: "ORS Rehydration Solution", dosage: "Frequent sips with clean water", duration: "Ongoing" }
      ]
    }
  ];

  const handleSelectSample = (sample) => {
    setSelectedPreset(sample);
    setProcessing(true);
    setOcrOutput(null);

    setTimeout(() => {
      setProcessing(false);
      setOcrOutput(sample);
    }, 1500);
  };

  return (
    <section id="ocr" className="py-24 relative overflow-hidden">
      
      {/* Glow Orbs */}
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-bold text-cyan-400 mb-4">
            <FileText className="w-4 h-4" />
            <span>Interactive Module 4</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            AI Medical OCR & Document Scanner
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Scan handwritten doctor prescriptions or lab reports to instantly extract medicines, dosage instructions, and AI summaries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          
          {/* Left Column: Drag & Drop Mock Area */}
          <div className="lg:col-span-5 rounded-3xl glass-panel p-8 border border-slate-800 space-y-6">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Upload className="w-5 h-5 text-cyan-400" />
              Upload Medical Document
            </h3>

            {/* Drop Zone Box */}
            <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-2xl p-8 text-center bg-slate-900/50 hover:bg-slate-900 transition-all cursor-pointer group">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-4 group-hover:scale-110 transition-transform">
                <FileSearch className="w-7 h-7" />
              </div>
              <p className="text-sm font-bold text-white mb-1">Drag & Drop Prescription here</p>
              <p className="text-xs text-slate-400 mb-4">Supports PNG, JPG, PDF up to 15MB</p>
              <span className="px-4 py-2 bg-slate-800 text-cyan-400 text-xs font-semibold rounded-xl border border-slate-700 group-hover:bg-cyan-500 group-hover:text-white transition-all">
                Browse File
              </span>
            </div>

            {/* Demo Sample Selector */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Or test with demo scans:</p>
              <div className="space-y-2">
                {samplePrescriptions.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    className={`w-full p-3 rounded-xl text-left border text-xs font-semibold flex items-center justify-between transition-all ${
                      selectedPreset?.id === sample.id 
                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300' 
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="truncate">{sample.title}</span>
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: AI Extraction & Summary View */}
          <div className="lg:col-span-7 rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800 min-h-[420px]">
            
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                AI Optical Character Extraction
              </h3>
              {ocrOutput && (
                <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 font-semibold">
                  OCR Accuracy 98.4%
                </span>
              )}
            </div>

            {processing && (
              <div className="py-16 text-center space-y-4">
                <RefreshCw className="w-10 h-10 text-cyan-400 animate-spin mx-auto" />
                <p className="text-sm font-bold text-white">Extracting handwriting & drug schedules with Computer Vision...</p>
                <p className="text-xs text-slate-400 font-mono">Parsing medical abbreviations and dosage frequencies</p>
              </div>
            )}

            {!processing && !ocrOutput && (
              <div className="py-20 text-center text-slate-400 space-y-2">
                <FileText className="w-12 h-12 text-slate-600 mx-auto" />
                <p className="text-sm font-medium">Select or upload a prescription to view AI breakdown.</p>
              </div>
            )}

            {!processing && ocrOutput && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Extracted Raw OCR Text Box */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Raw OCR Text Detected</h4>
                  <pre className="text-xs font-mono text-cyan-300 whitespace-pre-wrap leading-relaxed">
                    {ocrOutput.extractedText}
                  </pre>
                </div>

                {/* Structured AI Analysis */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/30 to-purple-950/30 border border-cyan-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs text-slate-400 font-medium">Predicted Diagnosis</h4>
                      <p className="text-sm font-bold text-white">{ocrOutput.diagnosis}</p>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">{ocrOutput.doctorName}</span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Parsed Medication Schedule</h4>
                    <div className="space-y-2">
                      {ocrOutput.medicines.map((med, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-white block">{med.name}</span>
                            <span className="text-slate-400">{med.dosage}</span>
                          </div>
                          <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 font-semibold rounded-md border border-purple-500/30">
                            {med.duration}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
