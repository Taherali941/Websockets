const crypto = require("crypto");

// 32-byte key (must match frontend)
const SECRET_KEY = crypto
  .createHash("sha256")
  .update("mysecretkey123")
  .digest();

const IV_LENGTH = 16;

// Encrypt
function encryptMessage(message) {
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    SECRET_KEY,
    iv
  );

  let encrypted = cipher.update(message, "utf8", "hex");
  encrypted += cipher.final("hex");

  // send iv + encrypted
  return iv.toString("hex") + ":" + encrypted;
}

// Decrypt
function decryptMessage(encryptedMessage) {
  const [ivHex, encrypted] = encryptedMessage.split(":");

  const iv = Buffer.from(ivHex, "hex");

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    SECRET_KEY,
    iv
  );

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

module.exports = { encryptMessage, decryptMessage };

// //User opens app → socket connects
// Server generates → User_xxxx
// User types message
// React encrypts message
// Sends encrypted data via WebSocket
// Server receives → decrypts (optional)
// Server broadcasts encrypted message
// Clients decrypt and display