import {
  createOrUpdateMcpCredential,
  mcpCredentialInjectSchema,
  mcpMetadataSchema,
} from "@/lib/server/mcp-vaults"
import { NextResponse } from "next/server"
import { z } from "zod"
import { authenticateApiKey } from "../../../../_lib/auth"
import { withApiErrorHandling } from "../../../../_lib/errors"
import { checkApiRateLimits } from "../../../../_lib/rate-limit"

const CredentialSchema = z.object({
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

  if (message.includes("20 active credentials")) {
    throw { status: 422, error: "credential_cap_exceeded", message }
  }

  throw { status: 400, error: "validation_error", message }
}

export const POST = withApiErrorHandling(
  async (
    req: Request,
    { params }: { params: Promise<{ vaultId: string }> },
  ) => {
    const auth = await authenticateApiKey(req)
    await checkApiRateLimits(auth.apiKeyId, auth.userId)

    const { vaultId } = await params
    const parsed = CredentialSchema.safeParse(await req.json())
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
        ...parsed.data,
      })

      return NextResponse.json({ credential }, { status: 201 })
    } catch (error) {
      mapCredentialError(error)
    }
  },
)
