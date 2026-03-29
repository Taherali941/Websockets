import CryptoJS from "crypto-js";

// MUST match backend logic
const SECRET_KEY = CryptoJS.SHA256("mysecretkey123");

// Encrypt
export const encryptMessage = (message) => {
  const iv = CryptoJS.lib.WordArray.random(16);

  const encrypted = CryptoJS.AES.encrypt(message, SECRET_KEY, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return iv.toString(CryptoJS.enc.Hex) + ":" + encrypted.ciphertext.toString(CryptoJS.enc.Hex);
};

// Decrypt
export const decryptMessage = (encryptedMessage) => {
  const [ivHex, encryptedHex] = encryptedMessage.split(":");

  const iv = CryptoJS.enc.Hex.parse(ivHex);
  const encrypted = CryptoJS.enc.Hex.parse(encryptedHex);

  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext: encrypted },
    SECRET_KEY,
    {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );

  return decrypted.toString(CryptoJS.enc.Utf8);
};