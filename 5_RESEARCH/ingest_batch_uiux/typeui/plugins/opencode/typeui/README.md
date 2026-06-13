# TypeUI OpenCode Plugin

TypeUI connects OpenCode to the hosted TypeUI MCP server so it can use curated design systems, UI prompts, and layout variations while building interfaces.

OpenCode loads plugins from local files or npm packages, and it connects remote MCP servers through the `mcp` section in `opencode.json`. The MCP configuration is the required part that makes TypeUI tools available to OpenCode.

## Install TypeUI MCP

Add this to your project `opencode.json` file:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "typeui": {
      "type": "remote",
      "url": "https://mcp.typeui.sh/mcp",
      "enabled": true
    }
  }
}
```

If OpenCode asks you to authenticate, sign in with TypeUI. You can also trigger authentication manually:

```bash
opencode mcp auth typeui
```

## Optional helper plugin

After this package is published to npm, it can be added to OpenCode with:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["@bergside/opencode-typeui"]
}
```

The helper plugin exposes a `typeui_setup_help` tool that returns the TypeUI MCP configuration and setup link. It does not replace the required MCP configuration above.

## Links

- Website: https://www.typeui.sh
- Documentation: https://www.typeui.sh/docs
- OpenCode setup guide: https://www.typeui.sh/docs/guides/opencode
- Privacy policy: https://www.typeui.sh/privacy
- Terms of service: https://www.typeui.sh/terms
