import { NextRequest } from "next/server";
import crypto from "crypto";

const CSRF_SECRET = process.env.CSRF_SECRET;

if (!CSRF_SECRET) {
  throw new Error("CSRF_SECRET environment variable is required");
}

if (CSRF_SECRET.length < 32) {
  throw new Error("CSRF_SECRET must be at least 32 characters long");
}

// Type assertion is safe here since we've validated CSRF_SECRET exists above
const csrfSecret: string = CSRF_SECRET;
const CSRF_TOKEN_HEADER = "x-csrf-token";

/**
 * Generate a CSRF token
 */
export function generateCSRFToken(): string {
  const timestamp = Date.now().toString();
  const randomBytes = crypto.randomBytes(16).toString("hex");
  const data = `${timestamp}:${randomBytes}`;

  const hmac = crypto.createHmac("sha256", csrfSecret);
  hmac.update(data);
  const signature = hmac.digest("hex");

  return `${data}:${signature}`;
}

/**
 * Validate a CSRF token
 */
export function validateCSRFToken(token: string): boolean {
  try {
    if (!token || typeof token !== "string") return false;
    if (token.length > 1000) return false; // Prevent DoS with very long tokens

    const parts = token.split(":");
    if (parts.length !== 3) return false;

    const [timestamp, randomBytes, signature] = parts;

    // Validate timestamp format
    if (!/^\d+$/.test(timestamp)) return false;

    // Validate hex format
    if (!/^[a-f0-9]+$/i.test(randomBytes) || !/^[a-f0-9]+$/i.test(signature))
      return false;

    const data = `${timestamp}:${randomBytes}`;

    // Verify signature
    const hmac = crypto.createHmac("sha256", csrfSecret);
    hmac.update(data);
    const expectedSignature = hmac.digest("hex");

    if (
      !crypto.timingSafeEqual(
        Buffer.from(signature, "hex"),
        Buffer.from(expectedSignature, "hex")
      )
    ) {
      return false;
    }

    // Check if token is not too old (1 hour expiry)
    const tokenTime = parseInt(timestamp);
    if (isNaN(tokenTime)) return false;

    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    return now - tokenTime < oneHour;
  } catch (error) {
    console.error("CSRF token validation error:", error);
    return false;
  }
}

/**
 * Extract CSRF token from request headers
 */
export function getCSRFTokenFromRequest(request: NextRequest): string | null {
  return request.headers.get(CSRF_TOKEN_HEADER);
}

/**
 * Validate CSRF token from request
 */
export function validateCSRFFromRequest(request: NextRequest): boolean {
  const token = getCSRFTokenFromRequest(request);
  if (!token) return false;
  return validateCSRFToken(token);
}
