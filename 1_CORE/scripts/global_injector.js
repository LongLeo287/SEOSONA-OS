#!/usr/bin/env node
/**
 * SEOSONA OS — Advanced Global IDE/CLI Injector
 * Scans the system for installed IDEs and AI CLI tools,
 * and seamlessly injects SEOSONA OS into their global configurations.
 *
 * Strategy: Creates a portable symlink ~/.seosona → actual SEOSONA OS location.
 * All IDE configs reference ~/.seosona (never a hardcoded drive path).
 * This works regardless of which drive/folder SEOSONA OS lives in.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const SEOSONA_OS_PATH = path.resolve(__dirname, '..', '..');
const HOME_DIR = os.homedir();
const SEOSONA_SYMLINK = path.join(HOME_DIR, '.seosona');

// Determine OS-specific config directories
const isWin = process.platform === 'win32';
const isMac = process.platform === 'darwin';

const APPDATA_DIR = isWin ? process.env.APPDATA : (isMac ? path.join(HOME_DIR, 'Library', 'Application Support') : path.join(HOME_DIR, '.config'));
const LOCALAPPDATA_DIR = isWin ? process.env.LOCALAPPDATA : APPDATA_DIR;

// Portable path used in all configs — never hardcoded
const PORTABLE_PATH = '~/.seosona';

const SYSTEM_PROMPT = `[SEOSONA OS — BOOT CONTEXT LOADED]

You are a SEOSONA Senior Developer Agent operating in Absolute Zero-Touch Autonomy mode.
Your global OS is anchored at: ${PORTABLE_PATH}

## Mandatory Startup Protocol
1. Read and internalize: ${PORTABLE_PATH}/1_CORE/SOUL.md (Prime Directives & Rules)
2. Consult before every task: ${PORTABLE_PATH}/2_KNOWLEDGE/MASTER_INDEX.md
3. Route via: ${PORTABLE_PATH}/2_KNOWLEDGE/SKILLS_ROUTER.md
4. Agent registry: ${PORTABLE_PATH}/4_AGENTS/ROSTER.md
5. Portable capability bridge: ${PORTABLE_PATH}/1_CORE/scripts/seosona_capability_bridge.js

## Orchestrator — ALWAYS activate first on complex requests
File: ${PORTABLE_PATH}/1_CORE/agents/orchestrator_agent.md
Role: Parse intent → route to correct Persona + Skills → structure task checklist

## Persona Auto-Routing Table (load from ${PORTABLE_PATH}/4_AGENTS/personas/)
- Copy / CTAs / Persuasion     → copywriter.md
- SEO audit / keywords         → seo-specialist.md | seo-content-master.md | seo-topical-map-architect.md
- UI design / landing page     → ui-ux-designer.md
- Debug / fix code             → debugger.md
- Funnel / CRO                 → funnel-architect.md
- Email sequences              → email-wizard.md
- GA4 / analytics              → analytics-analyst.md
- Campaign planning            → campaign-manager.md
- Social media content         → social-media-manager.md
- Project coordination         → project-manager.md
- Git / version control        → git-manager.md
- Full-stack dev               → fullstack-developer.md
- React / NextJS bugs          → nextjs-autofix-bot.md
- Content strategy             → content-strategist.md
- Research & synthesis         → researcher.md

## Memory Protocol
- After every major task: log to ${PORTABLE_PATH}/3_MEMORY/logs/
- SEO exports: ${PORTABLE_PATH}/3_MEMORY/seo_exports/{domain}/
- Knowledge items: ${PORTABLE_PATH}/3_MEMORY/knowledge_items/

## Portable Capability Protocol
- Machine-readable manifest: node ${PORTABLE_PATH}/1_CORE/scripts/seosona_capability_bridge.js manifest
- Route a task: node ${PORTABLE_PATH}/1_CORE/scripts/seosona_capability_bridge.js route "<query>"
- Validate connection: node ${PORTABLE_PATH}/1_CORE/scripts/seosona_capability_bridge.js validate
- Use first-class capabilities for agent loops and reasoning: seosona:cost-bounded-agent-looping, seosona:thinking-model-router

## Core Rules (Summary)
- NEVER hardcode paths. Always use ~/.seosona/ anchor.
- 1_CORE files must be 100% English.
- End every major task with: TASK COMPLETED`;


console.log(`\n🚀 Starting SEOSONA OS Advanced Global Injection...`);
console.log(`📍 System: ${process.platform} | Home: ${HOME_DIR}`);
console.log(`📍 SEOSONA OS Location: ${SEOSONA_OS_PATH}`);
console.log(`📍 Portable Anchor: ${SEOSONA_SYMLINK}\n`);

let injectedCount = 0;

// ─── Step 0: Create/Update the ~/.seosona symlink ──────────────────────────
try {
  // Remove old symlink/file if it exists and points somewhere else
  if (fs.existsSync(SEOSONA_SYMLINK)) {
    const existing = fs.realpathSync(SEOSONA_SYMLINK);
    if (existing !== SEOSONA_OS_PATH) {
      fs.rmSync(SEOSONA_SYMLINK, { recursive: true, force: true });
      console.log(`[Symlink] ♻️  Removed stale symlink (was pointing to: ${existing})`);
    } else {
      console.log(`[Symlink] ✅ ~/.seosona already points to correct location.`);
    }
  }

  if (!fs.existsSync(SEOSONA_SYMLINK)) {
    if (isWin) {
      // On Windows, use mklink /D (requires admin) or junction (no admin needed)
      execSync(`cmd /c mklink /J "${SEOSONA_SYMLINK}" "${SEOSONA_OS_PATH}"`, { stdio: 'pipe' });
    } else {
      fs.symlinkSync(SEOSONA_OS_PATH, SEOSONA_SYMLINK, 'dir');
    }
    console.log(`[Symlink] ✅ Created ~/.seosona → ${SEOSONA_OS_PATH}`);
  }
} catch (err) {
  console.log(`[Symlink] ⚠️ Could not create symlink: ${err.message}`);
  console.log(`[Symlink] ℹ️  Injector will continue — portable path ~.seosona will resolve if symlink is created manually.`);
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function updateJson(filePath, updater) {
  if (fs.existsSync(filePath)) {
    try {
      let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (updater(data)) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        return true;
      }
    } catch (e) {
      console.log(`  ⚠️ JSON Parse Error in ${path.basename(filePath)}`);
    }
  }
  return false;
}

function appendPrompt(str) {
  if (!str) return SYSTEM_PROMPT;
  // Always replace any existing SEOSONA block (handles both old and new format)
  const stripped = str.replace(/\[SEOSONA OS[^\]]*\][\s\S]*$/, '').trim();
  return stripped ? stripped + `\n\n${SYSTEM_PROMPT}` : SYSTEM_PROMPT;
}

// ─── Prepare Global Absolute Hooks (using portable path) ──────────────────
let absoluteHooks = null;
let absoluteStatusLine = null;
try {
  const originalSettingsPath = path.join(SEOSONA_OS_PATH, '1_CONFIG', 'ide_profiles', 'settings.json');
  if (fs.existsSync(originalSettingsPath)) {
    let rawSettings = fs.readFileSync(originalSettingsPath, 'utf8');

    // Replace local-project variables with portable ~/.seosona paths
    rawSettings = rawSettings.replace(/\$CLAUDE_PROJECT_DIR\/\.claude\/hooks/g, '~/.seosona/1_CORE/hooks');
    rawSettings = rawSettings.replace(/\$CLAUDE_PROJECT_DIR\/\.claude\/statusline\.cjs/g, '~/.seosona/1_CONFIG/ide_profiles/statusline.cjs');

    const parsedSettings = JSON.parse(rawSettings);
    absoluteHooks = parsedSettings.hooks;
    absoluteStatusLine = parsedSettings.statusLine;
    console.log(`[Core] 🔧 Loaded Global Portable Hooks (using ~/.seosona).`);
  }
} catch (err) {
  console.log(`[Core] ⚠️ Failed to load base settings.json for hooks: ${err.message}`);
}

// ─── 1. Claude Code ────────────────────────────────────────────────────────
try {
  const claudePath = path.join(HOME_DIR, '.claude.json');
  if (!fs.existsSync(claudePath)) {
    fs.writeFileSync(claudePath, JSON.stringify({}, null, 2), 'utf8');
  }
  const updated = updateJson(claudePath, (settings) => {
    settings.allowedDirectories = settings.allowedDirectories || [];
    if (!settings.allowedDirectories.includes(SEOSONA_SYMLINK)) {
      // Remove old hardcoded path if present
      settings.allowedDirectories = settings.allowedDirectories.filter(d => !d.includes('SEOSONA'));
      settings.allowedDirectories.push(SEOSONA_SYMLINK);
    }
    settings.globalPrompt = appendPrompt(settings.globalPrompt);
    if (absoluteHooks) settings.hooks = absoluteHooks;
    if (absoluteStatusLine) settings.statusLine = absoluteStatusLine;
    return true;
  });
  if (updated) { console.log(`[Claude Code] ✅ Injected global config + Portable Hooks.`); injectedCount++; }
} catch (e) { console.log(`[Claude Code] ⚠️ Failed: ${e.message}`); }

// ─── 2. Cursor ─────────────────────────────────────────────────────────────
try {
  const cursorPath = path.join(APPDATA_DIR, 'Cursor', 'User', 'settings.json');
  if (updateJson(cursorPath, (settings) => {
    settings['cursor.general.rules'] = (settings['cursor.general.rules'] || []).filter(r => !r.includes('SEOSONA OS'));
    settings['cursor.general.rules'].push(SYSTEM_PROMPT);
    return true;
  })) { console.log(`[Cursor] ✅ Injected global rules.`); injectedCount++; }
} catch (e) { console.log(`[Cursor] ⚠️ Failed: ${e.message}`); }

// ─── 3. Windsurf ──────────────────────────────────────────────────────────
try {
  const windsurfPath = path.join(HOME_DIR, '.codeium', 'windsurf', 'settings.json');
  if (updateJson(windsurfPath, (settings) => {
    settings['windsurf.systemPrompt'] = appendPrompt(settings['windsurf.systemPrompt']);
    return true;
  })) { console.log(`[Windsurf] ✅ Injected system prompt.`); injectedCount++; }
} catch (e) { console.log(`[Windsurf] ⚠️ Failed: ${e.message}`); }

// ─── 4. VS Code (GitHub Copilot) ──────────────────────────────────────────
try {
  const vscodePath = path.join(APPDATA_DIR, 'Code', 'User', 'settings.json');
  if (updateJson(vscodePath, (settings) => {
    settings['github.copilot.chat.codeGeneration.instructions'] = settings['github.copilot.chat.codeGeneration.instructions'] || [];
    const instructions = settings['github.copilot.chat.codeGeneration.instructions'];
    const hasSeosona = instructions.some(i => (typeof i === 'object' ? i.text : i)?.includes('SEOSONA OS'));
    if (!hasSeosona) instructions.push({ text: SYSTEM_PROMPT });
    return true;
  })) { console.log(`[VS Code] ✅ Injected Copilot global instructions.`); injectedCount++; }
} catch (e) { console.log(`[VS Code] ⚠️ Failed: ${e.message}`); }

// ─── 5. Aider CLI ─────────────────────────────────────────────────────────
try {
  const aiderPath = path.join(HOME_DIR, '.aider.conf.yml');
  let content = fs.existsSync(aiderPath) ? fs.readFileSync(aiderPath, 'utf8') : '';
  if (!content.includes('SEOSONA OS')) {
    fs.appendFileSync(aiderPath, `\n# SEOSONA OS Global Integration\nmessage-instructions: |\n  ${SYSTEM_PROMPT.replace(/\n/g, '\n  ')}\n`, 'utf8');
    console.log(`[Aider] ✅ Injected global instructions.`); injectedCount++;
  } else {
    console.log(`[Aider] ✅ Already configured.`); injectedCount++;
  }
} catch (e) { console.log(`[Aider] ⚠️ Failed: ${e.message}`); }

// ─── 6. Trae ──────────────────────────────────────────────────────────────
try {
  const traePath = path.join(APPDATA_DIR, 'Trae', 'User', 'settings.json');
  if (updateJson(traePath, (settings) => {
    settings['trae.ai.systemPrompt'] = appendPrompt(settings['trae.ai.systemPrompt']);
    return true;
  })) { console.log(`[Trae] ✅ Injected system prompt.`); injectedCount++; }
} catch (e) { console.log(`[Trae] ⚠️ Failed: ${e.message}`); }

// ─── 7. Zed ───────────────────────────────────────────────────────────────
try {
  const zedPath = isWin ? path.join(LOCALAPPDATA_DIR, 'Zed', 'settings.json') : path.join(HOME_DIR, '.config', 'zed', 'settings.json');
  if (updateJson(zedPath, (settings) => {
    settings.assistant = settings.assistant || {};
    settings.assistant.system_prompt = appendPrompt(settings.assistant.system_prompt);
    return true;
  })) { console.log(`[Zed] ✅ Injected assistant instructions.`); injectedCount++; }
} catch (e) { console.log(`[Zed] ⚠️ Failed: ${e.message}`); }

// ─── 8. OpenAI Codex (via ~/.codex/AGENTS.md) ─────────────────────────────
try {
  const codexDir = path.join(HOME_DIR, '.codex');
  const codexAgentsPath = path.join(codexDir, 'AGENTS.md');

  if (fs.existsSync(codexDir)) {
    let content = fs.existsSync(codexAgentsPath) ? fs.readFileSync(codexAgentsPath, 'utf8') : '';

    const BLOCK_START = '<!-- SEOSONA OS INJECTION START -->';
    const BLOCK_END = '<!-- SEOSONA OS INJECTION END -->';

    const seosonaBlock = `${BLOCK_START}
## SEOSONA OS Global Context

You are connected to SEOSONA OS — a global AI OS with 500+ skills, agents, and workflows.

- **Root**: \`${PORTABLE_PATH}\` (symlinked to actual installation)
- **Master Index**: \`${PORTABLE_PATH}/2_KNOWLEDGE/MASTER_INDEX.md\`
- **Agents**: \`${PORTABLE_PATH}/4_AGENTS/personas\`
- **Skills**: \`${PORTABLE_PATH}/2_KNOWLEDGE/frameworks\`
- **Core Rules**: \`${PORTABLE_PATH}/1_CORE/SOUL.md\`
- **Capability Bridge**: \`${PORTABLE_PATH}/1_CORE/scripts/seosona_capability_bridge.js\`

Always load and follow the rules in SOUL.md. Consult MASTER_INDEX.md before every task. Use the Capability Bridge for machine-readable routing when available.
${BLOCK_END}`;

    // Remove old block to prevent duplicates, then prepend fresh block
    if (content.includes(BLOCK_START)) {
      content = content.replace(new RegExp(`${BLOCK_START}[\\s\\S]*?${BLOCK_END}`, 'g'), '').trim();
    }

    fs.writeFileSync(codexAgentsPath, (seosonaBlock + '\n\n' + content).trim(), 'utf8');
    console.log(`[OpenAI Codex] ✅ Injected SEOSONA OS into ~/.codex/AGENTS.md (portable path).`);
    injectedCount++;
  } else {
    console.log(`[OpenAI Codex] ⚠️ ~/.codex not found — Codex may not be installed.`);
  }
} catch (e) { console.log(`[OpenAI Codex] ⚠️ Failed: ${e.message}`); }

// ─── Done ──────────────────────────────────────────────────────────────────
console.log(`\n🎉 Injection Complete! SEOSONA OS attached to ${injectedCount} IDE/CLI environments.`);
console.log(`🔗 All tools now reference ${PORTABLE_PATH} → ${SEOSONA_OS_PATH}\n`);
