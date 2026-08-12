const multer = require("multer");
const path = require("path");
const fs = require("fs");
const os = require("os");

// ===============================
// STORAGE STRATEGY
// On Vercel (and other serverless platforms) the project root is
// read-only. The only writable location is /tmp (os.tmpdir()).
// Locally we still write to uploads/ for ease of debugging.
// ===============================
const IS_SERVERLESS = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

const uploadDir = IS_SERVERLESS
  ? os.tmpdir()                           // /tmp on Vercel
  : path.join(__dirname, "../uploads");   // uploads/ locally

if (!IS_SERVERLESS && !fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ===============================
// DISK STORAGE CONFIGURATION
// ===============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    // e.g. "1718000000000-report.pdf"
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
    cb(null, uniqueName);
  },
});

// ===============================
// FILE TYPE WHITELIST
// ===============================
// Only allow images and PDFs.
// Any other MIME type is rejected before it touches the disk.
const allowedMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
];

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // accept
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPEG, PNG, WEBP, and PDF files are allowed."
      ),
      false // reject
    );
  }
};

// ===============================
// MULTER INSTANCE
// ===============================
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB maximum
  },
});

// ===============================
// UPLOAD ERROR HANDLER
// ===============================
// Wrap multer's single-file upload so we can return a clean JSON error
// instead of letting Express crash with an unhandled MulterError.
const uploadSingle = (fieldName) => (req, res, next) => {
  upload.single(fieldName)(req, res, (err) => {
    if (!err) return next();

    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large. Maximum size is 10 MB.",
      });
    }

    // fileFilter rejection or any other Multer error
    return res.status(400).json({
      success: false,
      message: err.message || "File upload failed.",
    });
  });
};

module.exports = { uploadSingle };
