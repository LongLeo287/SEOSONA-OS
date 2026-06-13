import { tool } from "@opencode-ai/plugin";

const TYPEUI_MCP_URL = "https://mcp.typeui.sh/mcp";
const TYPEUI_DOCS_URL = "https://www.typeui.sh/docs/guides/opencode";

const configSnippet = `{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "typeui": {
      "type": "remote",
      "url": "${TYPEUI_MCP_URL}",
      "enabled": true
    }
  }
}`;

export const TypeUIPlugin = async () => {
  return {
    tool: {
      typeui_setup_help: tool({
        description: "Show the TypeUI MCP configuration needed to use TypeUI with OpenCode.",
        args: {},
        async execute() {
          return [
            "Add TypeUI to OpenCode by adding this MCP server to opencode.json:",
            "",
            configSnippet,
            "",
            "Then authenticate if OpenCode asks you to sign in:",
            "",
            "opencode mcp auth typeui",
            "",
            `Docs: ${TYPEUI_DOCS_URL}`,
          ].join("\n");
        },
      }),
    },
  };
};

export default TypeUIPlugin;
