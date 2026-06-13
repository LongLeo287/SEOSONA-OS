# TypeUI MCP

TypeUI connects Zed's Agent Panel to the hosted TypeUI MCP server so your agent can use TypeUI design systems, UI prompts, and layout variations while editing UI.

After installing the extension, enable the TypeUI context server in the Agent Panel. Zed may ask you to authenticate with TypeUI through the MCP OAuth flow.

The extension uses the hosted MCP server by default:

```text
https://mcp.typeui.sh/mcp
```

You only need to change `mcp_url` if you are testing a staging or self-hosted TypeUI MCP deployment.
