import { Sandbox } from "@e2b/code-interpreter"
import { AGENTS_E2B_TEMPLATE } from "@/lib/codesandbox-constants"
import { getInstallationAccessToken } from "@/lib/server/github/github-app-auth"
import {
  decryptClaudeCodeCredentials,
  decryptLinearToken,
  signClaudeProxyJwt,
} from "@/lib/server/crypto"
import {
  type ClaudeCodeIntegration,
  getClaudeCodeCredentialsForInjection,
} from "@/lib/claude-code"
import { type LinearIntegration, isLinearConnected } from "@/lib/linear"

const CLAUDE_PROXY_URL = "https://claude-proxy-xxx.up.railway.app"

export interface CreateAgentSandboxParams {
  /** User ID for JWT signing */
  userId: string
  /** Repository full name (owner/repo) */
  repository: string
  /** GitHub App installation ID */
  installationId?: string | number
  /** Branch to checkout (optional, only for fresh sandboxes) */
  branch?: string
  /** Whether this is a public repo import (no auth needed for clone) */
  isPublicImport?: boolean
  /** Team's Claude Code integration (for OAuth token) */
  claudeCodeIntegration?: ClaudeCodeIntegration | null
  /** Team's Linear integration (for API token) */
  linearIntegration?: LinearIntegration | null
  /** Fork from existing sandbox ID instead of creating fresh */
  forkFromSandboxId?: string
  /** Skip injecting Linear token (when we handle notifications ourselves) */
  skipLinearToken?: boolean
  /** Project-level environment variables to inject */
  envVars?: Record<string, string> | null
}

export interface CreateAgentSandboxResult {
  sandboxId: string
  sandboxUrl: string
  /** Whether using Claude Code OAuth (true) or proxy credits (false) */
  usesClaudeCodeOAuth: boolean
}

/**
 * Creates and configures an E2B sandbox for agent work.
 *
 * Supports two modes:
 * 1. Fork mode (forkFromSandboxId provided): Fork existing sandbox, inject tokens
 * 2. Fresh mode: Create from template, clone repo, checkout branch, inject tokens
 *
 * Used by:
 * - createAgentChat tRPC mutation (UI flow)
 * - GitHub webhook handler (automation flow)
 */
export async function createAgentSandbox(
  params: CreateAgentSandboxParams
): Promise<CreateAgentSandboxResult> {
  const {
    userId,
    repository,
    installationId,
    branch,
    isPublicImport = false,
    claudeCodeIntegration,
    linearIntegration,
    forkFromSandboxId,
    skipLinearToken = false,
    envVars,
  } = params

  const isForkMode = !!forkFromSandboxId
  console.log(`[createAgentSandbox] Creating sandbox for ${repository} (mode: ${isForkMode ? 'fork' : 'fresh'})...`)

  // 1. Create E2B sandbox (fork or fresh)
  const sbx = await Sandbox.betaCreate(
    forkFromSandboxId || AGENTS_E2B_TEMPLATE,
    { timeoutMs: 1_800_000, autoPause: true }
  )
  const sandboxId = sbx.sandboxId
  console.log(`[createAgentSandbox] Sandbox created: ${sandboxId}`)

  try {
    // 2. Clone repository (only for fresh sandboxes)
    if (!isForkMode) {
      console.log(`[createAgentSandbox] Cloning ${repository}...`)
      let cloneUrl: string
      if (isPublicImport) {
        cloneUrl = `https://github.com/${repository}.git`
      } else if (installationId) {
        const accessToken = await getInstallationAccessToken(installationId)
        cloneUrl = `https://x-access-token:${accessToken}@github.com/${repository}.git`
      } else {
        throw new Error("installationId required for private repo clone")
      }

      const cloneResult = await sbx.commands.run(
        `git clone ${cloneUrl} /home/user/repo`,
        { timeoutMs: 300_000 } // 5 min
      )

      if (cloneResult.exitCode !== 0) {
        throw new Error(`Git clone failed: ${cloneResult.stderr}`)
      }
      console.log(`[createAgentSandbox] Repository cloned`)

      // 3. Checkout branch if specified
      if (branch && branch !== "main" && branch !== "master") {
        console.log(`[createAgentSandbox] Checking out branch: ${branch}`)
        await sbx.commands.run(
          `cd /home/user/repo && git checkout ${branch}`,
          { timeoutMs: 60_000 } // 1 min
        )
      }
    }

    // 4. Get Claude credentials
    const claudeToken = getClaudeCodeCredentialsForInjection(
      claudeCodeIntegration ?? null,
      decryptClaudeCodeCredentials
    )

    // 5. Inject Claude credentials
    console.log(`[createAgentSandbox] Injecting Claude credentials...`)
    try {
      if (claudeToken?.oauthToken) {
        await sbx.files.write("/home/user/.claude-oauth-token", claudeToken.oauthToken)
        console.log(`[createAgentSandbox] Claude OAuth token injected`)
      } else {
        const jwt = await signClaudeProxyJwt(userId, sandboxId)
        await sbx.files.write(
          "/home/user/.claude-proxy-config",
          `ANTHROPIC_BASE_URL=${CLAUDE_PROXY_URL}\nANTHROPIC_API_KEY=${jwt}`
        )
        console.log(`[createAgentSandbox] Claude proxy JWT injected`)
      }
    } catch (error) {
      console.error("[createAgentSandbox] Claude injection failed:", error)
    }

    // 6. Inject Linear token if connected (skip for Linear-sourced tasks - we handle notifications)
    if (linearIntegration && isLinearConnected(linearIntegration) && !skipLinearToken) {
      console.log(`[createAgentSandbox] Injecting Linear token...`)
      try {
        const linearToken = decryptLinearToken(linearIntegration.accessToken)
        await sbx.files.write("/home/user/.linear-token", linearToken)
        console.log(`[createAgentSandbox] Linear token injected`)
      } catch (error) {
        console.error("[createAgentSandbox] Linear injection failed:", error)
      }
    }

    // 7. Inject GitHub token for gh CLI
    if (installationId) {
      console.log(`[createAgentSandbox] Injecting GitHub token...`)
      try {
        const githubToken = await getInstallationAccessToken(installationId)
        await sbx.files.write("/home/user/.gh-token", githubToken)
        console.log(`[createAgentSandbox] GitHub token injected`)
      } catch (error) {
        console.error("[createAgentSandbox] GitHub injection failed:", error)
      }
    }

    // 8. Inject project env vars
    if (envVars && typeof envVars === "object") {
      try {
        const envString = Object.entries(envVars)
          .map(([k, v]) => `${k}=${v}`)
          .join("\n")
        await sbx.files.write("/home/user/.env", envString)
        console.log(`[createAgentSandbox] Env vars injected (${Object.keys(envVars).length} vars)`)
      } catch (error) {
        console.error("[createAgentSandbox] Env vars injection failed:", error)
      }
    }

    const sandboxUrl = `https://3003-${sandboxId}.e2b.app`
    console.log(`[createAgentSandbox] Sandbox ready: ${sandboxUrl}`)

    return {
      sandboxId,
      sandboxUrl,
      usesClaudeCodeOAuth: !!claudeToken?.oauthToken,
    }
  } catch (error) {
    console.error(`[createAgentSandbox] Error, cleaning up sandbox:`, error)
    try {
      await Sandbox.kill(sandboxId)
    } catch {
      // Ignore cleanup errors
    }
    throw error
  }
}
