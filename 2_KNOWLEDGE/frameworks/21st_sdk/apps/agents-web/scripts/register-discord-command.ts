/**
 * Register the /1code slash command with Discord
 *
 * Run with: npx tsx scripts/register-discord-command.ts
 */

const DISCORD_APPLICATION_ID = process.env.DISCORD_CLIENT_ID
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN

if (!DISCORD_APPLICATION_ID || !DISCORD_BOT_TOKEN) {
  console.error("Missing DISCORD_CLIENT_ID or DISCORD_BOT_TOKEN env vars")
  process.exit(1)
}

const command = {
  name: "1code",
  description: "Ask 1Code AI agent to help with a task",
  options: [
    {
      name: "prompt",
      description: "What do you want 1Code to do?",
      type: 3, // STRING type
      required: true,
    },
  ],
}

async function registerCommand() {
  console.log("Registering /1code command...")

  const response = await fetch(
    `https://discord.com/api/v10/applications/${DISCORD_APPLICATION_ID}/commands`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      },
      body: JSON.stringify(command),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    console.error("Failed to register command:", error)
    process.exit(1)
  }

  const data = await response.json()
  console.log("Command registered successfully!")
  console.log("Command ID:", data.id)
  console.log("Command name:", data.name)
}

registerCommand()
