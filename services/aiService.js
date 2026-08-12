// ============================================================
// SETUHEALTH AI — AI SERVICE
// Calls Google Gemini to analyze consultation data.
// The Risk Engine result is the hard floor —
// the AI can raise severity but never lower it.
// ============================================================

const { assessRisk } = require("./riskEngine");

// -------------------------------------------------------
// DISCLAIMER — appended to every AI response
// -------------------------------------------------------
const DISCLAIMER =
  "This is AI-assisted decision support only. It does not constitute a medical diagnosis. Always consult a qualified healthcare professional for clinical decisions.";

// -------------------------------------------------------
// SUPPORTED LANGUAGES
// -------------------------------------------------------
const SUPPORTED_LANGUAGES = {
  english: { name: "English",   instruction: "Respond in English." },
  hindi:   { name: "Hindi",     instruction: "Respond entirely in Hindi (हिंदी में जवाब दें). Use simple language a rural health worker would understand." },
  bengali: { name: "Bengali",   instruction: "Respond entirely in Bengali (বাংলায় উত্তর দিন). Use simple language a rural health worker would understand." },
  gujarati:{ name: "Gujarati",  instruction: "Respond entirely in Gujarati (ગુજરાતીમાં જવાબ આપો). Use simple language a rural health worker would understand." },
  marathi: { name: "Marathi",   instruction: "Respond entirely in Marathi (मराठीत उत्तर द्या). Use simple language a rural health worker would understand." },
  punjabi: { name: "Punjabi",   instruction: "Respond entirely in Punjabi (ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦਿਓ). Use simple language a rural health worker would understand." },
};

// -------------------------------------------------------
// BUILD PROMPT
// Converts structured consultation data into a clear
// clinical prompt that Gemini can reason about.
// -------------------------------------------------------
const buildPrompt = ({ patient, symptoms, vitals, medicalNotes, riskResult, language = "english" }) => {
  const vitalLines = vitals
    ? [
        vitals.temperature  != null ? `  - Temperature: ${vitals.temperature}°C`       : null,
        vitals.bloodPressure         ? `  - Blood Pressure: ${vitals.bloodPressure} mmHg` : null,
        vitals.heartRate    != null ? `  - Heart Rate: ${vitals.heartRate} bpm`         : null,
        vitals.oxygenLevel  != null ? `  - Oxygen Level: ${vitals.oxygenLevel}%`        : null,
        vitals.weight       != null ? `  - Weight: ${vitals.weight} kg`                 : null,
      ].filter(Boolean).join("\n")
    : "  Not provided";

  const langConfig = SUPPORTED_LANGUAGES[language] || SUPPORTED_LANGUAGES.english;

  return `You are Aarogya, a clinical decision-support AI for rural healthcare workers in India.
You help health workers — not doctors — understand patient conditions and decide next steps.
You must NEVER claim to diagnose or prescribe. Always recommend escalation when uncertain.
LANGUAGE INSTRUCTION: ${langConfig.instruction}

PATIENT CONTEXT:
- Name: ${patient?.name || "Unknown"}
- Age: ${patient?.age || "Unknown"}
- Gender: ${patient?.gender || "Unknown"}
- Village: ${patient?.village || "Unknown"}

REPORTED SYMPTOMS:
${symptoms && symptoms.length > 0 ? symptoms.map((s) => `  - ${s}`).join("\n") : "  None reported"}

VITALS:
${vitalLines}

MEDICAL NOTES FROM HEALTH WORKER:
${medicalNotes || "None"}

DETERMINISTIC RISK ASSESSMENT (from system rules):
- Risk Level: ${riskResult.riskLevel.toUpperCase()}
- Risk Signals: ${riskResult.riskSignals.length > 0 ? riskResult.riskSignals.join("; ") : "None"}
- Doctor Required by rules: ${riskResult.doctorRequired ? "YES" : "NO"}

INSTRUCTIONS:
Respond ONLY with a valid JSON object in exactly this format. No extra text, no markdown, no explanation outside the JSON:

{
  "summary": "2-3 sentence plain-language summary of the patient's condition for a health worker",
  "possibleConditions": ["condition1", "condition2"],
  "recommendedAction": "What the health worker should do next (specific, practical)",
  "doctorRequired": true or false,
  "confidence": 0.0 to 1.0,
  "urgency": "routine" or "urgent" or "emergency",
  "followUpQuestions": ["question to ask patient 1", "question 2"],
  "disclaimer": "${DISCLAIMER}"
}

IMPORTANT RULES:
- If the system risk level is "high" or "critical", doctorRequired MUST be true.
- If the system risk level is "critical", urgency MUST be "emergency".
- If you are uncertain about anything, set confidence below 0.5 and recommend escalation.
- Do not use medical jargon a health worker would not understand.
- possibleConditions must contain at most 3 items.
- followUpQuestions must contain at most 3 items.`;
};

