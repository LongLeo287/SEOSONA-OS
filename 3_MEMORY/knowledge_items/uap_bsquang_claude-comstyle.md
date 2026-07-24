# KI: bsquang/claude-comstyle

## Overview
This project appears to be a collection of style guides and related documentation, likely intended for use with the Claude AI assistant or similar systems. The presence of files like `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md` and `LICENSE` suggests it's designed to facilitate community contributions and adherence to specific standards. A key component is a "style switcher" skill defined in `skills/style-switcher.skill`.

## Tech Stack (from code)
The project utilizes a skill definition file format, specifically `.skill`, as evidenced by the file `skills/style-switcher.skill`.  This suggests it's designed to be consumed by a system that understands this custom file type. There are no readily apparent configuration files like `package.json` or `requirements.txt` within the provided directory structure, so further dependencies cannot be determined from the code alone.

## Public API / Exports
The primary "export" appears to be the `style-switcher.skill` file located in the `skills/` directory.  Its contents define a skill with specific instructions and parameters:

```
skills/style-switcher.skill
```
```
name: Style Switcher
description: Allows users to switch between different writing styles.
version: 1.0
author: bsquang
parameters:
  - name: style
    type: string
    description: The desired writing style (e.g., formal, informal, creative).
    required: true
```

The `SKILL.md` file within the `skills/style-switcher/` directory provides additional documentation related to this skill.

## Dependencies
There are no dependency files present in the provided code snippet (`package.json`, `requirements.txt`, etc.). Therefore, dependencies cannot be determined from the available source code.

## Architecture Patterns
The project demonstrates a modular architecture with the use of "skills."  Skills appear to be self-contained units that define specific functionalities (in this case, style switching). The separation into a skill definition file (`style-switcher.skill`) and accompanying documentation (`SKILL.md`) promotes reusability and maintainability.

## Relevance to SEOSONA OS
The "skills" architecture used in this project could be beneficial for SEOSONA OS if the OS supports or can adapt to consume custom skill definitions.  Specifically, the style-switching functionality defined by `style-switcher.skill` could be integrated into SEOSONA OS to allow users to customize the writing style of generated content or AI interactions. The modular design also aligns well with a plugin/extension architecture that would promote extensibility within SEOSONA OS.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `skill.md`
- **All scores:** {'seosona-os': 41, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
