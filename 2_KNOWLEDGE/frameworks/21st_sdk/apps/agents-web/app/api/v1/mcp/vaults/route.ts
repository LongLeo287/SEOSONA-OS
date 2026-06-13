import {
  createMcpVault,
  listMcpVaults,
  mcpMetadataSchema,
} from "@/lib/server/mcp-vaults"
import { NextResponse } from "next/server"
import { z } from "zod"
import { authenticateApiKey } from "../../_lib/auth"
import { withApiErrorHandling } from "../../_lib/errors"
import { checkApiRateLimits } from "../../_lib/rate-limit"

const CreateVaultSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(500).optional().nullable(),
  metadata: mcpMetadataSchema.optional(),
})

export const GET = withApiErrorHandling(async (req: Request) => {
  const auth = await authenticateApiKey(req)
  await checkApiRateLimits(auth.apiKeyId, auth.userId)

  return NextResponse.json(await listMcpVaults(auth.teamId))
})

export const POST = withApiErrorHandling(async (req: Request) => {
  const auth = await authenticateApiKey(req)
  await checkApiRateLimits(auth.apiKeyId, auth.userId)

  const parsed = CreateVaultSchema.safeParse(await req.json())
  if (!parsed.success) {
    throw {
      status: 400,
      error: "validation_error",
      message: parsed.error.issues.map((issue) => issue.message).join(", "),
    }
  }

  const vault = await createMcpVault({
    teamId: auth.teamId,
    ...parsed.data,
  })

  return NextResponse.json({ vault }, { status: 201 })
})
