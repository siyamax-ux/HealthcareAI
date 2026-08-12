// ============================================================
// SETUHEALTH AI — ENCRYPTION SERVICE
// AES-256-GCM symmetric encryption for chat messages.
// Messages are encrypted before storing in MongoDB and
// decrypted only when served to an authenticated user.
//
// Key derivation: HMAC-SHA256(JWT_SECRET + consultationId)
// This means each consultation has a unique encryption key.
// Even if one key is compromised, other chats stay safe.
// ============================================================

const crypto = require("crypto");

const ALGORITHM = "aes-256-gcm";
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH  = 16; // 128 bits
const TAG_LENGTH = 16; // 128 bits auth tag

// -------------------------------------------------------
// Derive a unique 256-bit key per consultation
// using HMAC-SHA256(JWT_SECRET, consultationId)
// -------------------------------------------------------
const deriveKey = (consultationId) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set in environment");

  return crypto
    .createHmac("sha256", secret)
    .update(consultationId.toString())
    .digest(); // returns 32-byte Buffer
};

// -------------------------------------------------------
// ENCRYPT
// Returns: "iv:authTag:ciphertext" as a single hex string
// -------------------------------------------------------
const encrypt = (plaintext, consultationId) => {
  const key = deriveKey(consultationId);
  const iv  = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  // Store as: hex(iv):hex(authTag):hex(ciphertext)
  return [
    iv.toString("hex"),
    authTag.toString("hex"),
    encrypted.toString("hex"),
  ].join(":");
};

// -------------------------------------------------------
// DECRYPT
// Input: "iv:authTag:ciphertext" hex string
// Returns: original plaintext string
// -------------------------------------------------------
const decrypt = (encryptedData, consultationId) => {
  const [ivHex, authTagHex, ciphertextHex] = encryptedData.split(":");

  if (!ivHex || !authTagHex || !ciphertextHex) {
    throw new Error("Invalid encrypted data format");
  }

  const key        = deriveKey(consultationId);
  const iv         = Buffer.from(ivHex, "hex");
  const authTag    = Buffer.from(authTagHex, "hex");
  const ciphertext = Buffer.from(ciphertextHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
};

module.exports = { encrypt, decrypt };
