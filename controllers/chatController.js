const ChatMessage = require("../models/ChatMessage");
const Consultation = require("../models/Consultation");
const { encrypt, decrypt } = require("../services/encryptionService");
const { analyzeConsultation } = require("../services/aiService");

// ========================================
// SEND MESSAGE (Health Worker → AI)
// POST /api/chat/send
// Body: { consultationId, message }
// ========================================

const sendMessage = async (req, res) => {
  try {
    const { consultationId, message } = req.body;

    if (!consultationId || !message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "consultationId and message are required",
      });
    }

    // Verify consultation exists and belongs to a patient
    const consultation = await Consultation.findById(consultationId)
      .populate("patient", "name age gender village");

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found",
      });
    }

    // Step 1 — Encrypt and save the health worker's message
    const encryptedWorkerMsg = encrypt(message.trim(), consultationId);

    const workerMessage = await ChatMessage.create({
      consultation: consultationId,
      sender:       req.user.id,
      senderType:   "health_worker",
      encryptedMessage: encryptedWorkerMsg,
      messageType:  "text",
    });

    // Step 2 — Run AI analysis based on current consultation + new message
    // Append message to medicalNotes context so AI sees the full picture
    const contextNotes = consultation.medicalNotes
      ? `${consultation.medicalNotes}\nHealth Worker: ${message.trim()}`
      : `Health Worker: ${message.trim()}`;

    const aiResult = await analyzeConsultation({
      patient:      consultation.patient,
      symptoms:     consultation.symptoms,
      vitals:       consultation.vitals,
      medicalNotes: contextNotes,
    });

    // Step 3 — Build AI reply text
    const aiReplyText = [
      `📋 Summary: ${aiResult.summary}`,
      aiResult.possibleConditions.length > 0
        ? `🔍 Possible conditions: ${aiResult.possibleConditions.join(", ")}`
        : null,
      `✅ Recommended action: ${aiResult.recommendedAction}`,
      aiResult.followUpQuestions.length > 0
        ? `❓ Follow-up questions:\n${aiResult.followUpQuestions.map((q, i) => `  ${i + 1}. ${q}`).join("\n")}`
        : null,
      `⚠️ Risk level: ${aiResult.riskLevel.toUpperCase()} | Urgency: ${aiResult.urgency}`,
      `\n${aiResult.disclaimer}`,
    ].filter(Boolean).join("\n\n");

    // Step 4 — Encrypt and save AI reply
    const encryptedAIMsg = encrypt(aiReplyText, consultationId);

    const aiMessage = await ChatMessage.create({
      consultation: consultationId,
      sender:       req.user.id, // AI messages attributed to the requesting user's session
      senderType:   "ai",
      encryptedMessage: encryptedAIMsg,
      messageType:  "ai_analysis",
      aiMetadata: {
        riskLevel:      aiResult.riskLevel,
        urgency:        aiResult.urgency,
        doctorRequired: aiResult.doctorRequired,
        confidence:     aiResult.confidence,
      },
    });

    // Step 5 — Update consultation risk level if changed
    consultation.riskLevel      = aiResult.riskLevel;
    consultation.doctorRequired = aiResult.doctorRequired;
    consultation.aiAnalysis = {
      summary:            aiResult.summary,
      possibleConditions: aiResult.possibleConditions,
      recommendation:     aiResult.recommendedAction,
    };
    await consultation.save();

    // Step 6 — Return both messages decrypted (for immediate display)
    res.status(201).json({
      success: true,
      messages: [
        {
          _id:        workerMessage._id,
          senderType: "health_worker",
          message:    message.trim(), // decrypted — sent back to the sender
          messageType: "text",
          createdAt:  workerMessage.createdAt,
        },
        {
          _id:        aiMessage._id,
          senderType: "ai",
          message:    aiReplyText,   // decrypted AI reply
          messageType: "ai_analysis",
          aiMetadata: aiMessage.aiMetadata,
          createdAt:  aiMessage.createdAt,
        },
      ],
    });
  } catch (error) {
    console.error("Chat send error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid consultation ID" });
    }

    res.status(500).json({ success: false, message: "Failed to send message" });
  }
};

// ========================================
// GET CHAT HISTORY
// GET /api/chat/:consultationId
// Returns all messages decrypted
// ========================================

const getChatHistory = async (req, res) => {
  try {
    const { consultationId } = req.params;

    // Verify consultation exists
    const consultation = await Consultation.findById(consultationId);
    if (!consultation) {
      return res.status(404).json({ success: false, message: "Consultation not found" });
    }

    const messages = await ChatMessage.find({ consultation: consultationId })
      .populate("sender", "name role")
      .sort({ createdAt: 1 });

    // Decrypt every message before sending to client
    const decrypted = messages.map((msg) => {
      try {
        const plaintext = decrypt(msg.encryptedMessage, consultationId);
        return {
          _id:         msg._id,
          senderType:  msg.senderType,
          sender:      msg.sender,
          message:     plaintext,
          messageType: msg.messageType,
          aiMetadata:  msg.aiMetadata || null,
          isRead:      msg.isRead,
          createdAt:   msg.createdAt,
        };
      } catch {
        // If decryption fails for any reason, return a safe placeholder
        return {
          _id:         msg._id,
          senderType:  msg.senderType,
          message:     "[Message could not be decrypted]",
          messageType: msg.messageType,
          createdAt:   msg.createdAt,
        };
      }
    });

    // Mark all AI messages as read
    await ChatMessage.updateMany(
      { consultation: consultationId, senderType: "ai", isRead: false },
      { isRead: true }
    );

    res.json({
      success: true,
      count:   decrypted.length,
      consultationId,
      messages: decrypted,
    });
  } catch (error) {
    console.error("Get chat history error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid consultation ID" });
    }

    res.status(500).json({ success: false, message: "Failed to fetch chat history" });
  }
};

// ========================================
// GET UNREAD COUNT
// GET /api/chat/:consultationId/unread
// ========================================

const getUnreadCount = async (req, res) => {
  try {
    const count = await ChatMessage.countDocuments({
      consultation: req.params.consultationId,
      senderType:   "ai",
      isRead:       false,
    });

    res.json({ success: true, unreadCount: count });
  } catch (error) {
    console.error("Unread count error:", error);
    res.status(500).json({ success: false, message: "Failed to get unread count" });
  }
};

module.exports = { sendMessage, getChatHistory, getUnreadCount };
