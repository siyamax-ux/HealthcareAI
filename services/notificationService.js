// ============================================================
// SETUHEALTH AI — NOTIFICATION SERVICE
//
// Current mode: Console logging + in-app notification objects.
// No external dependencies — works fully offline.
//
// Architecture: Every function returns a notification object
// in a consistent shape. The caller (controller) can store
// it, send it via WebSocket, or simply log it.
//
// To add real SMS (Twilio) or email (SendGrid) later:
// just replace the internals of sendSMS() / sendEmail()
// without changing any controller code.
// ============================================================

// -------------------------------------------------------
// NOTIFICATION TYPES
// -------------------------------------------------------
const TYPES = {
  EMERGENCY_ALERT:     "EMERGENCY_ALERT",
  HIGH_RISK_DETECTED:  "HIGH_RISK_DETECTED",
  DOCTOR_REQUIRED:     "DOCTOR_REQUIRED",
  REFERRAL_CREATED:    "REFERRAL_CREATED",
  APPOINTMENT_BOOKED:  "APPOINTMENT_BOOKED",
  OCR_COMPLETE:        "OCR_COMPLETE",
  AI_ANALYSIS_DONE:    "AI_ANALYSIS_DONE",
};

// -------------------------------------------------------
// HELPER: build a structured notification object
// -------------------------------------------------------
const buildNotification = (type, payload) => ({
  type,
  timestamp: new Date().toISOString(),
  ...payload,
});

// -------------------------------------------------------
// HELPER: console log with colour coding by severity
// -------------------------------------------------------
const logNotification = (notification) => {
  const prefix =
    notification.type === TYPES.EMERGENCY_ALERT  ? "🚨 [EMERGENCY]" :
    notification.type === TYPES.HIGH_RISK_DETECTED ? "⚠️  [HIGH RISK]" :
    notification.type === TYPES.DOCTOR_REQUIRED   ? "👨‍⚕️ [DOCTOR REQ]" :
    "🔔 [NOTIFY]";

  console.log(`${prefix} ${notification.type} | ${notification.message}`);
};

// -------------------------------------------------------
// EMERGENCY ALERT
// Called when a consultation is flagged as critical
// -------------------------------------------------------
const sendEmergencyAlert = ({ patientName, consultationId, riskSignals = [], emergencyContact }) => {
  const notification = buildNotification(TYPES.EMERGENCY_ALERT, {
    message: `EMERGENCY: Patient ${patientName} requires immediate attention.`,
    consultationId,
    riskSignals,
    emergencyContact: emergencyContact || null,
    action: "Contact emergency services or nearest doctor immediately.",
  });

  logNotification(notification);

  // TODO: plug in Twilio SMS here when ready
  // await sendSMS(emergencyContact.phone, notification.message);

  return notification;
};

// -------------------------------------------------------
// HIGH RISK DETECTED
// Called when AI/Risk Engine flags a high-risk case
// -------------------------------------------------------
const sendHighRiskAlert = ({ patientName, consultationId, riskLevel, riskSignals = [] }) => {
  const notification = buildNotification(TYPES.HIGH_RISK_DETECTED, {
    message: `High risk detected for patient ${patientName}. Risk level: ${riskLevel.toUpperCase()}.`,
    consultationId,
    riskLevel,
    riskSignals,
    action: "Review consultation and consider doctor referral.",
  });

  logNotification(notification);
  return notification;
};

// -------------------------------------------------------
// DOCTOR REQUIRED
// Called when AI or health worker marks doctorRequired = true
// -------------------------------------------------------
const sendDoctorRequiredAlert = ({ patientName, consultationId, recommendedAction }) => {
  const notification = buildNotification(TYPES.DOCTOR_REQUIRED, {
    message: `Doctor consultation required for patient ${patientName}.`,
    consultationId,
    recommendedAction,
    action: "Assign an available doctor or create a referral.",
  });

  logNotification(notification);
  return notification;
};

// -------------------------------------------------------
// REFERRAL CREATED
// Called when a new referral is created
// -------------------------------------------------------
const sendReferralNotification = ({ patientName, referralId, urgency, referralFacility }) => {
  const notification = buildNotification(TYPES.REFERRAL_CREATED, {
    message: `Referral created for patient ${patientName}. Urgency: ${urgency}.`,
    referralId,
    urgency,
    referralFacility: referralFacility || "Not specified",
    action: urgency === "emergency"
      ? "Arrange immediate transport for the patient."
      : "Ensure patient attends scheduled referral.",
  });

  logNotification(notification);
  return notification;
};

// -------------------------------------------------------
// APPOINTMENT BOOKED
// Called when a new appointment is scheduled
// -------------------------------------------------------
const sendAppointmentNotification = ({ patientName, appointmentId, doctorName, scheduledAt }) => {
  const notification = buildNotification(TYPES.APPOINTMENT_BOOKED, {
    message: `Appointment booked for ${patientName} with Dr. ${doctorName} on ${new Date(scheduledAt).toLocaleString()}.`,
    appointmentId,
    doctorName,
    scheduledAt,
    action: "Remind patient 24 hours before the appointment.",
  });

  logNotification(notification);
  return notification;
};

// -------------------------------------------------------
// AI ANALYSIS COMPLETE
// Called after Aarogya finishes analyzing a consultation
// -------------------------------------------------------
const sendAIAnalysisNotification = ({ patientName, consultationId, riskLevel, urgency }) => {
  const notification = buildNotification(TYPES.AI_ANALYSIS_DONE, {
    message: `AI analysis complete for patient ${patientName}. Risk: ${riskLevel}, Urgency: ${urgency}.`,
    consultationId,
    riskLevel,
    urgency,
    action: urgency === "emergency" || urgency === "urgent"
      ? "Review AI findings and take immediate action."
      : "Review AI findings at next available opportunity.",
  });

  logNotification(notification);
  return notification;
};

module.exports = {
  TYPES,
  sendEmergencyAlert,
  sendHighRiskAlert,
  sendDoctorRequiredAlert,
  sendReferralNotification,
  sendAppointmentNotification,
  sendAIAnalysisNotification,
};
