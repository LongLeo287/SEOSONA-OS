import { beforeAll, describe, expect, it } from "vitest"
import { signStudioToken, verifyStudioToken } from "./jwt"

beforeAll(() => {
  if (!process.env.BUILDER_WIZARD_JWT_SECRET) {
    process.env.BUILDER_WIZARD_JWT_SECRET =
      "test-secret-0123456789abcdef0123456789abcdef"
  }
})

describe("studio JWT", () => {
  it("signs and verifies a token round-trip", async () => {
    const claims = {
      projectId: "project-123",
      sandboxId: "sandbox-456",
      threadId: "thread-789",
      userId: "user-123",
      teamId: "team-xyz",
    }

    const { token, expiresAt } = await signStudioToken(claims, 60)
    expect(typeof token).toBe("string")
    expect(expiresAt).toBeGreaterThan(Date.now())

    await expect(verifyStudioToken(token)).resolves.toEqual(claims)
  })

  it("rejects a tampered token", async () => {
    const { token } = await signStudioToken(
      {
        projectId: "project-123",
        sandboxId: "sandbox-456",
        threadId: "thread-789",
        userId: "user-123",
        teamId: "team-xyz",
      },
      60,
    )

    const tampered = token.slice(0, -4) + "xxxx"
    await expect(verifyStudioToken(tampered)).rejects.toThrow()
  })

  it("rejects an expired token", async () => {
    const { token } = await signStudioToken(
      {
        projectId: "project-123",
        sandboxId: "sandbox-456",
        threadId: "thread-789",
        userId: "user-123",
        teamId: "team-xyz",
      },
      0,
    )

    await new Promise((resolve) => setTimeout(resolve, 1_100))
    await expect(verifyStudioToken(token)).rejects.toThrow()
  })
})
