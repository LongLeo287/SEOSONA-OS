# SlideJ Framework Workflow

SlideJ is a JSON-first CLI tool for generating PowerPoint (.pptx) presentations and parsing them back to JSON. It is designed to be used by AI agents and developers for programmatic slide generation with animations.

## Core Capabilities
- **JSON -> PPTX**: `slidej generate <input.json> -o <output.pptx>`
- **PPTX -> JSON**: `slidej parse <input.pptx> -o <output.json>`
- **Templates**: Built-in templates like `pitch-deck`, `report`, `minimal` which define color palettes, layouts, and components.
  - `slidej template list`: View templates.
  - `slidej template use <name>`: Export template to JSON.

## Workflow for AI Agents
1. **New Presentation from Template**:
   - `slidej template use <name> -o deck.json`
   - AI modifies the `deck.json` (replacing text, colors, adding/removing slides).
   - `slidej generate deck.json -o final.pptx`
2. **Edit Existing Presentation**:
   - `slidej parse input.pptx -o deck.json`
   - AI edits the JSON.
   - `slidej generate deck.json -o updated.pptx`

## Features
- **Elements**: Supports Text, Shapes (20+ types), Images (local or base64), and Tables.
- **Animations**: Entrance, Exit, and Emphasis effects (e.g., `flyIn`, `fadeOut`, `pulse`) with triggers (`onClick`, `withPrevious`).
- **Measurements**: Slide dimensions and positions are calculated in inches (standard 16:9 is 13.333 x 7.5).
