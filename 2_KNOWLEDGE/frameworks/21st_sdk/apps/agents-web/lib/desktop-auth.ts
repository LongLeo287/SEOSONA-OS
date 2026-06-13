import { prisma } from "@/lib/prisma"
import { randomBytes, createHash, timingSafeEqual } from "crypto"

// Auth code expires in 5 minutes (short-lived for security)
const AUTH_CODE_EXPIRY_MINUTES = 5

// Session token expires in 7 days
const SESSION_EXPIRY_DAYS = 7

// Refresh token expires in 30 days
const REFRESH_TOKEN_EXPIRY_DAYS = 30

/**
 * Hash a token using SHA-256 for secure storage
 * Only the hash is stored in DB; plaintext is returned to client
 */
function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex")
}

/**
 * Constant-time comparison to prevent timing attacks
 */
function secureCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, "hex")
    const bufB = Buffer.from(b, "hex")
    if (bufA.length !== bufB.length) return false
    return timingSafeEqual(bufA, bufB)
  } catch {
    return false
  }
}

export interface DesktopAuthCodeData {
  code: string
  expiresAt: Date
}

export interface DesktopSessionData {
  id: string
  token: string
  refreshToken: string
  expiresAt: Date
  user: {
    id: string
    email: string
    name: string | null
    imageUrl: string | null
    username: string | null
  }
}

/**
 * Generate a secure random token
 */
function generateToken(length: number = 32): string {
  return randomBytes(length).toString("hex")
}

/**
 * Retry database operation with exponential backoff
 */
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error: any) {
      const isConnectionError =
        error?.code === "P1017" ||
        error?.code === "P1001" ||
        error?.code === "P1008" ||
        error?.message?.includes("Server has closed the connection") ||
        error?.message?.includes("Connection terminated") ||
        error?.message?.includes("connection timeout")

      if (!isConnectionError || attempt === maxRetries) {
        throw error
      }

      const delay = baseDelay * Math.pow(2, attempt - 1)
      console.warn(
        `Database operation failed (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms:`,
        error.message,
      )
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw new Error("Max retries exceeded")
}

/**
 * Create a one-time auth code for desktop authentication
 * This code is passed via deep link and exchanged for a session
 */
export async function createDesktopAuthCode(
  userId: string,
): Promise<DesktopAuthCodeData> {
  const code = generateToken(32)
  const expiresAt = new Date(
    Date.now() + AUTH_CODE_EXPIRY_MINUTES * 60 * 1000,
  )

  // Clean up old unused codes for this user first
  await withRetry(async () => {
    await prisma.desktopAuthCode.deleteMany({
      where: {
        user_id: userId,
        used_at: null,
      },
    })
  })

  await withRetry(async () => {
    await prisma.desktopAuthCode.create({
      data: {
        code,
        user_id: userId,
        expires_at: expiresAt,
      },
    })
  })

  return {
    code,
    expiresAt,
  }
}

/**
 * Exchange an auth code for a desktop session
 * The code is marked as used and cannot be reused
 * SECURITY: Uses atomic UPDATE to prevent race conditions
 */
