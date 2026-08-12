// ============================================================
// SETUHEALTH AI — RISK ENGINE
// Pure deterministic rule-based risk assessment.
// No external calls. Returns a structured risk result.
// This is the hard safety floor — AI may add context on top,
// but it cannot lower a risk level produced here.
// ============================================================

// -------------------------------------------------------
// VITAL SIGN THRESHOLDS
// Based on standard clinical reference ranges.
// -------------------------------------------------------
const THRESHOLDS = {
  temperature: {
    low:      { min: 35.0, max: 36.0 }, // Hypothermia
    normal:   { min: 36.1, max: 37.5 },
    elevated: { min: 37.6, max: 38.4 }, // Low-grade fever
    high:     { min: 38.5, max: 39.9 }, // Fever
    critical: { min: 40.0 },            // Hyperpyrexia
  },
  heartRate: {
    critical_low:  { max: 40  },
    low:           { min: 41,  max: 59  }, // Bradycardia
    normal:        { min: 60,  max: 100 },
    elevated:      { min: 101, max: 119 }, // Mild tachycardia
    critical_high: { min: 120 },           // Severe tachycardia
  },
  oxygenLevel: {
    critical: { max: 90 }, // Severe hypoxia
    low:      { min: 91, max: 94 }, // Mild-moderate hypoxia
    normal:   { min: 95 },
  },
  weight: {
    // Weight alone doesn't drive risk level — used only for context
  },
};

// High-risk symptom keywords — presence of any raises minimum to "high"
const HIGH_RISK_SYMPTOMS = [
  "chest pain",
  "chest tightness",
  "difficulty breathing",
  "shortness of breath",
  "unconscious",
  "unresponsive",
  "seizure",
  "stroke",
  "paralysis",
  "severe bleeding",
  "coughing blood",
  "blood in urine",
  "high fever",
  "loss of consciousness",
];

// Medium-risk symptom keywords — presence of any raises minimum to "medium"
const MEDIUM_RISK_SYMPTOMS = [
  "fever",
  "vomiting",
  "diarrhea",
  "severe headache",
  "abdominal pain",
  "dizziness",
  "weakness",
  "fatigue",
  "rash",
  "swelling",
  "pain",
  "infection",
];

// -------------------------------------------------------
// HELPER: parse systolic from "120/80" format
// -------------------------------------------------------
const parseSystolic = (bp) => {
  if (!bp || typeof bp !== "string") return null;
  const parts = bp.split("/");
  const systolic = parseInt(parts[0], 10);
  return isNaN(systolic) ? null : systolic;
};

