# OpenAI Apps SDK

ChatGPT Widget and MCP Server data flow guidelines.

## 1. Decoupled Data/Render
* **Data Tools:** Return structured JSON payloads only (`structuredContent`).
* **Render Tools:** Attach UI resource URI (`_meta.ui.resourceUri`) and output templates.

## 2. Tool Description Standards
* Descriptions must start with: `"Use this when the user requests..."`.
* Declare tool flags: `readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`.