// -------------------------------------------------------
// PARSE AI RESPONSE
// Safely extracts JSON from Gemini's text response.
// If parsing fails, returns a safe fallback response.
// -------------------------------------------------------
const parseAIResponse = (text, riskResult) => {
  try {
    // Gemini sometimes wraps JSON in ```json ... ``` — strip that
    const cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    // Hard enforcement: Risk Engine is the floor, AI cannot override it
    if (riskResult.riskLevel === "critical") {
      parsed.urgency = "emergency";
      parsed.doctorRequired = true;
    }
    if (riskResult.riskLevel === "high") {
      parsed.doctorRequired = true;
    }

    // Ensure disclaimer is always present
    parsed.disclaimer = DISCLAIMER;

    return parsed;
  } catch {
    // If AI returns garbage, return a safe structured fallback
    return {
      summary:
        "AI analysis could not be completed. Please review the patient manually.",
      possibleConditions: [],
      recommendedAction:
        "Review patient vitals and symptoms manually. Escalate to a doctor if unsure.",
      doctorRequired: riskResult.doctorRequired,
      confidence: 0,
      urgency: riskResult.riskLevel === "critical" ? "emergency"
             : riskResult.riskLevel === "high"     ? "urgent"
             : "routine",
      followUpQuestions: [],
      disclaimer: DISCLAIMER,
    };
  }
};

// -------------------------------------------------------
// MAIN EXPORT: analyzeConsultation(data)
//
// Input:
// {
//   patient:     { name, age, gender, village },
//   symptoms:    ["fever", "headache"],
//   vitals:      { temperature, bloodPressure, heartRate, oxygenLevel, weight },
//   medicalNotes: "..."
// }
//
// Returns:
// {
//   riskLevel, riskSignals, vitalFlags, doctorRequired,  ← from Risk Engine
//   summary, possibleConditions, recommendedAction,      ← from AI
//   confidence, urgency, followUpQuestions, disclaimer
// }
// -------------------------------------------------------
const analyzeConsultation = async (data) => {
  const { patient, symptoms = [], vitals = {}, medicalNotes = "", language = "english" } = data;

  // Validate + normalize language
  const normalizedLang = SUPPORTED_LANGUAGES[language?.toLowerCase()]
    ? language.toLowerCase()
    : "english";

  // Step 1 — Always run Risk Engine first (deterministic, fast, safe)
  const riskResult = assessRisk({ vitals, symptoms });

  // Step 2 — Try to call Gemini; if it fails, return risk-only result
  // Pass language through to buildPrompt
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("⚠️  GEMINI_API_KEY not set — returning risk engine result only.");
    return {
      ...riskResult,
      summary: "AI analysis unavailable (API key not configured). Risk assessment is based on vital signs and symptoms only.",
      possibleConditions: [],
      recommendedAction: riskResult.doctorRequired
        ? "Refer to a doctor immediately based on risk signals."
        : "Monitor the patient and reassess if symptoms worsen.",
      confidence: 0,
      urgency: riskResult.riskLevel === "critical" ? "emergency"
             : riskResult.riskLevel === "high"     ? "urgent"
             : "routine",
      followUpQuestions: [],
      disclaimer: DISCLAIMER,
    };
  }

  try {
    const prompt = buildPrompt({ patient, symptoms, vitals, medicalNotes, riskResult, language: normalizedLang });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,      // Low temperature = more deterministic, safer for medical
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const json = await response.json();
    const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const aiResult = parseAIResponse(rawText, riskResult);

    // Merge: Risk Engine fields + AI enrichment
    return {
      riskLevel:          riskResult.riskLevel,
      riskSignals:        riskResult.riskSignals,
      vitalFlags:         riskResult.vitalFlags,
      doctorRequired:     aiResult.doctorRequired,
      summary:            aiResult.summary,
      possibleConditions: aiResult.possibleConditions || [],
      recommendedAction:  aiResult.recommendedAction,
      confidence:         aiResult.confidence ?? 0,
      urgency:            aiResult.urgency || "routine",
      followUpQuestions:  aiResult.followUpQuestions || [],
      disclaimer:         DISCLAIMER,
    };
  } catch (error) {
    console.error("AI Service error:", error.message);

    // Graceful degradation — never crash the consultation flow
    return {
      ...riskResult,
      summary: "AI analysis temporarily unavailable. Risk assessment is based on vital signs and symptoms.",
      possibleConditions: [],
      recommendedAction: riskResult.doctorRequired
        ? "Refer to a doctor based on detected risk signals."
        : "Monitor the patient. Reassess if condition changes.",
      confidence: 0,
      urgency: riskResult.riskLevel === "critical" ? "emergency"
             : riskResult.riskLevel === "high"     ? "urgent"
             : "routine",
      followUpQuestions: [],
      disclaimer: DISCLAIMER,
    };
  }
};

module.exports = { analyzeConsultation };
