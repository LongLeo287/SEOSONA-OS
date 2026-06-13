import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createAgentSandbox } from "@/lib/agents/create-agent-sandbox"
import { sendDiscordMessage } from "@/lib/webhooks/platforms/discord/responder"
import { getInstallationRepositories } from "@/lib/server/github/github-app-auth"
import { findMatchingAutomations, logAutomationExecution, updateAutomationExecution } from "@/lib/webhooks/handlers/automation-matcher"
import type { DiscordEventData } from "@/lib/webhooks/handlers/automation-matcher"
import type { GitHubIntegration, GitHubInstallation } from "@/lib/github"
import type { ClaudeCodeIntegration } from "@/lib/claude-code"
import type { LinearIntegration } from "@/lib/linear"

const DISCORD_PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY

// Discord interaction types
const InteractionType = {
  PING: 1,
  APPLICATION_COMMAND: 2,
  MESSAGE_COMPONENT: 3,
} as const

// Discord response types
const InteractionResponseType = {
  PONG: 1,
  CHANNEL_MESSAGE: 4,
  DEFERRED_CHANNEL_MESSAGE: 5,
  DEFERRED_UPDATE_MESSAGE: 6,
  UPDATE_MESSAGE: 7,
} as const

// Discord component types
const ComponentType = {
  ACTION_ROW: 1,
  BUTTON: 2,
  STRING_SELECT: 3,
} as const

// Discord button styles
const ButtonStyle = {
  PRIMARY: 1,
  SECONDARY: 2,
  SUCCESS: 3,
  DANGER: 4,
  LINK: 5,
} as const

// Message flags
const MessageFlags = {
  EPHEMERAL: 64,
} as const

interface DiscordInteraction {
  id: string
  type: number
  token: string
  application_id: string
  guild_id?: string
  channel_id?: string
  member?: {
    user: {
      id: string
      username: string
      global_name?: string
    }
  }
  user?: {
    id: string
    username: string
    global_name?: string
  }
  data?: {
    id: string
    name: string
    custom_id?: string // For component interactions
    values?: string[] // For select menu
    options?: Array<{
      name: string
      value: string
      type: number
    }>
  }
}

/**
 * Verify Discord signature using Web Crypto API
 */
