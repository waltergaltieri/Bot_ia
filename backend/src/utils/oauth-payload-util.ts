import crypto from "crypto";
import { NoncePayload } from "../schemas";

function generateNonce(length = 16): string {
  return crypto.randomBytes(length).toString("hex");
}

export function createStateForUser(phoneNumber: string): string {
  const payload: NoncePayload = {
    phone: phoneNumber,
    nonce: generateNonce(),
    validUntil: Date.now() + 15 * 60 * 1000,
  };
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

export function decodeState(state: string): NoncePayload | null {
  try {
    const decoded = Buffer.from(state, "base64url").toString("utf-8");
    const payload: NoncePayload = JSON.parse(decoded);

    if (payload.validUntil > Date.now() && payload.nonce && payload.phone) {
      return payload;
    }
  } catch (error) {
    console.error("Failed to decode state:", error);
  }
  return null;
}
