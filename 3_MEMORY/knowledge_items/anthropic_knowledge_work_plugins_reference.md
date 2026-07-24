# KI: Anthropic Knowledge Work Plugins Reference

_Source: UAP Wave 3 analysis of `anthropics/knowledge-work-plugins`_

## Plugin Interface Contract
Anthropic's official plugin pattern consists of three components:
1. **Tool Definition**: JSON schema defining the tool's input/output interface
2. **System Prompt**: Context injection for the AI when using the tool
3. **Example Usage**: Demonstration of the tool in action

## MCP-First Design
- Plugins are designed for Model Context Protocol (MCP) integration
- Each plugin exposes a standardized MCP tool interface
- Supports both local and remote tool execution

## Key Patterns for SEOSONA OS
1. **Plugin = Tool + Context + Example**: Our skills already follow this pattern (Execution Steps + Guardrails + Example Invocation) but could formalize the tool definition as JSON schema.
2. **MCP Native**: Our `mcp_compatible` flag in SKILL.md should be expanded to include the actual MCP tool schema.
3. **Composability**: Plugins can chain — similar to our workflow concept but at a more granular level.

## Adoption Recommendations
- Consider creating `tool_schema.json` alongside each SKILL.md for MCP-compatible skills
- Use the plugin interface contract as the basis for `mcp_knowledge_server.py` expansion
- Standardize example usage format across all 540+ skills
