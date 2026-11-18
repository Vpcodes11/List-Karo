import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const DEFAULT_SECRET = "listkaro-super-secure-32-byte-secret-key-123456";

function getEncryptionKey(): Buffer {
  const envKey = process.env.ENCRYPTION_KEY || DEFAULT_SECRET;
  // Ensure key is 32 bytes for aes-256-gcm
  return crypto.createHash("sha256").update(envKey).digest();
}

export interface EncryptedPayload {
  encryptedData: string;
  iv: string;
  authTag: string;
}

/**
 * Encrypt a sensitive string (e.g. Shopify access token) using AES-256-GCM
 */
export function encryptToken(token: string): EncryptedPayload {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(12); // 96 bits for GCM
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(token, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");

  return {
    encryptedData: encrypted,
    iv: iv.toString("hex"),
    authTag,
  };
}

/**
 * Decrypt an AES-256-GCM encrypted string
 */
export function decryptToken(encryptedData: string, ivHex: string, authTagHex: string): string {
  try {
    const key = getEncryptionKey();
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (err) {
    console.error("Token decryption failed:", err);
    throw new Error("Failed to decrypt access token");
  }
}

/**
 * Verify Shopify Webhook HMAC signature
 */
export function verifyShopifyHmac(rawBody: string, hmacHeader: string, secret: string): boolean {
  if (!rawBody || !hmacHeader || !secret) return false;
  try {
    const generatedHash = crypto
      .createHmac("sha256", secret)
      .update(rawBody, "utf8")
      .digest("base64");

    return crypto.timingSafeEqual(
      Buffer.from(generatedHash, "utf8"),
      Buffer.from(hmacHeader, "utf8")
    );
  } catch {
    return false;
  }
}

/**
 * Verify Razorpay Webhook signature
 */
export function verifyRazorpaySignature(rawBody: string, signature: string, secret: string): boolean {
  if (!rawBody || !signature || !secret) return false;
  try {
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "utf8"),
      Buffer.from(signature, "utf8")
    );
  } catch {
    return false;
  }
}