export async function exchangeDesktopAuthCode(
  code: string,
  deviceInfo?: string,
): Promise<DesktopSessionData | null> {
  try {
    // SECURITY: Atomic update - only succeeds if code exists and is unused
    // This prevents race conditions where the same code could be exchanged twice
    const result = await withRetry(async () => {
      return await prisma.desktopAuthCode.updateMany({
        where: {
          code,
          used_at: null,
          expires_at: {
            gt: new Date(),
          },
        },
        data: { used_at: new Date() },
      })
    })

    // If no rows were updated, code was already used, expired, or doesn't exist
    // Note: The atomic updateMany above prevents race conditions - only one caller wins
    if (result.count === 0) {
      console.warn("Desktop auth code not found, expired, or already used")
      return null
    }

    // Now fetch the auth code details (it's marked as used, so this is safe)
    const authCode = await withRetry(async () => {
      return await prisma.desktopAuthCode.findFirst({
        where: { code },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              image_url: true,
              username: true,
            },
          },
        },
      })
    })

    if (!authCode) {
      console.error("Auth code disappeared after atomic update - this should not happen")
      return null
    }

    // Create a new session with hashed tokens
    // SECURITY: Only store SHA-256 hashes in DB, return plaintext to client
    const token = generateToken(32)
    const refreshToken = generateToken(32)
    const tokenHash = hashToken(token)
    const refreshTokenHash = hashToken(refreshToken)
    const expiresAt = new Date(
      Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    )

    const session = await withRetry(async () => {
      return await prisma.desktopSession.create({
        data: {
          user_id: authCode.user_id,
          token: tokenHash, // Store hash, not plaintext
          refresh_token: refreshTokenHash, // Store hash, not plaintext
          expires_at: expiresAt,
          device_info: deviceInfo,
        },
      })
    })

    return {
      id: session.id,
      token, // Return plaintext to client (only time it's available)
      refreshToken, // Return plaintext to client (only time it's available)
      expiresAt: session.expires_at,
      user: {
        id: authCode.user.id,
        email: authCode.user.email,
        name: authCode.user.name,
        imageUrl: authCode.user.image_url,
        username: authCode.user.username,
      },
    }
  } catch (error: any) {
    console.error("Failed to exchange desktop auth code:", error.message)
    return null
  }
}

/**
 * Verify a desktop session token and return user ID
 * SECURITY: Token is hashed before lookup to compare with stored hash
 */
export async function verifyDesktopToken(
  token: string,
): Promise<string | null> {
  try {
    const tokenHash = hashToken(token)
    
    const session = await withRetry(async () => {
      return await prisma.desktopSession.findFirst({
        where: {
          token: tokenHash, // Compare hash
          revoked_at: null,
          expires_at: {
            gt: new Date(),
          },
        },
      })
    })

    if (!session) {
      return null
    }

    // Update last used timestamp in background (non-critical, fire-and-forget)
    // Failure here doesn't affect auth - just analytics/cleanup heuristics
    withRetry(async () => {
      await prisma.desktopSession.update({
        where: { id: session.id },
        data: { last_used_at: new Date() },
      })
    }).catch(() => {
      // Intentionally silent - last_used_at is non-critical metadata
    })

    return session.user_id
  } catch (error: any) {
    console.error("Failed to verify desktop token:", error.message)
    return null
  }
}

/**
 * Get user data from a desktop session token
 * SECURITY: Token is hashed before lookup
 */
export async function getDesktopSessionUser(token: string): Promise<{
  id: string
  email: string
  name: string | null
  imageUrl: string | null
  username: string | null
} | null> {
  try {
    const tokenHash = hashToken(token)
    
    const session = await withRetry(async () => {
      return await prisma.desktopSession.findFirst({
        where: {
          token: tokenHash, // Compare hash
          revoked_at: null,
          expires_at: {
            gt: new Date(),
          },
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              image_url: true,
              username: true,
            },
          },
        },
      })
    })

    if (!session) {
      return null
    }

    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      imageUrl: session.user.image_url,
      username: session.user.username,
    }
  } catch (error: any) {
    console.error("Failed to get desktop session user:", error.message)
    return null
  }
}

/**
 * Refresh a desktop session using refresh token
 * SECURITY: Tokens are hashed before storage, plaintext returned to client
 */
