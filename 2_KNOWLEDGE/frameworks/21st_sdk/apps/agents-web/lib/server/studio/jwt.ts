import { SignJWT, jwtVerify } from "jose"

const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 365 // 1 year
const ALG = "HS256"

export type StudioJwtClaims = {
  projectId: string
  sandboxId: string
  threadId: string
  userId: string
  teamId: string
}

function getSecret(): Uint8Array {
  const secret = process.env.BUILDER_WIZARD_JWT_SECRET
  if (!secret) {
    throw new Error(
      "BUILDER_WIZARD_JWT_SECRET environment variable is required for Studio sessions",
    )
  }
  return new TextEncoder().encode(secret)
}

export async function signStudioToken(
  claims: StudioJwtClaims,
  ttlSeconds: number = DEFAULT_TTL_SECONDS,
): Promise<{ token: string; expiresAt: number }> {
  const now = Math.floor(Date.now() / 1000)
  const exp = now + ttlSeconds
  const token = await new SignJWT({ ...claims })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt(now)
    .setExpirationTime(exp)
    .setSubject(claims.userId)
    .sign(getSecret())

  return {
    token,
    expiresAt: exp * 1000,
  }
}

export async function verifyStudioToken(token: string): Promise<StudioJwtClaims> {
  const { payload } = await jwtVerify(token, getSecret(), { algorithms: [ALG] })

  if (
    typeof payload.projectId !== "string" ||
    typeof payload.sandboxId !== "string" ||
    typeof payload.threadId !== "string" ||
    typeof payload.userId !== "string" ||
    typeof payload.teamId !== "string"
  ) {
    throw new Error("Invalid Studio token payload")
  }

  return {
    projectId: payload.projectId,
    sandboxId: payload.sandboxId,
    threadId: payload.threadId,
    userId: payload.userId,
    teamId: payload.teamId,
  }
}
