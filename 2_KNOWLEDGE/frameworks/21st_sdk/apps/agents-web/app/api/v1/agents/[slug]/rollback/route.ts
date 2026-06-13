import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { z } from "zod"
import { authenticateApiKey } from "../../../_lib/auth"
import { apiError, validateSlugParam, withApiErrorHandling } from "../../../_lib/errors"
import { checkApiRateLimits } from "../../../_lib/rate-limit"

const RollbackSchema = z.object({
  version: z.number().int().positive().optional(),
})

const deploymentSelect = {
  id: true,
  version: true,
  status: true,
  bundle_url: true,
  bundle_hash: true,
  deployed_at: true,
} as const

export const POST = withApiErrorHandling(
  async (req: Request, { params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params
    const slugErr = validateSlugParam(slug)
    if (slugErr) return slugErr
    const auth = await authenticateApiKey(req)
    await checkApiRateLimits(auth.apiKeyId, auth.userId)

    let body: unknown = {}
    const contentType = req.headers.get("content-type") ?? ""
    const hasBody = contentType.includes("application/json")
    if (hasBody) {
      try {
        body = await req.json()
      } catch {
        return apiError(400, "invalid_json", "Request body is not valid JSON")
      }
    }

    const parsed = RollbackSchema.safeParse(body)
    if (!parsed.success) {
      return apiError(
        400,
        "validation_error",
        parsed.error.issues.map((i) => i.message).join(", "),
      )
    }

    const { version: targetVersion } = parsed.data

    const result = await prisma.$transaction(async (tx) => {
      // Advisory lock to prevent races with concurrent deploy/rollback
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${auth.teamId}))`

      const agent = await tx.anAgentConfig.findUnique({
        where: { team_id_slug: { team_id: auth.teamId, slug } },
        select: {
          id: true,
          active_deployment_id: true,
          activeDeployment: {
            select: { version: true },
          },
        },
      })

      if (!agent) {
        throw {
          status: 404,
          error: "not_found",
          message: `Agent "${slug}" not found`,
        }
      }

      let deployment

      if (targetVersion) {
        deployment = await tx.anDeployment.findUnique({
          where: {
            agent_id_version: { agent_id: agent.id, version: targetVersion },
          },
          select: deploymentSelect,
        })

        if (!deployment) {
          throw {
            status: 404,
            error: "not_found",
            message: `Version ${targetVersion} not found for agent "${slug}"`,
          }
        }
      } else {
        if (!agent.activeDeployment) {
          throw {
            status: 400,
            error: "no_previous_version",
            message: `No active deployment to roll back from for agent "${slug}"`,
          }
        }

        deployment = await tx.anDeployment.findFirst({
          where: {
            agent_id: agent.id,
            status: "ready",
            version: { lt: agent.activeDeployment.version },
          },
          orderBy: { version: "desc" },
          select: deploymentSelect,
        })

        if (!deployment) {
          throw {
            status: 400,
            error: "no_previous_version",
            message: `No previous deployment to roll back to for agent "${slug}"`,
          }
        }
      }

      if (deployment.status !== "ready") {
        throw {
          status: 400,
          error: "deployment_not_ready",
          message: `Deployment v${deployment.version} has status "${deployment.status}" and cannot be activated`,
        }
      }

      if (deployment.id === agent.active_deployment_id) {
        throw {
          status: 400,
          error: "already_active",
          message: `Version ${deployment.version} is already the active deployment`,
        }
      }

      await tx.anAgentConfig.update({
        where: { id: agent.id },
        data: {
          active_deployment_id: deployment.id,
          bundle_url: deployment.bundle_url,
          bundle_hash: deployment.bundle_hash,
          deployed_at: deployment.deployed_at,
          updated_at: new Date(),
        },
      })

      return deployment
    })

    return NextResponse.json({
      slug,
      version: result.version,
      deploymentId: result.id,
      message: `Rolled back to v${result.version}`,
    })
  },
)
