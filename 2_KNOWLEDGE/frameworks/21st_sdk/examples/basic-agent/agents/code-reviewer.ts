import { agent, tool } from "@an-sdk/agent"
import { z } from "zod"

export default agent({
  model: "claude-sonnet-4-6",
  systemPrompt: "You are a code reviewer. Review files for bugs, style issues, and improvements.",
  tools: {
    lint: tool({
      description: "Run ESLint on a file",
      inputSchema: z.object({ path: z.string().describe("File path to lint") }),
      execute: async ({ path }) => {
        const { execSync } = await import("child_process")
        try {
          const output = execSync(`npx eslint ${path}`, { encoding: "utf-8" })
          return { content: [{ type: "text", text: output || "No issues found." }] }
        } catch (error: any) {
          return { content: [{ type: "text", text: error.stdout || error.message }] }
        }
      },
    }),
  },
})
