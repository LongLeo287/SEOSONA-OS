/**
 * GitHub integration utilities
 */

/**
 * Setup step constants
 */
export const SETUP_STEPS = {
  CREATING_SANDBOX: "creating_sandbox",
  CONNECTING: "connecting",
  CLONING: "cloning",
  APPLYING_ENV: "applying_env",
  INSTALLING: "installing",
  STARTING: "starting",
  SAVING: "saving",
  COMPLETED: "completed",
  ERROR: "error",
} as const

/**
 * Type for setup step values
 */
export type SetupStep = (typeof SETUP_STEPS)[keyof typeof SETUP_STEPS]

/**
 * Setup progress interface
 */
export interface SetupProgress {
  step: SetupStep | null
  progress: number
  updated_at?: string
}

/**
 * Single GitHub App installation info
 */
export interface GitHubInstallation {
  installation_id: string
  login: string // org or user name (e.g., "21st-dev")
  avatar_url: string | null
  type: "User" | "Organization"
}

export interface GitHubIntegration {
  // Array of all installations with login for mapping repo_owner -> installation
  // This is the source of truth for which installations the team has access to
  installations: GitHubInstallation[]

  // When was GitHub first connected
  connected_at: string
  // 21st.dev user ID who connected GitHub (for access control to env vars)
  connected_by_user_id?: string

  // DEPRECATED: Legacy fields for backward compatibility during migration
  // TODO: Remove after migration is complete
  /** @deprecated Use installations[] instead */
  installation_id?: string
  /** @deprecated Use installations[] instead */
  installation_ids?: string[]
  /** @deprecated Use installations[] instead */
  github_user?: {
    id: number
    login: string
    name: string
    email: string
    avatar_url: string
  }
  /** @deprecated No longer used */
  access_token?: string

  // Setup action from GitHub App callback
  setup_action?: "install" | "update" | "request"
  configuration?: {
    repository: string
    folders: string[]
    configuredAt: string
  }
  setup_progress?: SetupProgress
  fileTree?: any[]
  // Last repository that was setup (to detect repo changes and clear env vars)
  last_setup_repository?: string
  // Admin verification for non-Next.js projects (manually set up by admin)
  manually_verified?: boolean
  verified_at?: string
  verified_by?: string
}

/**
 * Get the installation_id for a given repository based on its owner.
 * Looks up in team.github_integration.installations[] where login matches repo owner.
 *
 * @param integration - The team's GitHub integration
 * @param repository - Full repository name (e.g., "21st-dev/magic-ui")
 * @returns installation_id or null if not found
 */
export function getInstallationForRepo(
  integration: GitHubIntegration | null | undefined,
  repository: string,
): string | null {
  if (!integration) return null

  const repoOwner = repository.split("/")[0]

  // Try new installations[] array first
  if (integration.installations?.length) {
    const found = integration.installations.find(
      (inst) => inst.login === repoOwner,
    )
    if (found) return found.installation_id
  }

  // Fallback to legacy fields for backward compatibility
  // Only use if the login matches the repo owner
  if (
    integration.github_user?.login === repoOwner &&
    integration.installation_id
  ) {
    return integration.installation_id
  }

  // Don't use installation_id if we can't verify it belongs to this repo's org
  // This prevents 403 errors from using wrong org's installation
  return null
}

/**
 * Get configuration summary for display
 */
export function getConfigurationSummary(integration: any) {
  if (!integration?.configuration) {
    return {
      repository: null,
      folders: 0,
      configured: false,
    }
  }

  const { repository = "", folders = [] } = integration.configuration

  return {
    repository: repository,
    folders: folders.length,
    configured: !!repository && folders.length > 0,
  }
}

/**
 * Step text for display
 */
const STEP_TEXTS: Record<string, string> = {
  [SETUP_STEPS.CREATING_SANDBOX]: "Creating sandbox...",
  [SETUP_STEPS.CONNECTING]: "Connecting to sandbox...",
  [SETUP_STEPS.CLONING]: "Cloning repository...",
  [SETUP_STEPS.APPLYING_ENV]: "Applying environment variables...",
  [SETUP_STEPS.INSTALLING]: "Installing dependencies...",
  [SETUP_STEPS.STARTING]: "Starting dev server...",
  [SETUP_STEPS.SAVING]: "Saving configuration...",
  [SETUP_STEPS.COMPLETED]: "Setup completed successfully",
  [SETUP_STEPS.ERROR]: "Setup failed. Please try again.",
}

/**
 * Get human-readable text for a setup step
 */
export function getStepStatusText(step: SetupStep | string | null): string {
  if (!step) return "Starting setup..."
  return STEP_TEXTS[step] || "Setting up..."
}

/**
 * Get step label for progress display
 */
export function getStepLabel(step: SetupStep | string | null): string {
  if (!step) return "Starting..."
  return STEP_TEXTS[step] || String(step)
}

/**
 * Get step description for progress display
 */
export function getStepDescription(step: SetupStep | string | null): string {
  if (!step) return "Starting setup..."
  return STEP_TEXTS[step] || "Setting up..."
}
