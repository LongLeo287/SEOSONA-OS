#!/usr/bin/env node
/**
 * Project connector tooling for SEOSONA OS.
 *
 * Commands:
 *   doctor [project-root] [--json]
 *   init [project-root] [--force]
 *   sync-rules [project-root]
 *   log [project-root] --type <type> --status <status> --content <text>
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const OS_ROOT = path.resolve(__dirname, '..', '..');
const PORTABLE_ROOT = '~/.seosona';
const PROJECT_SCHEMA = 'seosona.project.v1';
const SCHEMA_PORTABLE_PATH = `${PORTABLE_ROOT}/1_CONFIG/schemas/seosona.project.schema.json`;
const DEFAULT_RULE_FILES = ['AGENTS.md', '.clauderules', '.cursorrules'];
const MEMORY_BUCKETS = ['decisions', 'audits', 'issues', 'test-runs', 'changelog', 'knowledge_items'];

function toPosix(value) {
  return value.replace(/\\/g, '/');
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function slugify(value) {
  return String(value || 'project')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 63) || 'project';
}

function resolveProjectRoot(args) {
  const explicit = args.find((arg) => !arg.startsWith('--'));
  return path.resolve(explicit || process.cwd());
}

function detectStack(projectRoot) {
  const stack = new Set();
  const pkgPath = path.join(projectRoot, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = readJson(pkgPath);
    const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
    if (deps.next) stack.add('nextjs');
    if (deps.react) stack.add('react');
    if (deps.typescript || fs.existsSync(path.join(projectRoot, 'tsconfig.json'))) stack.add('typescript');
    if (deps.tailwindcss || deps['@tailwindcss/postcss']) stack.add('tailwindcss');
    if (deps['@next/mdx'] || deps['next-mdx-remote']) stack.add('mdx');
  }
  if (fs.existsSync(path.join(projectRoot, 'content'))) stack.add('content');
  // Browser extension: a manifest.json declaring a manifest_version.
  const extManifest = path.join(projectRoot, 'manifest.json');
  if (fs.existsSync(extManifest)) {
    try {
      if (readJson(extManifest).manifest_version) {
        stack.add('browser-extension');
        stack.add('javascript');
      }
    } catch { /* manifest.json that isn't an extension manifest */ }
  }
  // Python project.
  if (fs.existsSync(path.join(projectRoot, 'requirements.txt')) ||
      fs.existsSync(path.join(projectRoot, 'pyproject.toml'))) {
    stack.add('python');
  }
  return Array.from(stack).sort();
}

function detectCommands(projectRoot) {
  const commands = {};
  const pkgPath = path.join(projectRoot, 'package.json');
  if (!fs.existsSync(pkgPath)) return commands;
  const scripts = readJson(pkgPath).scripts || {};
  for (const name of ['dev', 'build', 'start', 'lint', 'typecheck', 'test']) {
    if (scripts[name]) commands[name] = `npm run ${name}`;
  }
  if (!commands.typecheck && fs.existsSync(path.join(projectRoot, 'tsconfig.json'))) {
    commands.typecheck = 'npx tsc --noEmit';
  }
  if (!commands.build && scripts.build) commands.build = 'npm run build';
  return commands;
}

function inferManifest(projectRoot) {
  const basename = path.basename(projectRoot);
  const pkgPath = path.join(projectRoot, 'package.json');
  const pkg = fs.existsSync(pkgPath) ? readJson(pkgPath) : {};
  const name = slugify(pkg.name || basename);
  const stack = detectStack(projectRoot);
  const commands = detectCommands(projectRoot);
  return {
    $schema: SCHEMA_PORTABLE_PATH,
    schema: PROJECT_SCHEMA,
    name,
    displayName: basename,
    domain: stack.includes('nextjs') ? 'website' : 'software-project',
    stack: stack.length ? stack : ['unknown'],
    osRoot: PORTABLE_ROOT,
    memoryNamespace: name,
    autonomy: {
      defaultLevel: 'project_edit',
      requiresExplicitApproval: ['os_core_patch', 'git_publish', 'deploy'],
    },
    // Only real, detected commands — never invent a `npm run typecheck`/`build` that the
    // project doesn't actually define (that produced broken command refs in every connected
    // project). typecheck/build are optional; validateManifestShape no longer requires them.
    commands,
    workflows: ['project-doctor', 'portable-rule-sync', 'project-memory-logging'],
    ruleFiles: DEFAULT_RULE_FILES,
  };
}

