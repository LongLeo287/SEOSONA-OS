import { prisma } from "@/lib/prisma"
import { randomBytes } from "crypto"

const TOKEN_EXPIRY_HOURS = 24 * 7 // 7 days
// const REFRESH_TOKEN_EXPIRY_HOURS = 24 * 30 // 30 days

export interface ToolbarTokenData {
  id: string
  token: string
  refreshToken?: string
  expiresAt: Date
  userId: string
}

/**
 * Generate a secure random token
 */
function generateToken(): string {
  return randomBytes(32).toString("hex")
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
      // Check if this is a connection error that we should retry
      const isConnectionError =
        error?.code === "P1017" || // Server has closed the connection
        error?.code === "P1001" || // Can't reach database server
        error?.code === "P1008" || // Operations timed out
        error?.message?.includes("Server has closed the connection") ||
        error?.message?.includes("Connection terminated") ||
        error?.message?.includes("connection timeout")

      if (!isConnectionError || attempt === maxRetries) {
        throw error
      }

      // Exponential backoff
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
 * Create a new toolbar token for a user
 */
export async function createToolbarToken(
  userId: string,
  userAgent?: string,
): Promise<ToolbarTokenData> {
  const token = generateToken()
  const refreshToken = generateToken()
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000)

  const toolbarToken = await withRetry(async () => {
    return await prisma.toolbarToken.create({
      data: {
        user_id: userId,
        token,
        refresh_token: refreshToken,
        expires_at: expiresAt,
        user_agent: userAgent,
      },
    })
  })

  return {
    id: toolbarToken.id,
    token: toolbarToken.token,
    refreshToken: toolbarToken.refresh_token || undefined,
    expiresAt: toolbarToken.expires_at,
    userId: toolbarToken.user_id,
  }
}

/**
 * Verify and get user by toolbar token
 */
export async function verifyToolbarToken(
  token: string,
): Promise<string | null> {
  try {
    const toolbarToken = await withRetry(async () => {
      return await prisma.toolbarToken.findFirst({
        where: {
          token,
          expires_at: {
            gt: new Date(),
          },
        },
      })
    })

    if (!toolbarToken) {
      return null
    }

    // Update last used timestamp in background (don't wait for it)
    withRetry(async () => {
      await prisma.toolbarToken.update({
        where: { id: toolbarToken.id },
        data: { last_used_at: new Date() },
      })
    }).catch((error) => {
      console.warn("Failed to update last_used_at:", error.message)
    })

    return toolbarToken.user_id
  } catch (error: any) {
    console.error("Failed to verify toolbar token:", error.message)
    return null
  }
}

/**
 * Refresh a toolbar token using refresh token
 */
export async function refreshToolbarToken(
  refreshToken: string,
): Promise<ToolbarTokenData | null> {
  try {
    const existingToken = await withRetry(async () => {
      return await prisma.toolbarToken.findFirst({
        where: {
          refresh_token: refreshToken,
        },
      })
    })

    if (!existingToken) {
      return null
    }

    // Generate new tokens
    const newToken = generateToken()
    const newRefreshToken = generateToken()
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000)

    const updatedToken = await withRetry(async () => {
      return await prisma.toolbarToken.update({
        where: { id: existingToken.id },
        data: {
          token: newToken,
          refresh_token: newRefreshToken,
          expires_at: expiresAt,
          updated_at: new Date(),
        },
      })
    })

    return {
      id: updatedToken.id,
      token: updatedToken.token,
      refreshToken: updatedToken.refresh_token || undefined,
      expiresAt: updatedToken.expires_at,
      userId: updatedToken.user_id,
    }
  } catch (error: any) {
    console.error("Failed to refresh toolbar token:", error.message)
    return null
  }
}

/**
 * Revoke a toolbar token
 */
export async function revokeToolbarToken(token: string): Promise<boolean> {
  try {
    await withRetry(async () => {
      await prisma.toolbarToken.delete({
        where: { token },
      })
    })
    return true
  } catch (error: any) {
    console.error("Failed to revoke toolbar token:", error.message)
    return false
  }
}

/**
 * Clean up expired tokens
 */
export async function cleanupExpiredTokens(): Promise<number> {
  try {
    const result = await withRetry(async () => {
      return await prisma.toolbarToken.deleteMany({
        where: {
          expires_at: {
            lt: new Date(),
          },
        },
      })
    })

    return result.count
  } catch (error: any) {
    console.error("Failed to cleanup expired tokens:", error.message)
    return 0
  }
}

/**
 * Get all toolbar tokens for a user
 */
export async function getUserToolbarTokens(userId: string) {
  try {
    return await withRetry(async () => {
      return await prisma.toolbarToken.findMany({
        where: {
          user_id: userId,
          expires_at: {
            gt: new Date(),
          },
        },
        orderBy: { created_at: "desc" },
        select: {
          id: true,
          created_at: true,
          last_used_at: true,
          user_agent: true,
          expires_at: true,
        },
      })
    })
  } catch (error: any) {
    console.error("Failed to get user toolbar tokens:", error.message)
    return []
  }
}

/**
 * Revoke all toolbar tokens for a user
 */
export async function revokeAllUserTokens(userId: string): Promise<number> {
  try {
    const result = await withRetry(async () => {
      return await prisma.toolbarToken.deleteMany({
        where: { user_id: userId },
      })
    })

    return result.count
  } catch (error: any) {
    console.error("Failed to revoke all user tokens:", error.message)
    return 0
  }
}
