import {
  archiveMcpVault,
  getMcpVaultDetail,
  hardDeleteMcpVault,
  mcpMetadataSchema,
  updateMcpVault,
} from "@/lib/server/mcp-vaults"
import { NextResponse } from "next/server"
import { z } from "zod"
import { authenticateApiKey } from "../../../_lib/auth"
import { withApiErrorHandling } from "../../../_lib/errors"
import { checkApiRateLimits } from "../../../_lib/rate-limit"

const UpdateVaultSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(500).optional().nullable(),
  metadata: mcpMetadataSchema.optional(),
})

export const GET = withApiErrorHandling(
  async (
    req: Request,
    { params }: { params: Promise<{ vaultId: string }> },
  ) => {
    const auth = await authenticateApiKey(req)
    await checkApiRateLimits(auth.apiKeyId, auth.userId)

    const { vaultId } = await params
    const detail = await getMcpVaultDetail(auth.teamId, vaultId)
    if (!detail) {
      throw {
        status: 404,
        error: "not_found",
        message: "Vault not found",
      }
    }

    return NextResponse.json(detail)
  },
)

export const PATCH = withApiErrorHandling(
  async (
    req: Request,
    { params }: { params: Promise<{ vaultId: string }> },
  ) => {
    const auth = await authenticateApiKey(req)
    await checkApiRateLimits(auth.apiKeyId, auth.userId)

    const parsed = UpdateVaultSchema.safeParse(await req.json())
    if (!parsed.success) {
      throw {
        status: 400,
        error: "validation_error",
        message: parsed.error.issues.map((issue) => issue.message).join(", "),
      }
    }

    const { vaultId } = await params
    const vault = await updateMcpVault({
      teamId: auth.teamId,
      vaultId,
      ...parsed.data,
    })
    if (!vault) {
      throw {
        status: 404,
        error: "not_found",
        message: "Vault not found",
      }
    }

    return NextResponse.json({ vault })
  },
)

export const DELETE = withApiErrorHandling(
  async (
    req: Request,
    { params }: { params: Promise<{ vaultId: string }> },
  ) => {
    const auth = await authenticateApiKey(req)
    await checkApiRateLimits(auth.apiKeyId, auth.userId)

    const { vaultId } = await params
    const url = new URL(req.url)
    const force = url.searchParams.get("force") === "true"

    let result: { success: boolean } | null
    try {
      result = force
        ? await hardDeleteMcpVault({ teamId: auth.teamId, vaultId })
        : await archiveMcpVault({ teamId: auth.teamId, vaultId })
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
        message: "Vault not found",
      }
    }

    return NextResponse.json(result)
  },
)
