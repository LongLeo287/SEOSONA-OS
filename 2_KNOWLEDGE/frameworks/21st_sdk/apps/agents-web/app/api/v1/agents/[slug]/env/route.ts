import { NextResponse } from "next/server"
import { Prisma } from "@/prisma/client"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { authenticateApiKey } from "../../../_lib/auth"
import { withApiErrorHandling } from "../../../_lib/errors"

const EnvSetSchema = z.object({
  key: z.string().min(1),
  value: z.string().min(1),
})

const EnvRemoveSchema = z.object({
  key: z.string().min(1),
})

function extractSlug(req: Request): string {
  const url = new URL(req.url)
  const match = url.pathname.match(/\/v1\/agents\/([^/]+)\/env$/)
  if (!match?.[1]) {
    throw { status: 400, error: "bad_request", message: "Missing agent slug" }
  }
  return decodeURIComponent(match[1])
}

export const GET = withApiErrorHandling(async (req: Request) => {
  const auth = await authenticateApiKey(req)
  const slug = extractSlug(req)

  const agent = await prisma.anAgentConfig.findUnique({
    where: { team_id_slug: { team_id: auth.teamId, slug } },
    select: { env_vars: true },
  })

  if (!agent) {
    throw { status: 404, error: "not_found", message: `Agent "${slug}" not found` }
  }

  const envVars = (agent.env_vars as Record<string, string>) ?? {}

  return NextResponse.json({
    keys: Object.keys(envVars).sort(),
  })
})

export const PUT = withApiErrorHandling(async (req: Request) => {
  const auth = await authenticateApiKey(req)
  const slug = extractSlug(req)

  let body: unknown
  try {
    body = await req.json()
  } catch {
    throw { status: 400, error: "invalid_json", message: "Request body must be valid JSON" }
  }

  const parsed = EnvSetSchema.safeParse(body)
  if (!parsed.success) {
    throw {
      status: 400,
      error: "validation_error",
      message: parsed.error.issues.map((issue) => issue.message).join(", "),
    }
  }

  const agent = await prisma.anAgentConfig.findUnique({
    where: { team_id_slug: { team_id: auth.teamId, slug } },
    select: { id: true, env_vars: true },
  })

  if (!agent) {
    throw { status: 404, error: "not_found", message: `Agent "${slug}" not found` }
  }

  const envVars = { ...((agent.env_vars as Record<string, string>) ?? {}) }
  envVars[parsed.data.key] = parsed.data.value

  await prisma.anAgentConfig.update({
    where: { id: agent.id },
    data: {
      env_vars: envVars,
      updated_at: new Date(),
    },
  })

  return NextResponse.json({
    success: true,
    key: parsed.data.key,
  })
})

export const DELETE = withApiErrorHandling(async (req: Request) => {
  const auth = await authenticateApiKey(req)
  const slug = extractSlug(req)

  let body: unknown
  try {
    body = await req.json()
  } catch {
    throw { status: 400, error: "invalid_json", message: "Request body must be valid JSON" }
  }

  const parsed = EnvRemoveSchema.safeParse(body)
  if (!parsed.success) {
    throw {
      status: 400,
      error: "validation_error",
      message: parsed.error.issues.map((issue) => issue.message).join(", "),
    }
  }

  const agent = await prisma.anAgentConfig.findUnique({
    where: { team_id_slug: { team_id: auth.teamId, slug } },
    select: { id: true, env_vars: true },
  })

  if (!agent) {
    throw { status: 404, error: "not_found", message: `Agent "${slug}" not found` }
  }

  const envVars = { ...((agent.env_vars as Record<string, string>) ?? {}) }
  delete envVars[parsed.data.key]

  await prisma.anAgentConfig.update({
    where: { id: agent.id },
    data: {
      env_vars: Object.keys(envVars).length > 0 ? envVars : Prisma.JsonNull,
      updated_at: new Date(),
    },
  })

  return NextResponse.json({
    success: true,
    key: parsed.data.key,
  })
})