export async function refreshDesktopSession(
  refreshToken: string,
): Promise<DesktopSessionData | null> {
  try {
    const refreshTokenHash = hashToken(refreshToken)
    
    // Calculate the cutoff date for refresh token validity
    // Refresh tokens are valid for REFRESH_TOKEN_EXPIRY_DAYS from last update
    const refreshTokenCutoff = new Date(
      Date.now() - REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    )

    const existingSession = await withRetry(async () => {
      return await prisma.desktopSession.findFirst({
        where: {
          refresh_token: refreshTokenHash, // Compare hash
          revoked_at: null,
          // Ensure the session was updated within the refresh token validity period
          updated_at: {
            gt: refreshTokenCutoff,
          },
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              image_url: true,
              username: true,
            },
          },
        },
      })
    })

    if (!existingSession) {
      console.warn("Refresh token not found or expired")
      return null
    }

    // Generate new tokens (token rotation for security)
    const newToken = generateToken(32)
    const newRefreshToken = generateToken(32)
    const newTokenHash = hashToken(newToken)
    const newRefreshTokenHash = hashToken(newRefreshToken)
    const expiresAt = new Date(
      Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    )

    await withRetry(async () => {
      return await prisma.desktopSession.update({
        where: { id: existingSession.id },
        data: {
          token: newTokenHash, // Store hash
          refresh_token: newRefreshTokenHash, // Store hash
          expires_at: expiresAt,
          updated_at: new Date(),
        },
      })
    })

    return {
      id: existingSession.id,
      token: newToken, // Return plaintext to client
      refreshToken: newRefreshToken, // Return plaintext to client
      expiresAt,
      user: {
        id: existingSession.user.id,
        email: existingSession.user.email,
        name: existingSession.user.name,
        imageUrl: existingSession.user.image_url,
        username: existingSession.user.username,
      },
    }
  } catch (error: any) {
    console.error("Failed to refresh desktop session:", error.message)
    return null
  }
}

/**
 * Revoke a desktop session
 * SECURITY: Token is hashed before lookup
 */
export async function revokeDesktopSession(token: string): Promise<boolean> {
  try {
    const tokenHash = hashToken(token)
    
    await withRetry(async () => {
      await prisma.desktopSession.updateMany({
        where: { token: tokenHash }, // Compare hash
        data: { revoked_at: new Date() },
      })
    })
    return true
  } catch (error: any) {
    console.error("Failed to revoke desktop session:", error.message)
    return false
  }
}

/**
 * Revoke all desktop sessions for a user
 */
export async function revokeAllDesktopSessions(userId: string): Promise<number> {
  try {
    const result = await withRetry(async () => {
      return await prisma.desktopSession.updateMany({
        where: {
          user_id: userId,
          revoked_at: null,
        },
        data: { revoked_at: new Date() },
      })
    })

    return result.count
  } catch (error: any) {
    console.error("Failed to revoke all desktop sessions:", error.message)
    return 0
  }
}

/**
 * Get all active desktop sessions for a user
 */
export async function getUserDesktopSessions(userId: string) {
  try {
    return await withRetry(async () => {
      return await prisma.desktopSession.findMany({
        where: {
          user_id: userId,
          revoked_at: null,
          expires_at: {
            gt: new Date(),
          },
        },
        orderBy: { created_at: "desc" },
        select: {
          id: true,
          created_at: true,
          last_used_at: true,
          device_info: true,
          expires_at: true,
        },
      })
    })
  } catch (error: any) {
    console.error("Failed to get user desktop sessions:", error.message)
    return []
  }
}

/**
 * Clean up expired auth codes and sessions
 */
export async function cleanupExpiredDesktopAuth(): Promise<{
  codes: number
  sessions: number
}> {
  try {
    const [codesResult, sessionsResult] = await Promise.all([
      withRetry(async () => {
        return await prisma.desktopAuthCode.deleteMany({
          where: {
            expires_at: {
              lt: new Date(),
            },
          },
        })
      }),
      withRetry(async () => {
        return await prisma.desktopSession.deleteMany({
          where: {
            OR: [
              {
                expires_at: {
                  lt: new Date(Date.now() - REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000),
                },
              },
              {
                revoked_at: {
                  lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Keep revoked for 7 days for audit
                },
              },
            ],
          },
        })
      }),
    ])

    return {
      codes: codesResult.count,
      sessions: sessionsResult.count,
    }
  } catch (error: any) {
    console.error("Failed to cleanup expired desktop auth:", error.message)
    return { codes: 0, sessions: 0 }
  }
}
