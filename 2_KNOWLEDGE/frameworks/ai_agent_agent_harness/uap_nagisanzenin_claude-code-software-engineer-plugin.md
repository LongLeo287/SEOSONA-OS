# KI: nagisanzenin/claude-code-software-engineer-plugin

## Overview
This project appears to be a plugin for Claude, specifically designed to augment its capabilities as a software engineer. The core functionality is defined within `plugin.json`, which describes the plugin's schema and endpoint definitions.  The `skills/software-engineer/SKILL.md` file suggests documentation or examples related to this specific skill set.

## Tech Stack (from code)
Based on the available files, it’s difficult to definitively determine a full tech stack. However:

*   **JSON:** The project heavily utilizes JSON for configuration and data exchange as evidenced by `plugin.json` (`.claude-plugin/plugin.json`).
    ```json
    {
      "schema_version": 1,
      "name_slug": "software-engineer",
      "display_name": "Software Engineer",
      "description": "Helps with software engineering tasks.",
      "logo_url": null,
      "documentation_url": null,
      "contact_email": null,
      "endpoints": [
        {
          "name": "generate_code",
          "description": "Generates code based on a description.",
          "spec": {
            "request": {
              "type": "object",
              "properties": {
                "prompt": {
                  "type": "string",
                  "description": "The prompt for generating code."
                }
              },
              "required": [
                "prompt"
              ]
            },
            "response": {
              "type": "object",
              "properties": {
                "code": {
                  "type": "string",
                  "description": "The generated code."
                }
              }
            }
          }
        }
      ]
    }
    ```

## Public API / Exports
Based on the provided files, it's not possible to determine a traditional software API. The `plugin.json` file *defines* an endpoint named "generate\_code". This is effectively the plugin’s public interface for Claude:
```json
{
  "endpoints": [
    {
      "name": "generate_code",
      "description": "Generates code based on a description.",
      // ... (rest of the endpoint definition)
    }
  ]
}
```

## Dependencies
There is no `package.json`, `requirements.txt` or similar dependency file provided, so dependencies cannot be determined from the available source code.

## Architecture Patterns
The project demonstrates a plugin architecture centered around an OpenAPI-like specification for its endpoint (`generate_code`). The structure suggests a modular design where specific skills (e.g., "software engineer") are encapsulated within their own directories.

## Relevance to SEOSONA OS
Without knowing the specifics of SEOSONA OS, it's difficult to assess direct relevance. However, the plugin’s ability to generate code based on prompts could be integrated into SEOSONA OS as a code generation tool or assistant. The modular skill-based design might also allow for easy integration of new software engineering skills into the OS. Further investigation would require understanding how SEOSONA OS handles plugins and external services.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
