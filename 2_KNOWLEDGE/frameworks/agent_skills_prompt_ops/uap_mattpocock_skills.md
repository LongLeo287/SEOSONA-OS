# KI: mattpocock/skills

## Overview
This repository, `mattpocock/skills`, appears to be a collection of "agent skills" designed for engineering workflows, likely intended to be used with an AI assistant or automation system. The project organizes these skills into buckets based on their purpose and stage of development, with a focus on documentation and integration within a larger ecosystem.  The structure emphasizes clear organization, versioning, and linking between skill definitions and associated documentation.

## Tech Stack (from code)
- **JavaScript/Node.js:** The `package.json` file indicates the project is built using Node.js. It uses npm as its package manager.
```json
{
  "name": "mattpocock-skills",
  "version": "1.0.1",
  "private": true,
  "description": "Matt Pocock's agent skills for real engineering",
  "repository": {
    "type": "git",
    "url": "https://github.com/mattpocock/skills"
  },
  "license": "MIT",
  "scripts": {
    "changeset": "changeset",
    "version": "changeset version"
  },
  "devDependencies": {
    "@changesets/changelog-github": "^0.7.0",
    "@changesets/cli": "^2.30.0"
  },
  "packageManager": "npm@10.9.4"
}
```

## Public API / Exports
Due to the nature of this project (primarily configuration and documentation), there are no readily apparent public APIs or exported functions directly visible in the source code. The `CLAUDE.md` file describes how skills are structured and linked, suggesting that the "public API" is more about the organization and metadata associated with each skill rather than explicit code exports.  The `.claude-plugin/plugin.json` file likely defines the structure of the plugin used by Claude or a similar agent, but its contents are not provided in the given source.

## Dependencies
Based on `package.json`, the project has the following dependencies:
- `@changesets/changelog-github`:  Version 0.7.0 - Used for generating changelogs for GitHub releases.
- `@changesets/cli`: Version 2.30.0 - A command-line tool for managing versioning and changelog generation.

## Architecture Patterns
- **Bucket-based Organization:** The project utilizes a bucket system (`skills/engineering`, `skills/productivity`, etc.) to categorize skills based on their purpose and development stage. This promotes modularity and organization.
- **Documentation-Driven Development:**  A strong emphasis is placed on documentation, with each skill having an associated `SKILL.md` file and often a corresponding documentation page in the `docs/` directory. The `CLAUDE.md` file explicitly outlines rules for maintaining this documentation.
- **Centralized Routing (ask-matt):**  The `ask-matt` skill acts as a central router, mapping user requests to appropriate skills. This suggests a layered architecture where a single entry point manages the flow of interactions.
- **Symlinking:** The `scripts/link-skills.sh` script uses symlinks to integrate skills into a local harness directory (`~/.claude/skills`, `~/.agents/skills`), indicating an external execution environment for these skills.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:
- **Skill Management Framework:** The bucket-based organization and documentation practices provide a model for managing and organizing AI agent skills within the SEOSONA OS ecosystem.
- **Routing Architecture:**  The `ask-matt` skill’s routing pattern can be adapted to create a centralized dispatch mechanism for handling user requests and directing them to appropriate agents or functions within SEOSONA OS.
- **Documentation Standards:** The project's strict documentation guidelines could serve as a template for establishing consistent documentation standards for skills and components in SEOSONA OS, improving maintainability and usability.
- **Symlinking Integration:**  The symlinking approach used by `link-skills.sh` offers a potential method for integrating external skill implementations into the core SEOSONA OS environment.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
