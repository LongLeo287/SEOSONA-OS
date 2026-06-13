import { existsSync, readFileSync } from "fs"

const PRIVATE_ENV_PATH = "/home/user/.env"

export function getPrivateEnvNames(): string[] {
  if (!existsSync(PRIVATE_ENV_PATH)) {
    return []
  }

  try {
    return readFileSync(PRIVATE_ENV_PATH, "utf-8")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .filter((line) => !line.startsWith("#"))
      .map((line) => line.split("=")[0]?.trim())
      .filter((name): name is string => Boolean(name))
  } catch (error) {
    console.error(`Failed to read ${PRIVATE_ENV_PATH}:`, error)
    return []
  }
}
