import { sendFirstAgentWelcomeEmail } from "@/lib/emails/send-first-agent-welcome"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@/prisma/client"
import { buildOpenSandboxImage } from "@/lib/server/agents/build-opensandbox-image"
import { buildSandboxTemplate } from "@/lib/server/agents/build-sandbox-template"
import {
  getDefaultSandboxProvider,
  resolveSandboxConfig,
  validateResolvedSandboxConfig,
  withTemplateId,
  type RawSandboxConfig,
} from "@/lib/server/agents/sandbox-config"
import { NextResponse } from "next/server"
import { z } from "zod"
import { authenticateApiKey } from "../../_lib/auth"
import { withApiErrorHandling } from "../../_lib/errors"
import { checkApiRateLimits } from "../../_lib/rate-limit"
import { resolveDeployMcpMetadata } from "./mcp-metadata"

const DeploySchema = z.object({
  // Agent
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Lowercase alphanumeric and hyphens only"),
  name: z.string().max(200).optional(),
  runtime: z.enum(["claude-code", "codex"]).optional(),
  envVars: z.record(z.string(), z.string()).optional(),
  agentLanguage: z.enum(["js", "go"]).optional(),
  sandboxConfig: z
    .object({
      cpuCount: z.number().int().positive().optional(),
      memoryMB: z.number().int().positive().optional(),
      apt: z.array(z.string()).optional(),
      build: z.array(z.string()).optional(),
      setup: z.array(z.string()).optional(),
      files: z.record(z.string(), z.string()).optional(),
      cwd: z.string().optional(),
      timeoutMs: z.number().int().positive().optional(),
      networkAllowOut: z.array(z.string()).optional(),
      networkDenyOut: z.array(z.string()).optional(),
    })
    .optional(),
  metadata: z
    .object({
      model: z.string(),
      systemPrompt: z
        .union([
          z.string(),
          z.object({
            type: z.string(),
            preset: z.string(),
            append: z.string().optional(),
          }),
        ])
        .optional(),
      permissionMode: z.string(),
      maxTurns: z.number(),
      maxBudgetUsd: z.number().optional(),
      maxSandboxBudgetUsd: z.number().positive().optional(),
      tools: z.array(
        z.object({ name: z.string(), description: z.string() }),
      ),
      hooks: z.array(z.string()),
      mcpServers: z
        .array(
          z.object({
            name: z.string().min(1).max(100),
            url: z.string().url(),
          }),
        )
        .optional(),
      vaultIds: z.array(z.string().uuid()).optional(),
      sandbox: z
        .object({
          cpuCount: z.number().int().positive().optional(),
          memoryMB: z.number().int().positive().optional(),
          apt: z.array(z.string()).optional(),
          build: z.array(z.string()).optional(),
          setup: z.array(z.string()).optional(),
          cwd: z.string().optional(),
          timeoutMs: z.number().int().positive().optional(),
          networkAllowOut: z.array(z.string()).optional(),
          networkDenyOut: z.array(z.string()).optional(),
        })
        .optional(),
    })
    .passthrough()
    .optional(),
  // Deprecated: silently ignored for backward compat
  projectSlug: z.string().optional(),
  projectName: z.string().optional(),
})

type DeployInput = z.infer<typeof DeploySchema> & {
  bundle: ArrayBuffer
  templateArchive?: ArrayBuffer
  mcpConfig?: ArrayBuffer
}

type DeployResult = {
  slug: string
  agentId: string
  bundleUrl: string
  deployedAt: Date
  version: number
  deploymentId: string
}

type DeployEvent =
  | { type: "status"; message: string }
  | { type: "result"; result: DeployResult }
  | { type: "error"; message: string }

type ProgressReporter = (message: string) => void

const NDJSON_CONTENT_TYPE = "application/x-ndjson"

export const maxDuration = 900

function encodeEvent(event: DeployEvent): Uint8Array {
  return new TextEncoder().encode(`${JSON.stringify(event)}\n`)
}

function validationError(message: string) {
  return {
    status: 400,
    error: "validation_error",
    message,
  }
}

function toDataUrl(mimeType: string, contents: ArrayBuffer): string {
  const base64 = Buffer.from(contents).toString("base64")
  return `data:${mimeType};base64,${base64}`
}

function getOptionalTextField(formData: FormData, key: string): string | undefined {
  const value = formData.get(key)
  if (value == null) return undefined
  if (typeof value !== "string") {
    throw validationError(`${key} must be a string`)
  }
  return value
}

function getOptionalJsonField(formData: FormData, key: string): unknown {
  const value = getOptionalTextField(formData, key)
  if (value === undefined) return undefined

  try {
    return JSON.parse(value)
  } catch {
    throw validationError(`${key} must be valid JSON`)
  }
}

