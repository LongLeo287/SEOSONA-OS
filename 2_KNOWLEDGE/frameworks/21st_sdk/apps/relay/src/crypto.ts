import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto"

const ALGORITHM = "aes-256-cbc"
const IV_LENGTH = 16

function getEncryptionKey(): Buffer {
  const keyHex = process.env.GITHUB_TOKEN_ENCRYPTION_KEY
  if (!keyHex) {
    throw new Error("GITHUB_TOKEN_ENCRYPTION_KEY is required")
  }
  if (keyHex.length !== 64) {
    throw new Error("GITHUB_TOKEN_ENCRYPTION_KEY must be 64 hex characters")
  }
  return Buffer.from(keyHex, "hex")
}

export function encrypt(plaintext: string): string {
  if (!plaintext) {
    throw new Error("Cannot encrypt empty string")
  }

  const iv = randomBytes(IV_LENGTH)
  const cipher = createCipheriv(ALGORITHM, getEncryptionKey(), iv)
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ])
  return Buffer.concat([iv, ciphertext]).toString("base64")
}

export function decrypt(encryptedData: string): string {
  if (!encryptedData) {
    throw new Error("Cannot decrypt empty string")
  }

  const combined = Buffer.from(encryptedData, "base64")
  if (combined.length < IV_LENGTH) {
    throw new Error("Invalid encrypted data format")
  }

  const iv = combined.subarray(0, IV_LENGTH)
  const ciphertext = combined.subarray(IV_LENGTH)
  const decipher = createDecipheriv(ALGORITHM, getEncryptionKey(), iv)

  return Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]).toString("utf8")
}
