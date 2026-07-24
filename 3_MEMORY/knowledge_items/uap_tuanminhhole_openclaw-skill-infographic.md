# KI: tuanminhhole/openclaw-skill-infographic

## Overview
This project is an OpenClaw skill designed to generate infographics and posters using the 9Router API. The `image-generator.js` script takes a prompt as input, generates an image via 9Router, and saves it to a specified output path (defaulting to "image.png"). It dynamically locates configuration files (`openclaw.json`) to retrieve API keys and base URLs for the 9Router service.

## Tech Stack (from code)
- **JavaScript:** The primary language used in `image-generator.js`.  This is evident from the file extension `.js` and the use of JavaScript syntax throughout the file.
- **Node.js:** The script uses Node.js built-in modules like `fs` (file system) and `path`, indicating a Node.js environment. This is also confirmed by the shebang line (`#!/usr/bin/env node`) which is missing but implied by usage of `require`.
- **JSON:** Configuration data, including API keys and base URLs, are stored in JSON format within `openclaw.json` (and potentially `.openclaw/openclaw.json`). This is evident from the code parsing these files using `JSON.parse()`.

## Public API / Exports
The script itself acts as a command-line tool rather than exposing a traditional public API.  It's invoked via Node.js with arguments:
```javascript
const prompt = process.argv[2];
const outputPath = process.argv[3] || 'image.png';
```
This demonstrates how the script receives input and produces output based on command-line arguments. There are no explicit `export` statements or module exports visible in the provided code snippet.

## Dependencies
Based on `package.json`:
- **fs:** (Node.js built-in) - File system module for reading files.
- **path:** (Node.js built-in) - Path manipulation utility.
The project does not list any external dependencies in the `package.json` file beyond Node.js core modules.

## Architecture Patterns
- **Configuration Driven Development:** The script dynamically loads configuration from `openclaw.json` or environment variables, allowing for customization without modifying the code itself. This is evident in:
```javascript
let apiKey = process.env.NINE_ROUTER_API_KEY || '';
let baseUrl = process.env.NINE_ROUTER_BASE_URL || 'http://9router:20128/v1';

if (openclawJsonPath) {
    try {
        const config = JSON.parse(fs.readFileSync(openclawJsonPath, 'utf8'));
        const provider = config.models?.providers?.['9router'];
        if (provider) {
            if (provider.apiKey) apiKey = provider.apiKey;
            if (provider.baseUrl) baseUrl = provider.baseUrl;
        }
    } catch (e) {}
}
```
- **Dynamic File Path Resolution:** The script dynamically locates the `openclaw.json` file by searching up the directory tree, making it more flexible and adaptable to different project structures. This is demonstrated in:
```javascript
let openclawJsonPath = '';
let currentDir = process.cwd();
for (let i = 0; i < 5; i++) {
    const candidate = path.join(currentDir, 'openclaw.json');
    if (fs.existsSync(candidate)) {
        openclawJsonPath = candidate;
        break;
    }
    // ... other checks for .openclaw/openclaw.json
    const parent = path.dirname(currentDir);
    if (parent === currentDir) break;
    currentDir = parent;
}
```

## Relevance to SEOSONA OS
This project's code demonstrates a pattern of dynamically loading configuration and using external APIs, which could be valuable for SEOSONA OS. Specifically:

- **Configurable Skill Integration:** The dynamic `openclaw.json` lookup mechanism allows SEOSONA OS to easily integrate skills that rely on external services without hardcoding API keys or URLs within the core system.
- **API Abstraction:**  The script's interaction with 9Router highlights a good example of abstracting away specific API details, which could be adapted for other integrations within SEOSONA OS. The pattern of using environment variables and configuration files can ensure secure and flexible integration.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `skill.md`
- **All scores:** {'seosona-os': 41, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 28}
