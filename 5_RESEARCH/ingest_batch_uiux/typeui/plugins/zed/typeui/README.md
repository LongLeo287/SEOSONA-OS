# TypeUI Zed Extension

TypeUI connects Zed's Agent Panel to the hosted TypeUI MCP server so it can use curated design systems, UI prompts, and layout variations while building interfaces.

## Install TypeUI MCP today

Until the Zed extension is approved in the marketplace, add TypeUI as a custom MCP server in Zed settings:

```json
{
  "context_servers": {
    "typeui": {
      "url": "https://mcp.typeui.sh/mcp"
    }
  }
}
```

If Zed asks you to authenticate, sign in with TypeUI.

## Test the extension locally

For local validation from a checkout of the public repository:

1. Install Rust with `rustup`.
2. Open Zed Extensions.
3. Run `zed: install dev extension`.
4. Select `plugins/zed/typeui`.

The extension installs `mcp-remote` and uses it to bridge Zed's extension context server command to the hosted TypeUI MCP endpoint.

## Distribution

Submit this extension to the official Zed extensions registry with `plugins/zed/typeui` as the extension path. The registry entry should point to the public TypeUI repository and include the subdirectory path:

```toml
[typeui]
submodule = "extensions/typeui"
path = "plugins/zed/typeui"
version = "1.0.0"
```

## Links

- Website: https://www.typeui.sh
- Documentation: https://www.typeui.sh/docs
- Zed setup guide: https://www.typeui.sh/docs/guides/zed
- Privacy policy: https://www.typeui.sh/privacy
- Terms of service: https://www.typeui.sh/terms
