const crypto = require("crypto");

const ALGORITHM = "aes-256-gcm";

const getKey = () => {
  const hex = process.env.DEVICE_SECRET_KEY;
  if (!hex || hex.length !== 64) {
    throw new Error(
      "DEVICE_SECRET_KEY must be set in .env as a 64-character hex string (32 bytes)",
    );
  }
  return Buffer.from(hex, "hex");
};

// Encrypts a plaintext string into "iv:authTag:ciphertext" (all hex)
const encrypt = (plainText) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const ciphertext = Buffer.concat([
    cipher.update(String(plainText), "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${ciphertext.toString("hex")}`;
};

// Decrypts a string produced by encrypt(); returns null if the value isn't in encrypted form
const decrypt = (payload) => {
  if (typeof payload !== "string" || payload.split(":").length !== 3) {
    return null;
  }
  const [ivHex, authTagHex, ciphertextHex] = payload.split(":");
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    getKey(),
    Buffer.from(ivHex, "hex"),
  );
  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));
  const plainText = Buffer.concat([
    decipher.update(Buffer.from(ciphertextHex, "hex")),
    decipher.final(),
  ]);
  return plainText.toString("utf8");
};

module.exports = { encrypt, decrypt };
