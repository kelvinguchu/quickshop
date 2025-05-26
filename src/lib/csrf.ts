import { NextRequest } from "next/server";
import crypto from "crypto";

const CSRF_SECRET = process.env.CSRF_SECRET || "your-csrf-secret-key-change-in-production";
const CSRF_TOKEN_HEADER = "x-csrf-token";

/**
 * Generate a CSRF token
 */
export function generateCSRFToken(): string {
  const timestamp = Date.now().toString();
  const randomBytes = crypto.randomBytes(16).toString("hex");
  const data = `${timestamp}:${randomBytes}`;
  
  const hmac = crypto.createHmac("sha256", CSRF_SECRET);
  hmac.update(data);
  const signature = hmac.digest("hex");
  
  return `${data}:${signature}`;
}

/**
 * Validate a CSRF token
 */
export function validateCSRFToken(token: string): boolean {
  try {
    const parts = token.split(":");
    if (parts.length !== 3) return false;
    
    const [timestamp, randomBytes, signature] = parts;
    const data = `${timestamp}:${randomBytes}`;
    
    // Verify signature
    const hmac = crypto.createHmac("sha256", CSRF_SECRET);
    hmac.update(data);
    const expectedSignature = hmac.digest("hex");
    
    if (signature !== expectedSignature) return false;
    
    // Check if token is not too old (1 hour expiry)
    const tokenTime = parseInt(timestamp);
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    
    return (now - tokenTime) < oneHour;
  } catch (error) {
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