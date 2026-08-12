const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ===============================
// ENSURE uploads/ DIRECTORY EXISTS
// ===============================
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ===============================
// DISK STORAGE CONFIGURATION
// ===============================
// Files are saved to the uploads/ folder.
// The filename is timestamped to prevent collisions.
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
