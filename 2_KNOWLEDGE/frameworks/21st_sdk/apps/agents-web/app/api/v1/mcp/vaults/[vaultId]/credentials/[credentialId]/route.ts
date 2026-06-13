import {
  archiveMcpCredential,
  createOrUpdateMcpCredential,
  hardDeleteMcpCredential,
  mcpCredentialInjectSchema,
  mcpMetadataSchema,
} from "@/lib/server/mcp-vaults"
import { NextResponse } from "next/server"
import { z } from "zod"
import { authenticateApiKey } from "../../../../../_lib/auth"
import { withApiErrorHandling } from "../../../../../_lib/errors"
import { checkApiRateLimits } from "../../../../../_lib/rate-limit"

const UpdateCredentialSchema = z.object({
  name: z.string().max(200).optional().nullable(),
  serverUrl: z.string().url(),
  auth: z.discriminatedUnion("type", [
    z.object({
      type: z.literal("bearer"),
      token: z.string().min(1),
    }),
    z.object({
      type: z.literal("oauth"),
      accessToken: z.string().optional(),
      refreshToken: z.string().optional(),
      clientId: z.string().optional(),
      clientSecret: z.string().optional(),
      tokenEndpoint: z.string().url().optional(),
      tokenEndpointAuth: z
        .enum(["none", "client_secret_basic", "client_secret_post"])
        .optional(),
      tokenType: z.string().optional(),
      expiresAt: z.string().optional(),
      scope: z.string().optional(),
      resource: z.string().optional(),
    }),
  ]),
  inject: mcpCredentialInjectSchema.optional(),
  metadata: mcpMetadataSchema.optional(),
})

function mapCredentialError(error: unknown): never {
  const message = error instanceof Error ? error.message : String(error)

  if (message.includes("already exists")) {
    throw { status: 409, error: "conflict", message }
  }

  if (message.includes("not found")) {
    throw { status: 404, error: "not_found", message }
  }

  throw { status: 400, error: "validation_error", message }
}

export const PATCH = withApiErrorHandling(
  async (
    req: Request,
    { params }: { params: Promise<{ vaultId: string; credentialId: string }> },
  ) => {
    const auth = await authenticateApiKey(req)
    await checkApiRateLimits(auth.apiKeyId, auth.userId)

    const { vaultId, credentialId } = await params
    const parsed = UpdateCredentialSchema.safeParse(await req.json())
    if (!parsed.success) {
      throw {
        status: 400,
        error: "validation_error",
        message: parsed.error.issues.map((issue) => issue.message).join(", "),
      }
    }

    try {
      const credential = await createOrUpdateMcpCredential({
        teamId: auth.teamId,
        vaultId,
        credentialId,
        ...parsed.data,
      })

      return NextResponse.json({ credential })
    } catch (error) {
      mapCredentialError(error)
    }
  },
)

export const DELETE = withApiErrorHandling(
  async (
    req: Request,
    { params }: { params: Promise<{ vaultId: string; credentialId: string }> },
  ) => {
    const auth = await authenticateApiKey(req)
    await checkApiRateLimits(auth.apiKeyId, auth.userId)

    const { vaultId, credentialId } = await params
    const url = new URL(req.url)
    const force = url.searchParams.get("force") === "true"

    let result: { success: boolean } | null
    try {
      result = force
        ? await hardDeleteMcpCredential({
            teamId: auth.teamId,
            vaultId,
            credentialId,
          })
        : await archiveMcpCredential({
            teamId: auth.teamId,
            vaultId,
            credentialId,
          })
    } catch (error) {
      throw {
        status: 409,
        error: "conflict",
        message: error instanceof Error ? error.message : String(error),
      }
    }

    if (!result) {
      throw {
        status: 404,
        error: "not_found",
        message: "Credential not found",
      }
    }

    return NextResponse.json(result)
  },
)
