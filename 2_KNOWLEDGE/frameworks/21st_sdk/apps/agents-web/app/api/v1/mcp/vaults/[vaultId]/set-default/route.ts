import { setDefaultMcpVault } from "@/lib/server/mcp-vaults"
import { NextResponse } from "next/server"
import { authenticateApiKey } from "../../../../_lib/auth"
import { withApiErrorHandling } from "../../../../_lib/errors"
import { checkApiRateLimits } from "../../../../_lib/rate-limit"

export const POST = withApiErrorHandling(
  async (
    req: Request,
    { params }: { params: Promise<{ vaultId: string }> },
  ) => {
    const auth = await authenticateApiKey(req)
    await checkApiRateLimits(auth.apiKeyId, auth.userId)

    const { vaultId } = await params
    const result = await setDefaultMcpVault({
      teamId: auth.teamId,
      vaultId,
    })

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
