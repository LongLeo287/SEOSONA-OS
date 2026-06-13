/**
 * Cursor Background Agents integration utilities
 */

export interface CursorIntegration {
  api_key?: string
  selected_repository?: string
  configured_at?: string
}

export interface CursorRepository {
  owner: string
  name: string
  repository: string
}

/**
 * Get configuration summary for display
 */
export function getCursorConfigurationSummary(integration: any) {
  const hasApiKey = Boolean(integration?.api_key)

  if (!hasApiKey || !integration?.selected_repository) {
    return {
      repository: null,
      configured: false,
    }
  }

  const { selected_repository } = integration

  return {
    repository: selected_repository,
    configured: true,
  }
}