async function parseDeployInput(req: Request): Promise<DeployInput> {
  // 1. Parse multipart form data
  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    throw {
      status: 400,
      error: "invalid_form_data",
      message: "Request body must be valid multipart/form-data",
    }
  }

  const bundle = formData.get("bundle")
  if (!(bundle instanceof File) || bundle.size === 0) {
    throw validationError("bundle is required")
  }

  const templateArchive = formData.get("templateArchive")
  if (templateArchive != null && !(templateArchive instanceof File)) {
    throw validationError("templateArchive must be a file")
  }

  const mcpConfig = formData.get("mcpConfig")
  if (mcpConfig != null && !(mcpConfig instanceof File)) {
    throw validationError("mcpConfig must be a file")
  }

  const parsed = DeploySchema.safeParse({
    slug: getOptionalTextField(formData, "slug"),
    name: getOptionalTextField(formData, "name"),
    runtime: getOptionalTextField(formData, "runtime"),
    envVars: getOptionalJsonField(formData, "envVars"),
    agentLanguage: getOptionalTextField(formData, "agentLanguage"),
    sandboxConfig: getOptionalJsonField(formData, "sandboxConfig"),
    metadata: getOptionalJsonField(formData, "metadata"),
    projectSlug: getOptionalTextField(formData, "projectSlug"),
    projectName: getOptionalTextField(formData, "projectName"),
  })

  if (!parsed.success) {
    throw validationError(parsed.error.issues.map((issue) => issue.message).join(", "))
  }

  const mcpConfigBuffer =
    mcpConfig instanceof File && mcpConfig.size > 0
      ? await mcpConfig.arrayBuffer()
      : undefined

  if (mcpConfigBuffer) {
    try {
      JSON.parse(Buffer.from(mcpConfigBuffer).toString("utf8"))
    } catch {
      throw validationError("mcpConfig must be valid JSON")
    }
  }

  return {
    ...parsed.data,
    bundle: await bundle.arrayBuffer(),
    ...(templateArchive instanceof File && templateArchive.size > 0
      ? { templateArchive: await templateArchive.arrayBuffer() }
      : {}),
    ...(mcpConfigBuffer
      ? { mcpConfig: mcpConfigBuffer }
      : {}),
  }
}