function machinePathFindings(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const forbidden = /(^|[^A-Za-z])([A-Za-z]:\\|[A-Za-z]:\/|\/home\/[^/\s`"']+|\/Users\/[^/\s`"']+)/g;
  return fs.readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .flatMap((line, index) => {
      const matches = [...line.matchAll(forbidden)].map((match) => match[2]);
      return matches.length ? [{ line: index + 1, matches: Array.from(new Set(matches)) }] : [];
    });
}

function validateManifestShape(manifest) {
  const errors = [];
  const required = ['schema', 'name', 'displayName', 'domain', 'stack', 'osRoot', 'memoryNamespace', 'autonomy', 'commands', 'ruleFiles'];
  for (const field of required) {
    if (manifest[field] === undefined) errors.push(`Missing manifest field: ${field}`);
  }
  if (manifest.schema !== PROJECT_SCHEMA) errors.push(`Manifest schema must be ${PROJECT_SCHEMA}`);
  if (manifest.osRoot !== PORTABLE_ROOT) errors.push(`Manifest osRoot must be ${PORTABLE_ROOT}`);
  if (!/^[a-z0-9][a-z0-9-]{1,62}$/.test(manifest.name || '')) errors.push('Manifest name must be a portable slug');
  if (!/^[a-z0-9][a-z0-9-]{1,62}$/.test(manifest.memoryNamespace || '')) errors.push('Manifest memoryNamespace must be a portable slug');
  if (!Array.isArray(manifest.stack) || manifest.stack.length === 0) errors.push('Manifest stack must be a non-empty array');
  if (!manifest.commands || typeof manifest.commands !== 'object' || Array.isArray(manifest.commands)) errors.push('Manifest commands must be an object');
  if (!Array.isArray(manifest.ruleFiles) || manifest.ruleFiles.length === 0) errors.push('Manifest ruleFiles must be a non-empty array');
  const serialized = JSON.stringify(manifest);
  if (/(^|[^A-Za-z])([A-Za-z]:\\|[A-Za-z]:\/|\/home\/|\/Users\/)/.test(serialized)) {
    errors.push('Manifest contains a machine-specific path');
  }
  return errors;
}

function memoryRoot(namespace) {
  return path.join(OS_ROOT, '3_MEMORY', 'projects', namespace);
}

function createMemoryNamespace(namespace) {
  const root = memoryRoot(namespace);
  ensureDir(root);
  for (const bucket of MEMORY_BUCKETS) {
    ensureDir(path.join(root, bucket));
  }
  const readme = path.join(root, 'README.md');
  if (!fs.existsSync(readme)) {
    fs.writeFileSync(readme, `# ${namespace}\n\nProject-scoped memory namespace managed by SEOSONA OS.\n`, 'utf8');
  }
}

function buildRuleContent(manifest) {
  if (manifest.name === 'seosona-ux-ui') {
    return `# SEOSONA UX-UI Project Rules

This project is the autonomous UX/UI design-system workspace for SEOSONA.

## Startup Contract

1. Resolve SEOSONA OS through \`${PORTABLE_ROOT}\`.
2. Read \`${PORTABLE_ROOT}/1_CORE/SOUL.md\`.
3. Read \`${PORTABLE_ROOT}/2_KNOWLEDGE/MASTER_INDEX.md\`.
4. Query \`${PORTABLE_ROOT}/1_CORE/scripts/seosona_capability_bridge.js\` for routing.
5. Check global Knowledge Items in \`${PORTABLE_ROOT}/3_MEMORY/knowledge_items/\`.
6. Check project memory at \`${PORTABLE_ROOT}/3_MEMORY/projects/${manifest.memoryNamespace}/\`.
7. Read local UX/UI brain files: \`0_BRAIN/SOUL.md\`, \`0_BRAIN/AUTONOMY.md\`, \`0_BRAIN/capability_bridge.md\`, and \`0_BRAIN/MASTER_INDEX.md\`.
8. Route design, audit, component, template, motion, accessibility, and brand tasks through \`1_AGENTS/ROSTER.md\` and \`3_WORKFLOWS/\`.
9. Keep SEOSONA Website as a web implementation target only; store reusable UI/UX system knowledge here.
10. Do not route or modify SEOSONA Video from this project binding.

## Autonomous Loop

- Intake: capture the brief, active project slug, audience, constraints, and output target.
- Route: select the smallest useful local agent, skill, and workflow.
- Execute: write deliverables to \`4_LIBRARY/\`, \`5_MEMORY/\`, or \`6_WORKSPACE/{project-slug}/\`.
- Validate: run \`npm run seosona:doctor\` and the relevant accessibility/performance checklist.
- Remember: record reusable decisions in local \`5_MEMORY/\` and durable project memory under \`${PORTABLE_ROOT}/3_MEMORY/projects/${manifest.memoryNamespace}/\`.

## Project Connector

- Manifest: \`seosona.project.json\`
- Memory namespace: \`${manifest.memoryNamespace}\`
- Autonomy level: \`${manifest.autonomy.defaultLevel}\`
- Publish/deploy actions require explicit user intent.
`;
  }

  if (manifest.name === 'website-seosona' || String(manifest.domain || '').includes('website')) {
    return `# SEOSONA Website Project Rules

This repository is a web application implementation target. It is not SEOSONA OS and it is not the autonomous UX/UI design-system workspace.

## Startup Contract

1. Resolve SEOSONA OS through \`${PORTABLE_ROOT}\`.
2. Read \`${PORTABLE_ROOT}/1_CORE/SOUL.md\`.
3. Read \`${PORTABLE_ROOT}/2_KNOWLEDGE/MASTER_INDEX.md\`.
4. Query \`${PORTABLE_ROOT}/1_CORE/scripts/seosona_capability_bridge.js\` for routing.
5. Check project memory at \`${PORTABLE_ROOT}/3_MEMORY/projects/${manifest.memoryNamespace}/\`.
6. Run project health with \`npm run seosona:doctor\` when available.

## Web-Only Boundary

- Keep this repo focused on Next.js routes, React components, content, data, public assets, SEO metadata, schema, redirects, sitemap, robots, tests, and deployment config.
- Do not store reusable OS, agent, workflow, or design-system source-of-truth files here.
- Put reusable UI/UX system decisions, design tokens, component library patterns, and website design profiles in the SEOSONA UX-UI project.
- Local web files may implement a design, but the reusable design-system brain belongs to SEOSONA UX-UI.

## Project Connector

- Manifest: \`seosona.project.json\`
- Memory namespace: \`${manifest.memoryNamespace}\`
- Autonomy level: \`${manifest.autonomy.defaultLevel}\`
- Publish/deploy actions require explicit user intent.
`;
  }

  return `# SEOSONA Project Rules

This project is bound to SEOSONA OS through \`seosona.project.json\`.

## Startup Contract

1. Resolve SEOSONA OS through \`${PORTABLE_ROOT}\`.
2. Read \`${PORTABLE_ROOT}/1_CORE/SOUL.md\`.
3. Read \`${PORTABLE_ROOT}/2_KNOWLEDGE/MASTER_INDEX.md\`.
4. Query \`${PORTABLE_ROOT}/1_CORE/scripts/seosona_capability_bridge.js\` for routing.
5. Check project memory at \`${PORTABLE_ROOT}/3_MEMORY/projects/${manifest.memoryNamespace}/\`.
6. Run project health with \`npm run seosona:doctor\` when available.

## Project Connector

- Manifest: \`seosona.project.json\`
- Memory namespace: \`${manifest.memoryNamespace}\`
- Autonomy level: \`${manifest.autonomy.defaultLevel}\`
- Publish/deploy actions require explicit user intent.
`;
}

function syncRules(projectRoot, manifest) {
  const content = buildRuleContent(manifest);
  const files = manifest.ruleFiles || DEFAULT_RULE_FILES;
  for (const file of files) {
    fs.writeFileSync(path.join(projectRoot, file), content, 'utf8');
  }
  return files;
}

function runBridgeValidate() {
  try {
    const output = execFileSync('node', ['1_CORE/scripts/seosona_capability_bridge.js', 'validate'], {
      cwd: OS_ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return JSON.parse(output);
  } catch (error) {
    return { ok: false, errors: [error.message] };
  }
}

function getGitRemoteFinding(projectRoot) {
  try {
    const remote = execFileSync('git', ['remote', 'get-url', '--push', 'origin'], {
      cwd: projectRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
    if (/https:\/\/[^/\s]+@github\.com\//.test(remote)) {
      return {
        severity: 'fail',
        message: 'Git origin push remote contains embedded credentials',
        fix: 'Replace the remote with a credential-free HTTPS or SSH URL.',
      };
    }
    return { severity: 'ok', message: 'Git origin push remote does not expose embedded credentials' };
  } catch (error) {
    return { severity: 'warn', message: `Git remote check skipped: ${error.message}` };
  }
}

function checkPackageScripts(projectRoot) {
  const pkgPath = path.join(projectRoot, 'package.json');
  if (!fs.existsSync(pkgPath)) return [{ severity: 'warn', message: 'No package.json found for npm script checks' }];
  const scripts = readJson(pkgPath).scripts || {};
  const expected = ['seosona:doctor'];
  return expected.map((script) => scripts[script]
    ? { severity: 'ok', message: `npm script available: ${script}` }
    : { severity: 'warn', message: `Recommended npm script missing: ${script}` });
}

function doctor(projectRoot) {
  const findings = [];
  const manifestPath = path.join(projectRoot, 'seosona.project.json');
  const bridge = runBridgeValidate();
  findings.push(bridge.ok
    ? { severity: 'ok', message: `Capability bridge valid: ${bridge.resourceCount} resources, ${bridge.capabilityCount} skills` }
    : { severity: 'fail', message: `Capability bridge failed: ${(bridge.errors || []).join('; ')}` });

  let manifest = null;
  if (!fs.existsSync(manifestPath)) {
    findings.push({ severity: 'fail', message: 'Missing seosona.project.json' });
  } else {
    try {
      manifest = readJson(manifestPath);
      const errors = validateManifestShape(manifest);
      if (errors.length) {
        findings.push(...errors.map((message) => ({ severity: 'fail', message })));
      } else {
        findings.push({ severity: 'ok', message: `Project manifest valid: ${manifest.name}` });
      }
    } catch (error) {
      findings.push({ severity: 'fail', message: `Invalid seosona.project.json: ${error.message}` });
    }
  }

  const filesToScan = ['seosona.project.json', 'AGENTS.md', '.clauderules', '.cursorrules', path.join('scripts', 'seosona-project.mjs')];
  for (const relativePath of filesToScan) {
    const target = path.join(projectRoot, relativePath);
    if (!fs.existsSync(target)) {
      if (relativePath === 'seosona.project.json') continue;
      findings.push({ severity: 'warn', message: `Connector file missing: ${toPosix(relativePath)}` });
      continue;
    }
    const badPaths = machinePathFindings(target);
    if (badPaths.length) {
      findings.push({ severity: 'fail', message: `Machine-specific path found in ${toPosix(relativePath)}` });
    }
    const content = fs.readFileSync(target, 'utf8');
    if (/AntigravitySystem/i.test(content)) {
      findings.push({ severity: 'fail', message: `Legacy AntigravitySystem reference found in ${toPosix(relativePath)}` });
    }
  }

  if (manifest) {
    const root = memoryRoot(manifest.memoryNamespace);
    if (fs.existsSync(root)) findings.push({ severity: 'ok', message: `Project memory namespace exists: ${manifest.memoryNamespace}` });
    else findings.push({ severity: 'warn', message: `Project memory namespace missing: ${manifest.memoryNamespace}` });
    for (const ruleFile of manifest.ruleFiles || []) {
      const target = path.join(projectRoot, ruleFile);
      if (fs.existsSync(target) && fs.readFileSync(target, 'utf8').includes(PORTABLE_ROOT)) {
        findings.push({ severity: 'ok', message: `Rule file uses portable root: ${ruleFile}` });
      } else {
        findings.push({ severity: 'warn', message: `Rule file is missing or not portable: ${ruleFile}` });
      }
    }
  }

  findings.push(getGitRemoteFinding(projectRoot));
  findings.push(...checkPackageScripts(projectRoot));

  const failCount = findings.filter((finding) => finding.severity === 'fail').length;
  const warnCount = findings.filter((finding) => finding.severity === 'warn').length;
  return {
    ok: failCount === 0,
    status: failCount ? 'broken' : warnCount ? 'partial' : 'connected',
    projectRoot: toPosix(projectRoot),
    osRoot: PORTABLE_ROOT,
    findings,
  };
}

function printDoctor(result, json) {
  if (json) {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    return;
  }
  console.log(`SEOSONA project connection: ${result.status}`);
  for (const finding of result.findings) {
    const label = finding.severity.toUpperCase().padEnd(4, ' ');
    console.log(`[${label}] ${finding.message}`);
  }
}

function init(projectRoot, force) {
  ensureDir(projectRoot);
  const manifestPath = path.join(projectRoot, 'seosona.project.json');
  const manifest = fs.existsSync(manifestPath) && !force ? readJson(manifestPath) : inferManifest(projectRoot);
  writeJson(manifestPath, manifest);
  createMemoryNamespace(manifest.memoryNamespace);
  const ruleFiles = syncRules(projectRoot, manifest);
  return { ok: true, manifest: manifest.name, memoryNamespace: manifest.memoryNamespace, ruleFiles };
}

function logProjectEvent(projectRoot, args) {
  const manifestPath = path.join(projectRoot, 'seosona.project.json');
  if (!fs.existsSync(manifestPath)) throw new Error('Missing seosona.project.json');
  const manifest = readJson(manifestPath);
  createMemoryNamespace(manifest.memoryNamespace);
  const type = readFlag(args, '--type') || 'event';
  const status = readFlag(args, '--status') || 'done';
  const content = readFlag(args, '--content') || '';
  if (!content) throw new Error('log requires --content');
  const event = {
    timestamp: new Date().toISOString(),
    project: manifest.name,
    type,
    status,
    content,
  };
  const target = path.join(memoryRoot(manifest.memoryNamespace), 'changelog', 'events.jsonl');
  fs.appendFileSync(target, `${JSON.stringify(event)}\n`, 'utf8');
  return { ok: true, path: `${PORTABLE_ROOT}/3_MEMORY/projects/${manifest.memoryNamespace}/changelog/events.jsonl` };
}

function readFlag(args, name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : null;
}

function positionalArgs(args) {
  const positions = [];
  const flagsWithValues = new Set(['--type', '--status', '--content']);
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (flagsWithValues.has(arg)) {
      index += 1;
      continue;
    }
    if (arg.startsWith('--')) continue;
    positions.push(arg);
  }
  return positions;
}

function main() {
  const [command = 'doctor', ...args] = process.argv.slice(2);
  const json = args.includes('--json');
  const force = args.includes('--force');
  const projectRoot = resolveProjectRoot(positionalArgs(args));

  try {
    if (command === 'doctor') {
      const result = doctor(projectRoot);
      printDoctor(result, json);
      if (!result.ok) process.exitCode = 1;
    } else if (command === 'init') {
      const result = init(projectRoot, force);
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    } else if (command === 'sync-rules') {
      const manifest = readJson(path.join(projectRoot, 'seosona.project.json'));
      const ruleFiles = syncRules(projectRoot, manifest);
      process.stdout.write(`${JSON.stringify({ ok: true, ruleFiles }, null, 2)}\n`);
    } else if (command === 'log') {
      process.stdout.write(`${JSON.stringify(logProjectEvent(projectRoot, args), null, 2)}\n`);
    } else {
      throw new Error(`Unknown command: ${command}`);
    }
  } catch (error) {
    process.stderr.write(`${JSON.stringify({ ok: false, error: error.message }, null, 2)}\n`);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  doctor,
  inferManifest,
  init,
  validateManifestShape,
  syncRules,
};
