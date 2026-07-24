# KI: tuanminhhole/openclaw-skill-learning-memory

## Overview
This repository contains a skill for OpenClaw designed to enable autonomous long-term memory updates and self-evolving skill synthesis. The `install.js` script appears to be the primary entry point, responsible for locating the `openclaw.json` configuration file and performing setup tasks.  The project aims to provide a "second brain" functionality through integration with OpenClaw agents.

## Tech Stack (from code)
- **JavaScript:** The presence of files like `install.js`, `publish.js`, and the use of `require('fs')` and `path` modules in `install.js` indicates that this project is written in JavaScript.  (File: `install.js`)
- **Node.js:** The script uses Node.js built-in modules like `fs` (file system) and `path`, confirming its execution environment. (File: `install.js`)
- **npm/package.json:** The project utilizes npm as a package manager, evidenced by the presence of a `package.json` file which defines dependencies and scripts. (File: `package.json`)

## Public API / Exports
Based on the provided code snippets, it's difficult to determine the public API definitively. However, `install.js` contains functions like `findOpenclawJson()` and `resolveWorkspacePath()`. These are internal helper functions used within the script itself and not explicitly exported as a public API. The `package.json` file defines a post-install script that executes `node install.js`, suggesting this script is intended to be run as part of an installation process rather than providing a directly callable API.

## Dependencies
The following dependencies are listed in the `package.json` file:

```json
{
  "name": "learning-memory",
  "version": "1.0.7",
  "description": "An OpenClaw skill to enable autonomous long-term memory updates (MEMORY.md) and self-evolving skill synthesis.",
  "main": "install.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 0",
    "postinstall": "node install.js"
  },
  "keywords": [
    "openclaw",
    "skill",
    "memory",
    "self-evolving",
    "agents",
    "learning",
    "secondbrain"
  ],
  "author": "tuanminhhole (Kent)",
  "license": "MIT"
}
```

There are no explicit dependencies listed in the `package.json` file beyond Node.js built-in modules.

## Architecture Patterns
- **Configuration File Driven:** The script heavily relies on locating and parsing an `openclaw.json` configuration file to determine its operational context. (File: `install.js`)
- **Environment Variable Aware:**  The `findOpenclawJson()` function checks for environment variables (`OPENCLAW_HOME`, `OPENCLAW_STATE_DIR`, `HOME`, `USERPROFILE`, `HOMEPATH`) to locate the configuration file, indicating a design that adapts to different deployment environments. (File: `install.js`)
- **Fallback Mechanisms:** The script implements multiple fallback strategies for locating the `openclaw.json` file, demonstrating resilience in various installation scenarios. (File: `install.js`)

## Relevance to SEOSONA OS
The project's focus on autonomous memory updates and self-evolving skills aligns with potential needs within a complex operating system like SEOSONA OS. The ability to locate configuration files based on environment variables could be valuable for deploying OpenClaw skills across different SEOSONA OS environments or containerized deployments.  However, without more code context, it's difficult to assess the full integration possibilities.

## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `agent` · **Fit:** 44/100 · **Auto-apply:** False
- **Evidence:** `agent`, `workflow`
- **All scores:** {'seosona-os': 44, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 28}