async function deployAgent(params: {
  auth: Awaited<ReturnType<typeof authenticateApiKey>>
  input: DeployInput
  onProgress?: ProgressReporter
}): Promise<DeployResult> {
  const { auth, input, onProgress } = params
  const {
    slug,
    bundle,
    name,
    runtime,
    sandboxConfig,
    metadata,
    templateArchive,
    mcpConfig,
    agentLanguage,
  } =
    input

  onProgress?.("Preparing agent bundle...")

  // Extract legacy `.mcp.json` http server entries so they survive into the
  // deployment metadata as `mcpServers[]` (consumed by the relay vault path).
  const { effectiveMcpConfig, baseDeploymentMetadata } =
    resolveDeployMcpMetadata({ metadata, mcpConfig })

  const bundleHash = Buffer.from(
    await crypto.subtle.digest("SHA-256", bundle),
  )
    .toString("hex")
    .slice(0, 16)

  const resolvedSandboxConfig = resolveSandboxConfig({
    sandboxConfig: sandboxConfig as RawSandboxConfig | null | undefined,
    provider: getDefaultSandboxProvider(),
  })
  const bundleUrl =
    resolvedSandboxConfig.provider === "opensandbox"
      ? toDataUrl("application/javascript", bundle)
      : ""
  const mcpConfigUrl =
    resolvedSandboxConfig.provider === "opensandbox" && effectiveMcpConfig
      ? toDataUrl("application/json", effectiveMcpConfig)
      : undefined

  validateResolvedSandboxConfig({
    sandboxConfig: resolvedSandboxConfig,
    rawSandboxConfig: sandboxConfig as RawSandboxConfig | null | undefined,
    hasTemplateArchive: !!templateArchive,
    agentLanguage,
  })

  // Phase 1: Create agent config + deployment record with status=building
  const { config: agentConfig, deployment, isFirstDeployment } =
    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${auth.teamId}))`

      const existingDeployed = await tx.anAgentConfig.count({
        where: { team_id: auth.teamId, deployed_at: { not: null } },
      })

      let config = await tx.anAgentConfig.findUnique({
        where: { team_id_slug: { team_id: auth.teamId, slug } },
      })

      if (config) {
        const updateData: Record<string, unknown> = { updated_at: new Date() }
        if (name) updateData.name = name
        if (runtime) updateData.runtime = runtime
        if (input.envVars !== undefined) updateData.env_vars = input.envVars
        if (Object.keys(updateData).length > 1) {
          config = await tx.anAgentConfig.update({
            where: { id: config.id },
            data: updateData,
          })
        }
      } else {
        config = await tx.anAgentConfig.create({
          data: {
            team_id: auth.teamId,
            name: name || slug,
            slug,
            runtime: runtime ?? "claude-code",
            ...(input.envVars && { env_vars: input.envVars }),
          },
        })
      }

      const lastDeployment = await tx.anDeployment.findFirst({
        where: { agent_id: config.id },
        orderBy: { version: "desc" },
        select: { version: true },
      })
      const nextVersion = (lastDeployment?.version ?? 0) + 1

      const dep = await tx.anDeployment.create({
        data: {
          agent_id: config.id,
          version: nextVersion,
          bundle_url: bundleUrl,
          bundle_hash: bundleHash,
          sandbox_config: resolvedSandboxConfig,
          metadata: {
            ...baseDeploymentMetadata,
            ...(mcpConfigUrl ? { mcpConfigUrl } : {}),
          },
          status: "building",
        },
      })

      return {
        config,
        deployment: dep,
        isFirstDeployment: existingDeployed === 0,
      }
    })

  // Phase 2: Provider-specific deployment work
  try {
    let nextSandboxConfig = resolvedSandboxConfig
    let nextMetadata: Record<string, unknown> = {
      ...baseDeploymentMetadata,
      ...(mcpConfigUrl ? { mcpConfigUrl } : {}),
    }

    if (resolvedSandboxConfig.provider === "e2b") {
      const template = await buildSandboxTemplate({
        teamId: auth.teamId,
        bundle,
        bundleHash,
        templateArchive,
        mcpConfig: effectiveMcpConfig,
        sandboxConfig,
        onProgress,
      })

      nextSandboxConfig = withTemplateId(
        resolvedSandboxConfig,
        template.templateId,
      )
      nextMetadata = {
        ...nextMetadata,
        templateId: template.templateId,
      }
    } else if (resolvedSandboxConfig.provider === "opensandbox") {
      const openSandboxImage = await buildOpenSandboxImage({
        sandboxConfig: sandboxConfig as RawSandboxConfig | null | undefined,
        onProgress,
      })

      if (openSandboxImage) {
        nextSandboxConfig = {
          ...resolvedSandboxConfig,
          runtimeImage: openSandboxImage.imageRef,
        }
        nextMetadata = {
          ...nextMetadata,
          openSandboxBuild: openSandboxImage,
        }
      } else {
        onProgress?.("Skipping OpenSandbox image build: no apt/build commands configured.")
      }
    }

    onProgress?.("Saving deployment...")

    // Phase 3: Mark deployment as ready and set as active
    await prisma.$transaction(async (tx) => {
      await tx.anDeployment.update({
        where: { id: deployment.id },
        data: {
          status: "ready",
          completed_at: new Date(),
          sandbox_config: nextSandboxConfig,
          metadata: nextMetadata as Prisma.InputJsonValue,
        },
      })

      await tx.anAgentConfig.update({
        where: { id: agentConfig.id },
        data: {
          active_deployment_id: deployment.id,
          bundle_url: bundleUrl,
          bundle_hash: bundleHash,
          deployed_at: deployment.deployed_at,
          updated_at: new Date(),
        },
      })
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Deploy failed"
    await prisma.anDeployment.update({
      where: { id: deployment.id },
      data: { status: "failed", error: errorMessage, completed_at: new Date() },
    }).catch((e) => console.error("[deploy] Failed to mark deployment as failed:", e))

    throw error
  }

  if (isFirstDeployment) {
    prisma.user
      .findUnique({
        where: { id: auth.userId },
        select: { email: true, name: true },
      })
      .then((user) => {
        if (user?.email) {
          sendFirstAgentWelcomeEmail({
            email: user.email,
            userName: user.name ?? undefined,
          }).catch(() => {})
        }
      })
      .catch(() => {})
  }

  return {
    slug,
    agentId: agentConfig.id,
    bundleUrl,
    deployedAt: deployment.deployed_at,
    version: deployment.version,
    deploymentId: deployment.id,
  }
}

export const POST = withApiErrorHandling(async (req: Request) => {
  const auth = await authenticateApiKey(req)
  await checkApiRateLimits(auth.apiKeyId, auth.userId)

  const input = await parseDeployInput(req)

  const wantsStream =
    req.headers.get("accept")?.includes(NDJSON_CONTENT_TYPE) ?? false

  if (!wantsStream) {
    const result = await deployAgent({ auth, input })
    return NextResponse.json(result)
  }

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const result = await deployAgent({
          auth,
          input,
          onProgress: (message) => {
            controller.enqueue(encodeEvent({ type: "status", message }))
          },
        })

        controller.enqueue(encodeEvent({ type: "result", result }))
      } catch (error) {
        controller.enqueue(
          encodeEvent({
            type: "error",
            message:
              error instanceof Error ? error.message : "Deploy failed",
          }),
        )
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": NDJSON_CONTENT_TYPE,
      "Cache-Control": "no-cache",
      "Transfer-Encoding": "chunked",
    },
  })
})
