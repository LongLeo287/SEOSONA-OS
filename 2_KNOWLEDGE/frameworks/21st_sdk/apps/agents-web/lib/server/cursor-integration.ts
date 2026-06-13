import { prisma } from "@/lib/prisma"
import { decryptCursorApiKey } from "@/lib/server/crypto"
import type { CursorRepository } from "@/lib/server/cursor-bg-agents-api"

export interface CursorIntegrationRecord {
  api_key?: string
  api_key_name?: string
  api_key_created_at?: string
  user_email?: string
  selected_repository?: string
  configured_at?: string
  repositories?: CursorRepository[]
  repositories_updated_at?: string
  repository_selected_at?: string
  [key: string]: any
}

export interface TeamCursorIntegration {
  apiKey: string | null
  selectedRepository: string | null
  repositories: CursorRepository[] | null
  rawIntegration: CursorIntegrationRecord | null
}

export async function getTeamCursorIntegration(
  teamId: string,
  userId: string,
): Promise<TeamCursorIntegration> {
  const team = await prisma.team.findFirst({
    where: {
      id: teamId,
      user_id: userId,
    },
    select: {
      cursor_integration: true,
    },
  })

  if (!team) {
    throw new Error("Team not found or access denied")
  }

  const integration =
    (team.cursor_integration as CursorIntegrationRecord) || null

  if (!integration) {
    return {
      apiKey: null,
      selectedRepository: null,
      repositories: null,
      rawIntegration: null,
    }
  }
  const apiKey = integration.api_key
    ? decryptCursorApiKey(integration.api_key)
    : null

  return {
    apiKey,
    selectedRepository: integration.selected_repository || null,
    repositories: integration.repositories || null,
    rawIntegration: integration,
  }
}

export async function saveCursorRepositories(
  teamId: string,
  userId: string,
  repositories: CursorRepository[],
): Promise<void> {
  const team = await prisma.team.findFirst({
    where: {
      id: teamId,
      user_id: userId,
    },
    select: {
      cursor_integration: true,
    },
  })

  if (!team) {
    throw new Error("Team not found or access denied")
  }

  const currentIntegration =
    (team.cursor_integration as CursorIntegrationRecord) || {}

  const updatedIntegration: CursorIntegrationRecord = {
    ...currentIntegration,
    repositories,
    repositories_updated_at: new Date().toISOString(),
  }

  await prisma.team.update({
    where: {
      id: teamId,
    },
    data: {
      cursor_integration: updatedIntegration,
    },
  })
}
