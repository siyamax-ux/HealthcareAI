const Consultation = require("../models/Consultation");
const { analyzeConsultation } = require("../services/aiService");
const {
  sendAIAnalysisNotification,
  sendHighRiskAlert,
  sendDoctorRequiredAlert,
} = require("../services/notificationService");

// ========================================
// ANALYZE CONSULTATION
// POST /api/ai/analyze
// Body: { consultationId }
// ========================================

const analyze = async (req, res) => {
  try {
    const { consultationId, language } = req.body;

    if (!consultationId) {
      return res.status(400).json({
        success: false,
        message: "consultationId is required",
      });
    }

    // Load consultation with full patient context
    const consultation = await Consultation.findById(consultationId)
      .populate("patient", "name age gender village");

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found",
      });
    }

    // Run AI + Risk Engine analysis
    const result = await analyzeConsultation({
      patient:      consultation.patient,
      symptoms:     consultation.symptoms,
      vitals:       consultation.vitals,
      medicalNotes: consultation.medicalNotes,
      language:     language || "english",
    });

    // Persist results back into the consultation record
    consultation.riskLevel      = result.riskLevel;
    consultation.doctorRequired = result.doctorRequired;
    consultation.aiAnalysis = {
      summary:            result.summary,
      possibleConditions: result.possibleConditions,
      recommendation:     result.recommendedAction,
    };

    // Auto-escalate status if high/critical
    if (
      (result.riskLevel === "high" || result.riskLevel === "critical") &&
      consultation.status === "pending"
    ) {
      consultation.status = "in_progress";
    }

    await consultation.save();

    // Fire notifications based on result (non-blocking — errors won't affect the response)
    try {
      const patientName = consultation.patient?.name || "Unknown";

      sendAIAnalysisNotification({
        patientName,
        consultationId,
        riskLevel: result.riskLevel,
        urgency: result.urgency,
      });

      if (result.riskLevel === "high" || result.riskLevel === "critical") {
        sendHighRiskAlert({
          patientName,
          consultationId,
          riskLevel: result.riskLevel,
          riskSignals: result.riskSignals,
        });
      }

      if (result.doctorRequired) {
        sendDoctorRequiredAlert({
          patientName,
          consultationId,
          recommendedAction: result.recommendedAction,
        });
      }
    } catch (notifError) {
      console.error("Notification error (non-fatal):", notifError.message);
    }

    res.json({
      success: true,
      message: "AI analysis completed",
      analysis: {
        riskLevel:          result.riskLevel,
        riskSignals:        result.riskSignals,
        vitalFlags:         result.vitalFlags,
        doctorRequired:     result.doctorRequired,
        summary:            result.summary,
        possibleConditions: result.possibleConditions,
        recommendedAction:  result.recommendedAction,
        urgency:            result.urgency,
        confidence:         result.confidence,
        followUpQuestions:  result.followUpQuestions,
        disclaimer:         result.disclaimer,
      },
      consultationId,
    });
  } catch (error) {
    console.error("AI analyze error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid consultation ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "AI analysis failed",
    });
  }
};

// ========================================
// RISK-ONLY CHECK (no AI, instant)
// POST /api/ai/risk
// Body: { vitals, symptoms }
// Useful for real-time frontend feedback while filling a form
// ========================================

const riskCheck = (req, res) => {
  try {
    const { vitals = {}, symptoms = [] } = req.body;

    const { assessRisk } = require("../services/riskEngine");
    const result = assessRisk({ vitals, symptoms });

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Risk check error:", error);

    res.status(500).json({
      success: false,
      message: "Risk check failed",
    });
  }
};

// ========================================
// GET SUPPORTED LANGUAGES
// GET /api/ai/languages
// ========================================

const getSupportedLanguages = (req, res) => {
  res.json({
    success: true,
    languages: [
      { code: "english",  name: "English" },
      { code: "hindi",    name: "Hindi — हिंदी" },
      { code: "bengali",  name: "Bengali — বাংলা" },
      { code: "gujarati", name: "Gujarati — ગુજરાતી" },
      { code: "marathi",  name: "Marathi — मराठी" },
      { code: "punjabi",  name: "Punjabi — ਪੰਜਾਬੀ" },
    ],
  });
};

module.exports = { analyze, riskCheck, getSupportedLanguages };
