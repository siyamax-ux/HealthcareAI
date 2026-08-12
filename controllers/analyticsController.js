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

// ========================================
// VILLAGE DISEASE HEATMAP
// GET /api/analytics/villages
// Groups consultations by village with symptom + risk counts
// ========================================

const getVillageHeatmap = async (req, res) => {
  try {
    const villageStats = await Consultation.aggregate([
      // Join with patient to get village
      {
        $lookup: {
          from:         "patients",
          localField:   "patient",
          foreignField: "_id",
          as:           "patientData",
        },
      },
      { $unwind: "$patientData" },

      // Group by village
      {
        $group: {
          _id:               "$patientData.village",
          totalConsultations: { $sum: 1 },
          critical:  { $sum: { $cond: [{ $eq: ["$riskLevel", "critical"] }, 1, 0] } },
          high:      { $sum: { $cond: [{ $eq: ["$riskLevel", "high"] }, 1, 0] } },
          medium:    { $sum: { $cond: [{ $eq: ["$riskLevel", "medium"] }, 1, 0] } },
          low:       { $sum: { $cond: [{ $eq: ["$riskLevel", "low"] }, 1, 0] } },
          referred:  { $sum: { $cond: [{ $eq: ["$status", "referred"] }, 1, 0] } },
          allSymptoms: { $push: "$symptoms" },
          lastActivity: { $max: "$createdAt" },
        },
      },

      // Sort by highest risk first
      { $sort: { critical: -1, high: -1, totalConsultations: -1 } },
    ]);

    // Flatten + count top symptoms per village
    const result = villageStats
      .filter((v) => v._id) // skip null villages
      .map((v) => {
        // Flatten nested symptom arrays and count frequency
        const symptomCount = {};
        v.allSymptoms.flat().forEach((s) => {
          if (s) {
            const key = s.toLowerCase().trim();
            symptomCount[key] = (symptomCount[key] || 0) + 1;
          }
        });

        // Top 5 symptoms by frequency
        const topSymptoms = Object.entries(symptomCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([symptom, count]) => ({ symptom, count }));

        // Overall risk label for this village
        const riskLabel =
          v.critical > 0 ? "critical" :
          v.high     > 0 ? "high"     :
          v.medium   > 0 ? "medium"   : "low";

        return {
          village:            v._id,
          totalConsultations: v.totalConsultations,
          riskBreakdown: {
            critical: v.critical,
            high:     v.high,
            medium:   v.medium,
            low:      v.low,
          },
          overallRisk:   riskLabel,
          referredCases: v.referred,
          topSymptoms,
          lastActivity:  v.lastActivity,
        };
      });

    res.json({ success: true, count: result.length, villages: result });
  } catch (error) {
    console.error("Village heatmap error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch village heatmap" });
  }
};

// ========================================
// DISEASE TRENDS OVER TIME
// GET /api/analytics/disease-trends
// Returns symptom frequency per month (last 6 months)
// ========================================

const getDiseaseTrends = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const trends = await Consultation.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },

      // Unwind symptoms array so each symptom is a separate document
      { $unwind: { path: "$symptoms", preserveNullAndEmptyArrays: false } },

      // Group by month + symptom
      {
        $group: {
          _id: {
            year:    { $year: "$createdAt" },
            month:   { $month: "$createdAt" },
            symptom: { $toLower: "$symptoms" },
          },
          count: { $sum: 1 },
        },
      },

      { $sort: { "_id.year": 1, "_id.month": 1, count: -1 } },
    ]);

    // Reshape: group by month, list top symptoms
    const monthMap = {};
    trends.forEach(({ _id, count }) => {
      const key = `${_id.year}-${String(_id.month).padStart(2, "0")}`;
      if (!monthMap[key]) monthMap[key] = { month: key, symptoms: [] };
      monthMap[key].symptoms.push({ symptom: _id.symptom, count });
    });

    // Keep top 5 symptoms per month
    const result = Object.values(monthMap).map((m) => ({
      month:       m.month,
      topSymptoms: m.symptoms.slice(0, 5),
    }));

    res.json({ success: true, trends: result });
  } catch (error) {
    console.error("Disease trends error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch disease trends" });
  }
};

module.exports = {
  getSummary,
  getRiskDistribution,
  getStatusDistribution,
  getRecentActivity,
  getVillageHeatmap,
  getDiseaseTrends,
};
