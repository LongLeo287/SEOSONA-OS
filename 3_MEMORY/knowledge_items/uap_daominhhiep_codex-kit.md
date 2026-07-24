# KI: daominhhiep/codex-kit

## Overview
Codex kit with reusable skills, subagents, workflows, and a project scaffold CLI.

## Tech Stack (from code)
- Python (19 files)
- JavaScript (12 files)
- TypeScript (React) (10 files)
- TypeScript (5 files)
- **Total:** 287 files, 132 directories
- **File types:** .md: 156, .csv: 24, .py: 19, .yaml: 18, .toml: 17, .js: 12, .tsx: 10, .json: 8

## Public API / Exports
- `SKILLS_MAP` from `src\lib\autoskills.js`
- `walkFiles` from `src\lib\fs.js`
- `pathExists` from `src\lib\fs.js`
- `readText` from `src\lib\fs.js`
- `writeText` from `src\lib\fs.js`
- `removePath` from `src\lib\fs.js`
- `sha256` from `src\lib\hash.js`
- `MANIFEST_PATH` from `src\lib\manifest.js`
- `readManifest` from `src\lib\manifest.js`
- `writeManifest` from `src\lib\manifest.js`
- `installManagedMcp` from `src\lib\mcp.js`
- `SKILL_CATEGORIES` from `src\lib\skills.js`
- `loadTemplateFiles` from `src\lib\templates.js`

## Imports Detected in Source
- `node:crypto`
- `node:fs`
- `node:os`
- `node:path`
- `node:url`

## Available Commands
- `npm run test` -- `node --test`

## File Structure
```
  .gitignore
  CHANGELOG.md
  LICENSE
  README.md
  package.json
  .agents/
    plugins/
      marketplace.json
  plugins/
    codex-kit/
      .codex-plugin/
        plugin.json
      skills/
        codex-kit/
          SKILL.md
  src/
    cli.js
    lib/
      autoskills.js
      fs.js
      hash.js
      kit.js
      manifest.js
      mcp.js
      skills.js
      templates.js
  templates/
    project/
      AGENTS.md
      AGENT_FLOW.md
      ARCHITECTURE.md
      .agents/
        .shared/
          ui-ux-pro-max/
            data/
              charts.csv
              colors.csv
              icons.csv
              landing.csv
              products.csv
              prompts.csv
              react-performance.csv
              styles.csv
              typography.csv
              ui-reasoning.csv
              ux-guidelines.csv
              web-interface.csv
              stacks/
                flutter.csv
                html-tailwind.csv
                jetpack-compose.csv
                nextjs.csv
                nuxt-ui.csv
                nuxtjs.csv
                react-native.csv
                react.csv
                shadcn.csv
                svelte.csv
                swiftui.csv
                vue.csv
            scripts/
              core.py
              design_system.py
              search.py
        skills/
          doc.md
          api-patterns/
            SKILL.md
            api-style.md
            auth.md
            documentation.md
            graphql.md
            rate-limiting.md
            response.md
            rest.md
            security-testing.md
            trpc.md
            versioning.md
            scripts/
              api_validator.py
          app-builder/
            SKILL.md
            agent-coordination.md
            feature-building.md
            project-detection.md
            scaffolding.md
            tech-stack.md
            agents/
              openai.yaml
            templates/
            
```

## Key Source Excerpts
### src\lib\autoskills.js
```javascript
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { pathExists, writeText } from "./fs.js";
import {
  getSelectedShippedSkills,
  loadSkillTemplates
} from "./skills.js";

const SCAN_SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  "vendor",
  ".next",
  "dist",
  "build",
  ".output",
  ".nuxt",
  ".svelte-kit",
  "__pycache__",
  ".cache",
  "coverage",
  ".turbo",
  ".terraform",
  "var",
  "bin",
  "obj",
  ".vs",
  ".agents",
  ".codex",
  ".codex-kit",
  ".idea",
  ".vscode"
]);

const FRONTEND_PACKAGES = new Set([
  "react",
  "vue",
  "svelte",
  "astro",
  "next",
  "nuxt",
  "@angular/core",
  "@sveltejs/kit",
  "solid-js",
  "lit",
  "preact",
  "qwik"
]);

const WEB_FRONTEND_EXTENSIONS = new Set([
  ".html",
  ".htm",
  ".css",
  ".scss",
  ".sass",
  ".less",
  ".vue",
  ".svelte",
  ".jsx",
  ".tsx",
  ".astro"
]);

const FRONTEND_BONUS_SKILLS = [
  "frontend-design",
  "web-design-guidelines",
  "seo-fundamentals"
];

export const SKILLS_MAP = [
  {
    id: "react",
    name: "React",
    detect: { packages: ["react", "react-dom"] },
    skills: ["nextjs-react-expert", "frontend-design"]
  },
  {
    id: "nextjs",
    name: "Next.js",
    detect: {
      packages: ["next"],
      configFiles: ["next.config.js", "next.config.mjs", "next.config.ts", "next.config.cjs"]
    },
    skills: ["nextjs-react-expert", "seo-fundamentals"]
  },
  {
    id: "vue",
    name: "Vue",
    detect: { packages: ["vue"] },
   
```

### src\lib\fs.js
```javascript
import { mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";

export async function walkFiles(rootDir) {
  const results = [];
  async function visit(currentDir) {
    const entries = await readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        await visit(fullPath);
      } else if (entry.isFile()) {
        results.push(fullPath);
      }
    }
  }
  await visit(rootDir);
  return results.sort();
}

export async function pathExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function readText(filePath) {
  return readFile(filePath, "utf8");
}

export async function writeText(filePath, content) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content, "utf8");
}

export async function removePath(filePath) {
  await rm(filePath, { recursive: true, force: true });
}

```

### src\lib\hash.js
```javascript
import { createHash } from "node:crypto";

export function sha256(input) {
  return createHash("sha256").update(input).digest("hex");
}

```

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 56, 'seosona-flow': 28}
