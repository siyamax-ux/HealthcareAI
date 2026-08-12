const Consultation = require("../models/Consultation");
const Patient = require("../models/Patient");
const User = require("../models/User");
const MedicalDocument = require("../models/MedicalDocument");
const Referral = require("../models/Referral");

// ========================================
// DASHBOARD SUMMARY
// GET /api/analytics/summary
// Returns key platform-wide counts
// ========================================

const getSummary = async (req, res) => {
  try {
    const [
      totalPatients,
      totalConsultations,
      totalDocuments,
      totalReferrals,
      pendingConsultations,
      criticalConsultations,
      doctorsCount,
      healthWorkersCount,
    ] = await Promise.all([
      Patient.countDocuments(),
      Consultation.countDocuments(),
      MedicalDocument.countDocuments(),
      Referral.countDocuments(),
      Consultation.countDocuments({ status: "pending" }),
      Consultation.countDocuments({ riskLevel: { $in: ["high", "critical"] } }),
      User.countDocuments({ role: "doctor", isActive: true }),
      User.countDocuments({ role: "health_worker", isActive: true }),
    ]);

    res.json({
      success: true,
      summary: {
        totalPatients,
        totalConsultations,
        totalDocuments,
        totalReferrals,
        pendingConsultations,
        criticalConsultations,
        doctorsCount,
        healthWorkersCount,
      },
    });
  } catch (error) {
    console.error("Analytics summary error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch analytics summary" });
  }
};

// ========================================
// RISK DISTRIBUTION
// GET /api/analytics/risk
// Returns count of consultations per risk level
// ========================================

const getRiskDistribution = async (req, res) => {
  try {
    const distribution = await Consultation.aggregate([
      {
        $group: {
          _id: "$riskLevel",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Normalise to always return all 4 levels even if count is 0
    const levels = ["low", "medium", "high", "critical"];
    const result = levels.map((level) => {
      const found = distribution.find((d) => d._id === level);
      return { riskLevel: level, count: found ? found.count : 0 };
    });

    res.json({ success: true, riskDistribution: result });
  } catch (error) {
    console.error("Risk distribution error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch risk distribution" });
  }
};

// ========================================
// CONSULTATION STATUS DISTRIBUTION
// GET /api/analytics/status
// ========================================

const getStatusDistribution = async (req, res) => {
  try {
    const distribution = await Consultation.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const statuses = ["pending", "in_progress", "completed", "referred"];
    const result = statuses.map((status) => {
      const found = distribution.find((d) => d._id === status);
      return { status, count: found ? found.count : 0 };
    });

    res.json({ success: true, statusDistribution: result });
  } catch (error) {
    console.error("Status distribution error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch status distribution" });
  }
};

// ========================================
// RECENT ACTIVITY
// GET /api/analytics/recent
// Returns the 10 most recent consultations
// ========================================

const getRecentActivity = async (req, res) => {
  try {
    const recent = await Consultation.find()
      .populate("patient", "name age gender village")
      .populate("healthWorker", "name role")
      .sort({ createdAt: -1 })
      .limit(10)
      .select("patient healthWorker riskLevel status createdAt symptoms");

    res.json({ success: true, recent });
  } catch (error) {
    console.error("Recent activity error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch recent activity" });
  }
};

module.exports = {
  getSummary,
  getRiskDistribution,
  getStatusDistribution,
  getRecentActivity,
};