// -------------------------------------------------------
// MAIN EXPORT: assessRisk({ vitals, symptoms })
//
// Returns:
// {
//   riskLevel: "low" | "medium" | "high" | "critical",
//   riskSignals: ["reason1", "reason2", ...],
//   doctorRequired: true | false,
//   vitalFlags: { temperature: "elevated", ... }
// }
// -------------------------------------------------------
const assessRisk = ({ vitals = {}, symptoms = [] }) => {
  const signals = [];
  const vitalFlags = {};
  let riskScore = 0; // 0=low, 1=medium, 2=high, 3=critical

  const {
    temperature,
    heartRate,
    oxygenLevel,
    bloodPressure,
    weight,
  } = vitals;

  // --- Temperature ---
  if (temperature !== undefined && temperature !== null) {
    if (temperature >= THRESHOLDS.temperature.critical.min) {
      signals.push(`Critical temperature: ${temperature}°C (hyperpyrexia)`);
      vitalFlags.temperature = "critical";
      riskScore = Math.max(riskScore, 3);
    } else if (temperature >= THRESHOLDS.temperature.high.min) {
      signals.push(`High fever: ${temperature}°C`);
      vitalFlags.temperature = "high";
      riskScore = Math.max(riskScore, 2);
    } else if (temperature >= THRESHOLDS.temperature.elevated.min) {
      signals.push(`Elevated temperature: ${temperature}°C`);
      vitalFlags.temperature = "elevated";
      riskScore = Math.max(riskScore, 1);
    } else if (temperature < THRESHOLDS.temperature.low.min) {
      signals.push(`Low temperature: ${temperature}°C (possible hypothermia)`);
      vitalFlags.temperature = "low";
      riskScore = Math.max(riskScore, 2);
    } else {
      vitalFlags.temperature = "normal";
    }
  }

  // --- Heart Rate ---
  if (heartRate !== undefined && heartRate !== null) {
    if (heartRate <= THRESHOLDS.heartRate.critical_low.max || heartRate >= THRESHOLDS.heartRate.critical_high.min) {
      signals.push(`Critical heart rate: ${heartRate} bpm`);
      vitalFlags.heartRate = "critical";
      riskScore = Math.max(riskScore, 3);
    } else if (heartRate >= THRESHOLDS.heartRate.elevated.min) {
      signals.push(`Elevated heart rate: ${heartRate} bpm (tachycardia)`);
      vitalFlags.heartRate = "elevated";
      riskScore = Math.max(riskScore, 1);
    } else if (heartRate <= THRESHOLDS.heartRate.low.max) {
      signals.push(`Low heart rate: ${heartRate} bpm (bradycardia)`);
      vitalFlags.heartRate = "low";
      riskScore = Math.max(riskScore, 1);
    } else {
      vitalFlags.heartRate = "normal";
    }
  }

  // --- Oxygen Level ---
  if (oxygenLevel !== undefined && oxygenLevel !== null) {
    if (oxygenLevel <= THRESHOLDS.oxygenLevel.critical.max) {
      signals.push(`Critical oxygen level: ${oxygenLevel}% (severe hypoxia)`);
      vitalFlags.oxygenLevel = "critical";
      riskScore = Math.max(riskScore, 3);
    } else if (oxygenLevel <= THRESHOLDS.oxygenLevel.low.max) {
      signals.push(`Low oxygen level: ${oxygenLevel}% (mild hypoxia)`);
      vitalFlags.oxygenLevel = "low";
      riskScore = Math.max(riskScore, 2);
    } else {
      vitalFlags.oxygenLevel = "normal";
    }
  }

  // --- Blood Pressure (systolic) ---
  const systolic = parseSystolic(bloodPressure);
  if (systolic !== null) {
    if (systolic >= 180) {
      signals.push(`Hypertensive crisis: systolic ${systolic} mmHg`);
      vitalFlags.bloodPressure = "critical";
      riskScore = Math.max(riskScore, 3);
    } else if (systolic >= 140) {
      signals.push(`High blood pressure: systolic ${systolic} mmHg`);
      vitalFlags.bloodPressure = "high";
      riskScore = Math.max(riskScore, 2);
    } else if (systolic < 90) {
      signals.push(`Low blood pressure: systolic ${systolic} mmHg (hypotension)`);
      vitalFlags.bloodPressure = "low";
      riskScore = Math.max(riskScore, 2);
    } else {
      vitalFlags.bloodPressure = "normal";
    }
  }

  // --- Symptoms ---
  const normalizedSymptoms = symptoms.map((s) => s.toLowerCase());

  for (const keyword of HIGH_RISK_SYMPTOMS) {
    if (normalizedSymptoms.some((s) => s.includes(keyword))) {
      signals.push(`High-risk symptom reported: "${keyword}"`);
      riskScore = Math.max(riskScore, 2);
    }
  }

  for (const keyword of MEDIUM_RISK_SYMPTOMS) {
    if (normalizedSymptoms.some((s) => s.includes(keyword))) {
      riskScore = Math.max(riskScore, 1);
    }
  }

  // --- Map score to level ---
  const levelMap = ["low", "medium", "high", "critical"];
  const riskLevel = levelMap[riskScore];

  return {
    riskLevel,
    riskSignals: signals,
    doctorRequired: riskScore >= 2, // high or critical always needs a doctor
    vitalFlags,
  };
};

module.exports = { assessRisk };
