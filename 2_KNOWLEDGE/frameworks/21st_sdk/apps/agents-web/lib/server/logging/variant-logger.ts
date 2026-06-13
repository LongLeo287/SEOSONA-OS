import { writeFile, appendFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import { join } from "path"

export class VariantLogger {
  private logDir: string
  private chatId: string
  private logFile: string
  private isProduction: boolean

  constructor(chatId: string, projectId: string) {
    this.chatId = chatId
    this.isProduction = process.env.NODE_ENV === "production"
    this.logDir = join(process.cwd(), "logs", "variants", projectId)

    this.logFile = join(this.logDir, `${chatId}.log`)
    console.log(
      `[VariantLogger] Logger created for chat ${chatId}, log path: ${this.logFile}, isProduction: ${this.isProduction}`,
    )
  }

  private async ensureLogDir() {
    if (this.isProduction) {
      return true
    }

    try {
      if (!existsSync(this.logDir)) {
        await mkdir(this.logDir, { recursive: true })
      }
      return true
    } catch (error) {
      console.error(
        `[VariantLogger] Failed to create log directory ${this.logDir}:`,
        error,
      )
      return false
    }
  }

  private formatLogEntry(
    level: "INFO" | "ERROR" | "TOOL" | "RESPONSE",
    message: string,
    data?: any,
  ) {
    const timestamp = new Date().toISOString()
    const dataStr = data ? `\n${JSON.stringify(data, null, 2)}` : ""
    return `[${timestamp}] [${level}] [${this.chatId}] ${message}${dataStr}\n`
  }

  async logInfo(message: string, data?: any) {
    console.log(`[VariantLogger] ${message}`, data || "")

    // Only write to file in development
    if (!this.isProduction) {
      await this.ensureLogDir()
      const entry = this.formatLogEntry("INFO", message, data)
      await appendFile(this.logFile, entry).catch((error) => {
        console.error(
          `[VariantLogger] Failed to write log to ${this.logFile}:`,
          error,
        )
      })
    }
  }

  async logError(message: string, error?: any) {
    console.error(`[VariantLogger] ${message}`, error || "")

    // Only write to file in development
    if (!this.isProduction) {
      await this.ensureLogDir()
      const entry = this.formatLogEntry("ERROR", message, error)
      await appendFile(this.logFile, entry).catch(console.error)
    }
  }

  async logTool(toolName: string, input: any, output?: any) {
    const toolData = {
      tool: toolName,
      input,
      output: output || "pending...",
      timestamp: new Date().toISOString(),
    }
    console.log(`[VariantLogger] Tool: ${toolName}`, toolData)

    // Only write to file in development
    if (!this.isProduction) {
      await this.ensureLogDir()
      const entry = this.formatLogEntry("TOOL", `Tool: ${toolName}`, toolData)
      await appendFile(this.logFile, entry).catch((error) => {
        console.error(
          `[VariantLogger] Failed to write tool log to ${this.logFile}:`,
          error,
        )
      })
    }
  }

  async logResponse(message: string, tokenUsage?: any) {
    const responseData = {
      message: message.substring(0, 200) + (message.length > 200 ? "..." : ""),
      fullLength: message.length,
      tokenUsage,
      timestamp: new Date().toISOString(),
    }
    console.log(`[VariantLogger] AI Response`, responseData)

    // Only write to file in development
    if (!this.isProduction) {
      await this.ensureLogDir()
      const entry = this.formatLogEntry("RESPONSE", "AI Response", responseData)
      await appendFile(this.logFile, entry).catch(console.error)
    }
  }

  async logVariantCreation(variantConfig: any, userMessage: string) {
    const creationData = {
      chatId: this.chatId,
      config: variantConfig,
      userMessage:
        userMessage.substring(0, 500) + (userMessage.length > 500 ? "..." : ""),
      timestamp: new Date().toISOString(),
    }

    console.log(`[VariantLogger] Variant Created`, creationData)

    // Only write to file in development
    if (!this.isProduction) {
      await this.ensureLogDir()

      // Create initial log file with variant info
      const header = `
=====================================
VARIANT GENERATION LOG
=====================================
Chat ID: ${this.chatId}
Config: ${variantConfig?.slug || "unknown"}
Model: ${variantConfig?.model || "unknown"}
Created: ${new Date().toISOString()}
User Message: ${userMessage}
=====================================

`
      const entry = this.formatLogEntry("INFO", "Variant Created", creationData)
      await writeFile(this.logFile, header + entry).catch(console.error)
    }
  }

  async logCompletion(success: boolean, finalData?: any) {
    const completionData = {
      success,
      finalData,
      timestamp: new Date().toISOString(),
    }

    console.log(
      `[VariantLogger] Variant ${success ? "Completed" : "Failed"}`,
      completionData,
    )

    // Only write to file in development
    if (!this.isProduction) {
      await this.ensureLogDir()

      const footer = `
=====================================
VARIANT GENERATION ${success ? "COMPLETED" : "FAILED"}
=====================================
Finished: ${new Date().toISOString()}
Success: ${success}
=====================================

`

      const entry = this.formatLogEntry(
        "INFO",
        success ? "Variant Completed" : "Variant Failed",
        completionData,
      )
      await appendFile(this.logFile, entry + footer).catch(console.error)
    }
  }

  // Static method to get logs directory for cleanup or analysis
  static getLogsDir(projectId: string) {
    const isProduction = process.env.NODE_ENV === "production"
    if (isProduction) {
      return join("/tmp", "21st-logs", "variants", projectId)
    }
    return join(process.cwd(), "logs", "variants", projectId)
  }

  // Static method to list all variant logs for a project
  static async getVariantLogs(projectId: string) {
    // In production, we don't write log files, so return empty array
    if (process.env.NODE_ENV === "production") {
      return []
    }

    const logsDir = VariantLogger.getLogsDir(projectId)
    if (!existsSync(logsDir)) {
      return []
    }

    try {
      const { readdir } = await import("fs/promises")
      const files = await readdir(logsDir)
      return files
        .filter((f) => f.endsWith(".log"))
        .map((f) => f.replace(".log", ""))
    } catch (error) {
      console.error("Failed to read variant logs:", error)
      return []
    }
  }
}

// Export convenience function for creating logger
export function createVariantLogger(chatId: string, projectId: string) {
  return new VariantLogger(chatId, projectId)
}
