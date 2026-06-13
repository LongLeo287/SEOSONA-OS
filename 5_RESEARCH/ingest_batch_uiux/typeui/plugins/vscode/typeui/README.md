# TypeUI VS Code Plugin

TypeUI connects GitHub Copilot in Visual Studio Code to the hosted TypeUI MCP server so it can use curated design systems, UI prompts, and layout variations while building interfaces.

## Install the TypeUI plugin

After TypeUI is available in VS Code agent plugin discovery, open the Extensions view and search:

```text
@agentPlugins TypeUI
```

You can also install the plugin from source:

1. Open the Command Palette.
2. Run `Chat: Install Plugin From Source`.
3. Enter `https://github.com/bergside/typeui`.

This repository has a root `plugin.json` for direct source installs and a `.github/plugin/marketplace.json` marketplace entry for VS Code and GitHub Copilot plugin discovery.

## Install TypeUI MCP directly

The fastest way to install TypeUI in VS Code is from the TypeUI guide:

https://www.typeui.sh/docs/guides/vscode

You can also install it from your terminal:

```bash
code --add-mcp '{"name":"typeui","type":"http","url":"https://mcp.typeui.sh/mcp"}'
```

Or add it to `.vscode/mcp.json` in your project:

```json
{
  "servers": {
    "typeui": {
      "type": "http",
      "url": "https://mcp.typeui.sh/mcp"
    }
  }
}
```

## Agent plugin files

- `plugin.json` describes the TypeUI plugin.
- `.mcp.json` registers the hosted TypeUI MCP server.
- The repository root `plugin.json` mirrors this plugin for easier source installation.

## Links

- Website: https://www.typeui.sh
- Documentation: https://www.typeui.sh/docs
- VS Code setup guide: https://www.typeui.sh/docs/guides/vscode
- Privacy policy: https://www.typeui.sh/privacy
- Terms of service: https://www.typeui.sh/terms
