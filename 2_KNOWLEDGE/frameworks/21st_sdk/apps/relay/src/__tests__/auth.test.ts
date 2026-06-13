import type { NextFunction, Request, Response } from "express"
import { afterEach, describe, expect, it, vi } from "vitest"
import { exportPKCS8, generateKeyPair, SignJWT } from "jose"

vi.mock("../db", () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(async () => []),
        })),
      })),
    })),
    update: vi.fn(),
  },
}))

const ORIGINAL_ENV = { ...process.env }

function createResponse() {
  const res = {
    statusCode: 200,
    body: undefined as unknown,
    status: vi.fn((code: number) => {
      res.statusCode = code
      return res
    }),
    json: vi.fn((body: unknown) => {
      res.body = body
      return res
    }),
  }

  return res as unknown as Response & { statusCode: number; body: unknown }
}

async function createSignedProxyJwt(audience: string) {
  const { privateKey } = await generateKeyPair("RS256", { extractable: true })
  process.env.CLAUDE_PROXY_PRIVATE_JWT = await exportPKCS8(privateKey)

  const token = await new SignJWT({
    teamId: "team-a",
    clientSandboxId: "client-sandbox-a",
  })
    .setProtectedHeader({ alg: "RS256" })
    .setAudience(audience)
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(privateKey)

  return token
}

afterEach(() => {
  process.env = { ...ORIGINAL_ENV }
  vi.resetModules()
  vi.restoreAllMocks()
})

describe("authMiddleware proxy JWT audience", () => {
  it("accepts relay-scoped proxy JWTs", async () => {
    const token = await createSignedProxyJwt("relay-proxy")
    const { authMiddleware } = await import("../auth")
    const req = {
      headers: { authorization: `Bearer ${token}` },
    } as Request & { teamId?: string; proxyJwtClaims?: Record<string, unknown> }
    const res = createResponse()
    const next = vi.fn() as NextFunction

    await authMiddleware(req, res, next)

    expect(next).toHaveBeenCalledOnce()
    expect(req.teamId).toBe("team-a")
    expect(req.proxyJwtClaims?.aud).toBe("relay-proxy")
  })

  it("rejects vault-proxy-scoped JWTs as relay auth", async () => {
    const token = await createSignedProxyJwt("vault-proxy")
    const { authMiddleware } = await import("../auth")
    const req = {
      headers: { authorization: `Bearer ${token}` },
    } as Request
    const res = createResponse()
    const next = vi.fn() as NextFunction

    await authMiddleware(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.statusCode).toBe(401)
  })
})
