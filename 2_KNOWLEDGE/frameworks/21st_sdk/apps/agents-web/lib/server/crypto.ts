import { randomBytes, createCipheriv, createDecipheriv, createPrivateKey } from "crypto"
import { SignJWT } from "jose"

/**
 * Encryption utilities for sensitive data storage
 * Uses AES-256-CBC for encryption
 */

const ALGORITHM = "aes-256-cbc"
const IV_LENGTH = 16 // CBC requires 16-byte IV for AES

/**
 * Get encryption key from environment variable
 */
function getEncryptionKey(): Buffer {
  const keyHex = process.env.GITHUB_TOKEN_ENCRYPTION_KEY
  if (!keyHex) {
    throw new Error(
      "GITHUB_TOKEN_ENCRYPTION_KEY environment variable is required",
    )
  }

  if (keyHex.length !== 64) {
    throw new Error(
      "GITHUB_TOKEN_ENCRYPTION_KEY must be 64 characters (32 bytes) hex string",
    )
  }

  return Buffer.from(keyHex, "hex")
}

/**
 * Encrypt a string value
 * @param plaintext - The string to encrypt
 * @returns Base64 encoded encrypted data with format: iv:ciphertext
 */
export function encrypt(plaintext: string): string {
  if (!plaintext) {
    throw new Error("Cannot encrypt empty string")
  }

  const key = getEncryptionKey()
  const iv = randomBytes(IV_LENGTH)
  const cipher = createCipheriv(ALGORITHM, key, iv)

  let ciphertext = cipher.update(plaintext, "utf8", "base64")
  ciphertext += cipher.final("base64")

  // Combine iv:ciphertext as base64
  const combined = Buffer.concat([iv, Buffer.from(ciphertext, "base64")])
  return combined.toString("base64")
}

/**
 * Decrypt a string value
 * @param encryptedData - Base64 encoded data with format: iv:ciphertext
 * @returns Original plaintext string
 */
export function decrypt(encryptedData: string): string {
  if (!encryptedData) {
    throw new Error("Cannot decrypt empty string")
  }

  const key = getEncryptionKey()
  const combined = Buffer.from(encryptedData, "base64")

  if (combined.length < IV_LENGTH) {
    throw new Error("Invalid encrypted data format")
  }

  const iv = combined.subarray(0, IV_LENGTH)
  const ciphertext = combined.subarray(IV_LENGTH)

  const decipher = createDecipheriv(ALGORITHM, key, iv)

  let plaintext = decipher.update(ciphertext, undefined, "utf8")
  plaintext += decipher.final("utf8")

  return plaintext
}

/**
 * Helper functions specifically for GitHub tokens
 */

export function encryptGitHubToken(token: string): string {
  return encrypt(token)
}

export function decryptGitHubToken(encryptedToken: string): string {
  return decrypt(encryptedToken)
}

export function encryptCursorApiKey(apiKey: string): string {
  return encrypt(apiKey)
}

export function decryptCursorApiKey(encryptedApiKey: string): string {
  return decrypt(encryptedApiKey)
}

export function encryptClaudeCodeCredentials(credentials: string): string {
  return encrypt(credentials)
}

export function decryptClaudeCodeCredentials(
  encryptedCredentials: string,
): string {
  return decrypt(encryptedCredentials)
}

/**
 * Linear token encryption
 */
export function encryptLinearToken(token: string): string {
  return encrypt(token)
}

export function decryptLinearToken(encryptedToken: string): string {
  return decrypt(encryptedToken)
}

/**
 * Claude Proxy JWT signing
 * Signs a JWT with userId for proxy authentication
 */

function getClaudeProxyPrivateKey() {
  const keyPem = process.env.CLAUDE_PROXY_PRIVATE_JWT?.replace(/\\n/g, "\n")
  if (!keyPem) {
    throw new Error("CLAUDE_PROXY_PRIVATE_JWT environment variable is required")
  }
  return createPrivateKey(keyPem)
}

/**
 * Sign a JWT for Claude proxy authentication
 * @param userId - The user ID to include in the token
 * @param sandboxId - Optional sandbox ID to bind token to specific sandbox
 * @param expiresIn - Token expiration (default: 1 hour for security)
 * @returns Signed JWT string
 * 
 * SECURITY: Short TTL (1h) limits exposure if token is compromised.
 * Tokens are scoped to specific sandbox when provided.
 */
export async function signClaudeProxyJwt(
  userId: string,
  sandboxId?: string,
  expiresIn: string = "1h"
): Promise<string> {
  const privateKey = getClaudeProxyPrivateKey()

  const payload: { userId: string; sandboxId?: string } = { userId }
  if (sandboxId) {
    payload.sandboxId = sandboxId
  }

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "RS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(privateKey)

  return token
}
