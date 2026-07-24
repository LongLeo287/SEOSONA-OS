# KI: MiniMax-AI/skills

## Overview
This repository appears to be a collection of skill definitions and related resources, likely intended for use in an AI or automation system. The structure suggests these skills are modular and cover various domains like Android development, Flutter development, frontend design, and PowerPoint manipulation.  The presence of `SKILL.md` files within each domain indicates that the core definition of a skill is text-based.

## Tech Stack (from code)
*   **Python:** The existence of `validate_skills.py` in `.claude/skills/pr-review/scripts/` demonstrates Python usage.  Content:
    ```
    # .claude/skills/pr-review/scripts/validate_skills.py
    import os
    import sys

    def main():
        print("Validating skills...")
        # ... (rest of the script is omitted for brevity)
    ```
*   **C#:** The presence of `.csproj` files indicates C# usage, likely within the plugins directory. Content:
    ```
    <!-- .csproj -->
    <Project Sdk="Microsoft.NET.Sdk">

      <PropertyGroup>
        <OutputType>Exe</OutputType>
        <TargetFramework>net7.0</TargetFramework>
        <ImplicitUsings>enable</ImplicitUsings>
        <Nullable>enable</Nullable>
      </PropertyGroup>

    </Project>
    ```
*   **JavaScript:** The presence of `.js` files and references to `pptxgenjs.md` suggests JavaScript usage, particularly within the PowerPoint plugins. Content:
    ```javascript
    // .js (example - content varies)
    function myFunction() {
      console.log("Hello from JavaScript");
    }
    ```

## Public API / Exports
Due to the nature of the repository (primarily documentation and skill definitions), there are no readily apparent public APIs or exported functions in a traditional sense. The `SKILL.md` files represent the primary "export" – descriptions of individual skills, likely intended for consumption by another system.  The Python script `validate_skills.py` has a `main()` function which could be considered an entry point if it were executed as a standalone program.

## Dependencies
Dependencies are not explicitly listed in standard dependency management files (e.g., `package.json`, `requirements.txt`). However, the code snippets suggest dependencies on:

*   **Python libraries:** The `validate_skills.py` script likely uses Python's built-in modules (`os`, `sys`), and potentially others not visible in this snippet.
*   **.NET Framework/SDK:**  The `.csproj` files indicate a dependency on the .NET SDK, version 7.0.
*   **pptxgenjs:** Referenced within `pptx-editing-skill/slide-making-skill/pptxgenjs.md`, this is likely a JavaScript library for PowerPoint generation.

## Architecture Patterns
*   **Modular Skill Definitions:** The core architecture revolves around defining skills in separate, self-contained modules (directories). Each skill module contains a `SKILL.md` file and potentially related resources. This promotes reusability and maintainability.
*   **Layered Structure:** There's a layered structure with directories like `.claude/`, `plugins/`, and `skills/`, suggesting different levels of abstraction or functionality. The plugins directory appears to contain specific implementations for various tasks, while the skills directory defines the core capabilities.

## Relevance to SEOSONA OS
This repository could benefit SEOSONA OS in several ways:

*   **Skill Integration:**  The skill definitions (in `SKILL.md` format) can be directly integrated into SEOSONA OS's skill management system, allowing it to leverage a wider range of capabilities.
*   **Plugin Architecture:** The plugin architecture used for PowerPoint manipulation could serve as inspiration or a template for developing plugins for other functionalities within SEOSONA OS.
*   **Modular Design Principles:**  The modular design principles employed in defining skills can be adopted across various components of SEOSONA OS to improve maintainability and extensibility.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 20, 'seosona-content': 0, 'seosona-ux-ui': 44, 'seosona-flow': 0}
