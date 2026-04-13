import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";

function getEncryptionKeyBuffer() {
  const encryptionKey = process.env.ENCRYPTION_KEY;

  if (!encryptionKey) {
    throw new Error(
      "ENCRYPTION_KEY is not set. Add it to your Vercel environment variables and local .env file.",
    );
  }

  return Buffer.from(encryptionKey, "hex");
}

export function encrypt(text: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, getEncryptionKeyBuffer(), iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");

  // Store as iv:authTag:ciphertext for later decryption
  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

export function decrypt(encryptedText: string): string {
  const [ivHex, authTagHex, ciphertext] = encryptedText.split(":");

  const decipher = createDecipheriv(
    ALGORITHM,
    getEncryptionKeyBuffer(),
    Buffer.from(ivHex, "hex"),
  );
  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));

  let decrypted = decipher.update(ciphertext, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