async function verifyDiscordSignature(
  rawBody: string,
  signature: string,
  timestamp: string
): Promise<boolean> {
  if (!DISCORD_PUBLIC_KEY) {
    console.error("[Discord] DISCORD_PUBLIC_KEY not configured")
    return false
  }

  try {
    const publicKeyBytes = new Uint8Array(
      DISCORD_PUBLIC_KEY.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
    )

    const publicKey = await crypto.subtle.importKey(
      "raw",
      publicKeyBytes,
      { name: "Ed25519", namedCurve: "Ed25519" },
      false,
      ["verify"]
    )

    const signatureBytes = new Uint8Array(
      signature.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
    )

    const message = new TextEncoder().encode(timestamp + rawBody)

    return await crypto.subtle.verify("Ed25519", publicKey, signatureBytes, message)
  } catch (error) {
    console.error("[Discord] Signature verification error:", error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("x-signature-ed25519")
    const timestamp = request.headers.get("x-signature-timestamp")

    if (!signature || !timestamp) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 })
    }

    const rawBody = await request.text()

    const isValid = await verifyDiscordSignature(rawBody, signature, timestamp)
    if (!isValid) {
      console.error("[Discord] Invalid signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const interaction: DiscordInteraction = JSON.parse(rawBody)

    // Handle PING
    if (interaction.type === InteractionType.PING) {
      console.log("[Discord] Received PING, responding with PONG")
      return NextResponse.json({ type: InteractionResponseType.PONG })
    }

    // Handle slash command: /1code
    if (
      interaction.type === InteractionType.APPLICATION_COMMAND &&
      interaction.data?.name === "1code"
    ) {
      return await handleSlashCommand(interaction)
    }

    // Handle component interactions (button clicks, dropdown selections)
    if (interaction.type === InteractionType.MESSAGE_COMPONENT) {
      return await handleComponentInteraction(interaction)
    }

    return NextResponse.json({ error: "Unknown interaction" }, { status: 400 })
  } catch (error) {
    console.error("[Discord Webhook] Error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

/**
 * Handle /1code slash command
 */
async function handleSlashCommand(interaction: DiscordInteraction) {
  const user = interaction.member?.user || interaction.user
  const channelId = interaction.channel_id
  const guildId = interaction.guild_id

  if (!user || !channelId) {
    return ephemeralResponse("Missing required data")
  }

  const discordUserId = user.id
  const discordUsername = user.global_name || user.username

  // Get prompt from command
  const promptOption = interaction.data?.options?.find((o) => o.name === "prompt")
  const prompt = promptOption?.value

  if (!prompt) {
    return ephemeralResponse("Please provide a prompt. Usage: `/1code prompt:fix the login bug`")
  }

  // Check if Discord user is linked to 1Code
  const userLink = await prisma.discordUserLink.findUnique({
    where: { discord_user_id: discordUserId },
    include: { user: true },
  })

  if (!userLink) {
    // Not linked - show auth button
    return showAuthPrompt(discordUserId, discordUsername, prompt)
  }

  // Check for matching Discord automations (if guild context exists)
  if (guildId) {
    const automationResult = await tryAutomationFlow({
      userId: userLink.user_id,
      discordUserId,
      discordUsername,
      channelId,
      guildId,
      prompt,
      interactionToken: interaction.token,
      applicationId: interaction.application_id,
    })

    if (automationResult) {
      return automationResult
    }
  }

  // No automation matched - fall back to interactive repo selection
  return await showRepoDropdown(userLink.user_id, prompt, channelId!, discordUserId)
}

/**
 * Try to match against Discord automations.
 * Returns a response if an automation matched, or null to fall back to interactive flow.
 */
async function tryAutomationFlow(params: {
  userId: string
  discordUserId: string
  discordUsername: string
  channelId: string
  guildId: string
  prompt: string
  interactionToken: string
  applicationId: string
}): Promise<NextResponse | null> {
  const { userId, discordUserId, discordUsername, channelId, guildId, prompt } = params

  // Find the team linked to this Discord guild
  const team = await prisma.team.findFirst({
    where: { discord_guild_id: guildId },
    select: { id: true },
  })

  if (!team) return null

  // Build event data for automation matching
  const eventData: DiscordEventData = {
    platform: "discord",
    guildId,
    channelId,
    userId: discordUserId,
    username: discordUsername,
    prompt,
    isBot: false,
  }

  const matchedAutomations = await findMatchingAutomations(
    team.id,
    "discord_slash_command",
    eventData,
  )

  if (matchedAutomations.length === 0) return null

  console.log(`[Discord] Found ${matchedAutomations.length} matching automation(s) for guild ${guildId}`)

  const baseUrl = process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://21st.dev"

  // Process the first matching automation
  const { automation } = matchedAutomations[0]
  const targetRepo = automation.target_repository

  if (!targetRepo) {
    await logAutomationExecution(
      automation.id,
      `discord-${guildId}-${Date.now()}`,
      `https://discord.com/channels/${guildId}/${channelId}`,
      "skipped",
      undefined,
      "No target repository configured for this automation",
    )
    return null // Fall back to interactive flow
  }

  // Log as pending
  const executionId = await logAutomationExecution(
    automation.id,
    `discord-${guildId}-${Date.now()}`,
    `https://discord.com/channels/${guildId}/${channelId}`,
    "pending",
  )

  // Combine automation instructions with user prompt
  const fullPrompt = automation.agent_prompt
    ? `${automation.agent_prompt}\n\n---\n\nUser request from Discord:\n${prompt}`
    : prompt

  // Find the installation for the target repo
  const userRecord = await prisma.user.findUnique({
    where: { id: userId },
    select: { github_installations: true },
  })

  const installations = (userRecord?.github_installations as { installations?: GitHubInstallation[] })?.installations || []
  const [repoOwner] = targetRepo.split("/")

  // Find matching installation
  let installationId = installations[0]?.installation_id
  for (const inst of installations) {
    if (inst.login === repoOwner) {
      installationId = inst.installation_id
      break
    }
  }

  if (!installationId) {
    await logAutomationExecution(
      automation.id,
      `discord-${guildId}-${Date.now()}`,
      `https://discord.com/channels/${guildId}/${channelId}`,
      "failed",
      undefined,
      "No GitHub installation found for target repository",
    )
    return null
  }

  // Start the agent using the automation config
  processAgentWork({
    userId,
    teamId: team.id,
    discordUsername,
    channelId,
    guildId,
    prompt: fullPrompt,
    repository: targetRepo,
    installationId,
    claudeCodeIntegration: null,
    linearIntegration: null,
    automationExecutionId: executionId,
    automationName: automation.name,
    addToInbox: automation.add_to_inbox,
    respondToTrigger: automation.respond_to_trigger,
  }).catch(async (err) => {
    console.error("[Discord] Automation agent work failed:", err)
    await logAutomationExecution(
      automation.id,
      `discord-${guildId}-${Date.now()}`,
      null,
      "failed",
      undefined,
      err instanceof Error ? err.message : "Unknown error",
    )
    sendDiscordMessage(channelId, `❌ Failed to start agent: ${err.message}`).catch(console.error)
  })

  // Return deferred response - automation is running
  return NextResponse.json({
    type: InteractionResponseType.CHANNEL_MESSAGE,
    data: {
      content: `⚡ **Automation "${automation.name}" triggered**\n\n📦 Repository: \`${targetRepo}\`\n📝 Task: "${prompt.slice(0, 100)}${prompt.length > 100 ? "..." : ""}"\n\nI'll post updates in this channel when ready!`,
      flags: MessageFlags.EPHEMERAL,
    },
  })
}

/**
 * Handle button/dropdown interactions
 */
async function handleComponentInteraction(interaction: DiscordInteraction) {
  const customId = interaction.data?.custom_id
  const user = interaction.member?.user || interaction.user
  const channelId = interaction.channel_id

  if (!customId || !user) {
    return ephemeralResponse("Invalid interaction")
  }

  // Handle repo selection
  if (customId.startsWith("repo_select:")) {
    const selectedValues = interaction.data?.values
    if (!selectedValues || selectedValues.length === 0) {
      return ephemeralResponse("Please select a repository")
    }

    // customId format: repo_select:{prompt_base64}
    const promptBase64 = customId.split(":")[1]
    const prompt = Buffer.from(promptBase64, "base64").toString("utf-8")
    const selectedRepo = selectedValues[0] // format: installationId:owner/repo

    const [installationId, repository] = selectedRepo.split(":", 2)

    // Get user link
    const userLink = await prisma.discordUserLink.findUnique({
      where: { discord_user_id: user.id },
      include: { user: true },
    })

    if (!userLink) {
      return ephemeralResponse("Your account is not linked. Please run /1code again.")
    }

    // Start the agent
    return await startAgent({
      userId: userLink.user_id,
      discordUserId: user.id,
      discordUsername: user.global_name || user.username,
      channelId: channelId!,
      guildId: interaction.guild_id!,
      prompt,
      repository,
      installationId,
      interactionToken: interaction.token,
      applicationId: interaction.application_id,
    })
  }

  return ephemeralResponse("Unknown interaction")
}

/**
 * Show auth prompt with connect button (ephemeral)
 */
function showAuthPrompt(discordUserId: string, discordUsername: string, prompt: string) {
  const baseUrl = process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://21st.dev"

  const authUrl = `${baseUrl}/api/auth/discord/link?discord_user_id=${discordUserId}&discord_username=${encodeURIComponent(discordUsername)}`

  return NextResponse.json({
    type: InteractionResponseType.CHANNEL_MESSAGE,
    data: {
      content: "🔗 **Connect your 1Code account to use /1code**\n\nClick the button below to link your Discord and 1Code accounts. This only takes a few seconds!",
      flags: MessageFlags.EPHEMERAL,
      components: [
        {
          type: ComponentType.ACTION_ROW,
          components: [
            {
              type: ComponentType.BUTTON,
              style: ButtonStyle.LINK,
              label: "Connect 1Code Account",
              url: authUrl,
            },
          ],
        },
      ],
    },
  })
}

/**
 * Show repo dropdown (ephemeral)
 */
async function showRepoDropdown(
  userId: string,
  prompt: string,
  channelId: string,
  discordUserId: string
) {
  // Fetch user's GitHub installations
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { github_installations: true },
  })

  const installations = (user?.github_installations as { installations?: GitHubInstallation[] })?.installations || []

  if (installations.length === 0) {
    return ephemeralResponse(
      "❌ **No GitHub repositories connected**\n\n" +
      "Please connect your GitHub account at https://21st.dev/agents/app → Settings → GitHub"
    )
  }

  // Fetch actual repos from all installations
  const allRepos: Array<{ installationId: string; fullName: string; private: boolean }> = []

  for (const inst of installations) {
    try {
      const { repositories } = await getInstallationRepositories(inst.installation_id, 1, 25)
      for (const repo of repositories) {
        allRepos.push({
          installationId: inst.installation_id,
          fullName: repo.full_name,
          private: repo.private,
        })
      }
    } catch (err) {
      console.error(`[Discord] Failed to fetch repos for installation ${inst.installation_id}:`, err)
    }
  }

  console.log("[Discord] Found repos:", allRepos.map(r => r.fullName))

  if (allRepos.length === 0) {
    return ephemeralResponse(
      "❌ **No repositories found**\n\n" +
      "Your GitHub App installation doesn't have access to any repositories."
    )
  }

  // Build dropdown options from actual repos
  const options = allRepos.slice(0, 25).map((repo) => ({
    label: repo.fullName.length > 100 ? repo.fullName.slice(0, 97) + "..." : repo.fullName,
    description: repo.private ? "Private" : "Public",
    value: `${repo.installationId}:${repo.fullName}`,
  }))

  // Encode prompt in custom_id (base64, max 100 chars)
  const promptBase64 = Buffer.from(prompt.slice(0, 500)).toString("base64")

  return NextResponse.json({
    type: InteractionResponseType.CHANNEL_MESSAGE,
    data: {
      content: `📦 **Select a repository for:** "${prompt.slice(0, 100)}${prompt.length > 100 ? "..." : ""}"`,
      flags: MessageFlags.EPHEMERAL,
      components: [
        {
          type: ComponentType.ACTION_ROW,
          components: [
            {
              type: ComponentType.STRING_SELECT,
              custom_id: `repo_select:${promptBase64}`,
              placeholder: "Select a repository...",
              options,
            },
          ],
        },
      ],
    },
  })
}

/**
 * Ephemeral message helper
 */
function ephemeralResponse(content: string) {
  return NextResponse.json({
    type: InteractionResponseType.CHANNEL_MESSAGE,
    data: {
      content,
      flags: MessageFlags.EPHEMERAL,
    },
  })
}

interface StartAgentParams {
  userId: string
  discordUserId: string
  discordUsername: string
  channelId: string
  guildId: string
  prompt: string
  repository: string
  installationId: string
  interactionToken: string
  applicationId: string
}

/**
 * Start the agent and send public confirmation
 */
async function startAgent(params: StartAgentParams) {
  const {
    userId,
    discordUserId,
    discordUsername,
    channelId,
    guildId,
    prompt,
    repository,
    installationId,
    interactionToken,
    applicationId,
  } = params

  const baseUrl = process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://21st.dev"

  // Get user's integrations
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      teams: {
        select: {
          id: true,
          claude_code_integration: true,
          linear_integration: true,
        },
        take: 1,
      },
    },
  })

  const team = user?.teams[0]
  if (!team) {
    return ephemeralResponse("❌ No workspace found. Please create one at https://21st.dev/agents/app")
  }

  // Update message to show we're starting (still ephemeral)
  // Then start async work

  processAgentWork({
    userId,
    teamId: team.id,
    discordUsername,
    channelId,
    guildId,
    prompt,
    repository,
    installationId,
    claudeCodeIntegration: team.claude_code_integration as ClaudeCodeIntegration | null,
    linearIntegration: team.linear_integration as LinearIntegration | null,
  }).catch((err) => {
    console.error("[Discord] Agent work failed:", err)
    sendDiscordMessage(channelId, `❌ Failed to start agent: ${err.message}`).catch(console.error)
  })

  // Return update message showing work started
  return NextResponse.json({
    type: InteractionResponseType.UPDATE_MESSAGE,
    data: {
      content: `✅ **Starting agent...**\n\n📦 Repository: \`${repository}\`\n📝 Task: "${prompt.slice(0, 100)}${prompt.length > 100 ? "..." : ""}"\n\nI'll post updates in this channel when ready!`,
      flags: MessageFlags.EPHEMERAL,
      components: [], // Remove dropdown
    },
  })
}

