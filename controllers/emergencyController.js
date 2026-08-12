const Consultation = require("../models/Consultation");
const Patient = require("../models/Patient");
const { sendEmergencyAlert } = require("../services/notificationService");

// ========================================
// FLAG EMERGENCY
// POST /api/emergency/flag
// Body: { consultationId, reason }
// Marks a consultation as critical and doctorRequired = true.
// ========================================

const flagEmergency = async (req, res) => {
  try {
    const { consultationId, reason } = req.body;

    if (!consultationId) {
      return res.status(400).json({
        success: false,
        message: "consultationId is required",
      });
    }

    const consultation = await Consultation.findById(consultationId)
      .populate("patient", "name age gender village phone emergencyContact");

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found",
      });
    }

    // Escalate
    consultation.riskLevel      = "critical";
    consultation.doctorRequired = true;
    consultation.status         = "in_progress";

    if (reason) {
      consultation.medicalNotes = consultation.medicalNotes
        ? `${consultation.medicalNotes}\n[EMERGENCY] ${reason}`
        : `[EMERGENCY] ${reason}`;
    }

    await consultation.save();

    // Fire emergency alert notification
    try {
      sendEmergencyAlert({
        patientName: consultation.patient?.name || "Unknown",
        consultationId: consultation._id,
        riskSignals: [],
        emergencyContact: consultation.patient?.emergencyContact || null,
      });
    } catch (notifError) {
      console.error("Notification error (non-fatal):", notifError.message);
    }

    res.json({
      success: true,
      message: "Emergency flagged successfully",
      consultation: {
        _id:            consultation._id,
        riskLevel:      consultation.riskLevel,
        status:         consultation.status,
        doctorRequired: consultation.doctorRequired,
        patient:        consultation.patient,
      },
      emergencyContact: consultation.patient?.emergencyContact || null,
    });
  } catch (error) {
    console.error("Flag emergency error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid consultation ID" });
    }

    res.status(500).json({ success: false, message: "Failed to flag emergency" });
  }
};

// ========================================
// GET ALL CRITICAL/HIGH-RISK CONSULTATIONS
// GET /api/emergency/alerts
// Returns consultations that are high or critical risk
// ========================================

const getAlerts = async (req, res) => {
  try {
    const alerts = await Consultation.find({
      riskLevel: { $in: ["high", "critical"] },
      status: { $nin: ["completed"] },
    })
      .populate("patient", "name age gender village phone emergencyContact")
      .populate("healthWorker", "name role phone")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: alerts.length,
      alerts,
    });
  } catch (error) {
    console.error("Get alerts error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch emergency alerts" });
  }
};

module.exports = { flagEmergency, getAlerts };
