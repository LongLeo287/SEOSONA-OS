export type IdeOption = "cursor" | "windsurf" | "cline" | "claude-code"
export type OsType = "windows" | "mac" | "linux"

interface McpCommandConfig {
  command: string
  args: string[]
}

const PACKAGE_NAMES = {
  CLI: "@21st-dev/cli@latest",
  MAGIC_MCP: "@21st-dev/magic@latest",
} as const

export const getMcpConfig = (apiKey: string): McpCommandConfig => ({
  command: "npx",
  args: ["-y", PACKAGE_NAMES.CLI, `API_KEY="${apiKey}"`],
})

export const getInstallCommand = (
  ide: IdeOption,
  apiKey: string,
  osType: OsType = "mac",
): string => {
  // Claude Code uses a different command format
  if (ide === "claude-code") {
    return `claude mcp add magic --scope user --env API_KEY="${apiKey}" -- npx -y ${PACKAGE_NAMES.MAGIC_MCP}`
  }

  const platformCmd = createPlatformCommand(
    ["-y", PACKAGE_NAMES.CLI, "install", ide, `--api-key "${apiKey}"`],
    osType,
  )

  return `${platformCmd.command} ${platformCmd.args.join(" ")}`
}

export const getMcpConfigJson = (
  apiKey: string,
  osType: OsType = "mac",
): string => {
  const platformCmd = createPlatformCommand(
    ["-y", PACKAGE_NAMES.MAGIC_MCP, `API_KEY="${apiKey}"`],
    osType,
  )

  const config = {
    mcpServers: {
      "@21st-dev/magic": platformCmd,
    },
  }
  return JSON.stringify(config, null, 2)
}

export const createPlatformCommand = (
  args: string[],
  osType: OsType = "mac",
) => {
  if (osType === "windows") {
    return {
      command: "cmd",
      args: ["/c", "npx", ...args],
    }
  }
  return {
    command: "npx",
    args,
  }
}

// New functions for Cursor deeplink integration
export const getCursorDeeplinkConfig = (
  apiKey: string,
  osType: OsType = "mac",
) => {
  const platformCmd = createPlatformCommand(
    ["-y", PACKAGE_NAMES.MAGIC_MCP, `API_KEY="${apiKey}"`],
    osType,
  )

  return platformCmd
}

export const generateCursorDeeplink = (
  apiKey: string,
  osType: OsType = "mac",
): string => {
  const config = getCursorDeeplinkConfig(apiKey, osType)
  const configString = JSON.stringify(config)
  const base64Config = btoa(configString)
  const encodedName = encodeURIComponent("Magic MCP")

  return `cursor://anysphere.cursor-deeplink/mcp/install?name=${encodedName}&config=${base64Config}`
}

export const isCursorDeeplinkSupported = (): boolean => {
  // Check if we're in a browser environment and if the user agent suggests desktop
  if (typeof window === "undefined") return false

  // Basic check for desktop environment (not mobile)
  const userAgent = navigator.userAgent.toLowerCase()
  const isMobile =
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent,
    )

  return !isMobile
}