interface ProcessAgentWorkParams {
  userId: string
  teamId: string
  discordUsername: string
  channelId: string
  guildId: string
  prompt: string
  repository: string
  installationId: string
  claudeCodeIntegration: ClaudeCodeIntegration | null
  linearIntegration: LinearIntegration | null
  // Automation fields (optional - only set when triggered via automation)
  automationExecutionId?: string
  automationName?: string
  addToInbox?: boolean
  respondToTrigger?: boolean
}

async function processAgentWork(params: ProcessAgentWorkParams) {
  const {
    userId,
    teamId,
    discordUsername,
    channelId,
    guildId,
    prompt,
    repository,
    installationId,
    claudeCodeIntegration,
    linearIntegration,
    automationExecutionId,
    automationName,
    addToInbox,
    respondToTrigger,
  } = params

  const baseUrl = process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://21st.dev"

  const isAutomation = !!automationExecutionId

  // Send public message that agent is starting (unless automation with respondToTrigger=false)
  if (!isAutomation || respondToTrigger !== false) {
    await sendDiscordMessage(
      channelId,
      `🤖 **1Code** is working on a task from **${discordUsername}**\n\n` +
      `📦 Repository: \`${repository}\`\n` +
      (automationName ? `⚡ Automation: **${automationName}**\n` : "") +
      `📝 Task: "${prompt.slice(0, 200)}${prompt.length > 200 ? "..." : ""}"`
    )
  }

  // 1. Create sandbox
  console.log(`[Discord] Creating sandbox for ${repository}...`)
  const { sandboxId, sandboxUrl, usesClaudeCodeOAuth } = await createAgentSandbox({
    userId,
    repository,
    installationId,
    claudeCodeIntegration,
    linearIntegration,
  })

  // 2. Create AgentChat
  const chat = await prisma.agentChat.create({
    data: {
      user_id: userId,
      team_id: teamId,
      sandbox_id: sandboxId,
      credit_source: usesClaudeCodeOAuth ? "claude_code" : "personal",
      name: prompt.slice(0, 100),
      meta: {
        source: "discord",
        discord: { guildId, channelId },
        triggeredBy: discordUsername,
        repository,
        ...(isAutomation && {
          automation_id: automationExecutionId,
          automation_name: automationName,
          automation_add_to_inbox: addToInbox,
          automation_respond_to_trigger: respondToTrigger,
        }),
      },
    },
  })

  // 3. Create AgentSubChat with initial message
  const subChatId = crypto.randomUUID()
  const initialMessage = {
    id: crypto.randomUUID(),
    role: "user" as const,
    parts: [{ type: "text" as const, text: prompt }],
  }

  await prisma.agentSubChat.create({
    data: {
      id: subChatId,
      chat_id: chat.id,
      name: "Discord Task",
      mode: "agent",
      messages: [initialMessage],
    },
  })

  // 4. Create IntegrationTask
  await prisma.integrationTask.create({
    data: {
      chat_id: chat.id,
      team_id: teamId,
      platform: "discord",
      external_id: `discord-${guildId}-${Date.now()}`,
      external_url: `https://discord.com/channels/${guildId}/${channelId}`,
      external_title: prompt.slice(0, 100),
      metadata: { guildId, channelId, triggeredBy: discordUsername, prompt },
      status: "in_progress",
    },
  })

  // 5. Update automation execution with chat ID if this is an automation run
  if (isAutomation && automationExecutionId) {
    await updateAutomationExecution(automationExecutionId, "success", chat.id)
  }

  // 6. Send progress link (unless automation with respondToTrigger=false)
  if (!isAutomation || respondToTrigger !== false) {
    const chatUrl = addToInbox
      ? `${baseUrl}/agents/app/inbox?chat=${chat.id}`
      : `${baseUrl}/agents/app?chat=${chat.id}`
    await sendDiscordMessage(
      channelId,
      `🔗 [View live progress](${chatUrl})`
    )
  }

  // 7. Trigger agent (fire and forget)
  console.log(`[Discord] Triggering agent for chat ${chat.id}...`)

  fetch(`${baseUrl}/api/1code/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "sandbox-url": sandboxUrl,
      "parent-chat-id": chat.id,
      "sub-chat-name": "Discord Task",
      "sub-chat-mode": "agent",
      "x-internal-token": process.env.INTERNAL_API_SECRET || "",
      "x-user-id": userId,
    },
    body: JSON.stringify({
      messages: [initialMessage],
      id: subChatId,
    }),
  }).catch((err) => {
    console.error(`[Discord] Failed to trigger agent:`, err)
  })

  console.log(`[Discord] Agent triggered for chat ${chat.id}`)
}
