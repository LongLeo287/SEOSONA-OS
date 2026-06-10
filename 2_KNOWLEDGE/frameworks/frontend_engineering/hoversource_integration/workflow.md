# HoverSource Integration Workflow: UI-to-Code Precision

## 1. Context & Purpose
HoverSource (https://github.com/loerei/HoverSource) is a zero-invasive UI-to-Code inspector. Users hover over UI elements, press `Alt+C`, and paste the generated metadata into the chat. 
This tool bridges the gap between visual intent ("fix this button") and codebase reality (`src/components/ui/Button.tsx`, line 42) without hallucination.

## 2. Standard Metadata Format
When a user pastes HoverSource data, it will typically look like this:
```markdown
### HoverSource Component Metadata
* **Component**: `PrimaryButton`
* **File Path**: `D:/Projects/MySaaSApp/src/components/ui/Button.tsx` (Line: 42, Column: 12)
* **Framework**: React
* **Dimensions**: 120x40
* **Key Styles**:
  - Color: `rgb(255, 255, 255)`
  - Background: `rgb(59, 130, 246)`
  - Margin: `8px` | Padding: `12px 24px`
```

## 3. Mandatory Execution Protocol
When the SEOSONA System detects the above metadata format in a user's prompt, the agent **MUST STRICTLY** follow these rules:

1. **STOP Guessing:** Do not use `grep_search` or global file searches to find the component. The user has explicitly provided the absolute **File Path**.
2. **Direct Navigation:** Use the `view_file` tool to open the exact file specified in the `File Path`.
3. **Precision Targeting:** Navigate directly to the `Line` number provided. The target component or CSS block is guaranteed to be there.
4. **Contextual Awareness:** Read the `Key Styles` to understand the current state before making edits. If the user asks "change it to red", you know the current background is `rgb(59, 130, 246)`.
5. **Modification:** Use `replace_file_content` or `multi_replace_file_content` targeting the precise lines discovered.

This protocol ensures zero hallucination, zero wasted tokens on searching, and instantaneous UI bug fixing.

