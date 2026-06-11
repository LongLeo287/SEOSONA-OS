#!/usr/bin/env node
/**
 * SEOSONA portable capability bridge.
 *
 * Stable machine-readable entrypoint for IDEs, CLIs, MCP clients, and agent
 * runtimes. It exposes the whole SEOSONA OS graph through portable paths:
 * skills, agents, workflows, Knowledge Items, raw data, SOPs, rules, and
 * contracts.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const PORTABLE_ROOT = '~/.seosona';
const ROUTER_RELATIVE = '2_KNOWLEDGE/SKILLS_ROUTER.md';
const ROUTER_PATH = path.join(ROOT, ROUTER_RELATIVE);

const REQUIRED_ROUTE_NAMES = [
  'seosona:cost-bounded-agent-looping',
  'seosona:thinking-model-router',
  'seosona:portable-capability-bridge',
];

const GRAPH_COLLECTIONS = [
  { type: 'agent', root: '4_AGENTS/personas', source: 'AGENT_PERSONAS' },
  { type: 'workflow', root: '1_CORE/workflows', source: 'CORE_WORKFLOWS' },
  { type: 'workflow', root: '2_KNOWLEDGE/workflows', source: 'KNOWLEDGE_WORKFLOWS' },
  { type: 'knowledge_item', root: '3_MEMORY/knowledge_items', source: 'KNOWLEDGE_ITEMS' },
  { type: 'raw_data', root: '2_KNOWLEDGE/raw_data', source: 'RAW_DATA' },
  { type: 'sop', root: '2_KNOWLEDGE/sops', source: 'SOPS' },
  { type: 'rule', root: '1_CORE/rules', source: 'CORE_RULES' },
];

const CONTRACTS = [
  '1_CORE/SOUL.md',
  '1_CORE/PORTABLE_CAPABILITY_CONTRACT.md',
  '1_CORE/SEOSONA_OPERATION.md',
  '2_KNOWLEDGE/MASTER_INDEX.md',
  '2_KNOWLEDGE/SKILLS_ROUTER.md',
];

const PORTABILITY_SCAN_ROOTS = [
  '1_CORE/PORTABLE_CAPABILITY_CONTRACT.md',
  '1_CORE/SEOSONA_OPERATION.md',
  '1_CORE/SOUL.md',
  '1_CORE/rules',
  '1_CORE/workflows',
  '1_CORE/scripts/global_injector.js',
  '1_CORE/scripts/seosona_capability_bridge.js',
  '1_CORE/scripts/system_status.js',
  '2_KNOWLEDGE/MASTER_INDEX.md',
  '2_KNOWLEDGE/SKILLS_ROUTER.md',
  '2_KNOWLEDGE/raw_data/INDEX.md',
  '2_KNOWLEDGE/sops',
  '2_KNOWLEDGE/workflows',
  '3_MEMORY/knowledge_items',
  '3_MEMORY/specs',
  '4_AGENTS',
  'package.json',
];

function toPosix(value) {
  return value.replace(/\\/g, '/');
}

function portable(relativePath) {
  return `${PORTABLE_ROOT}/${toPosix(relativePath)}`;
}

function exists(relativePath) {
  return fs.existsSync(path.join(ROOT, relativePath));
}

function slugToName(relativePath) {
  return path
    .basename(relativePath, path.extname(relativePath))
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function walkFiles(relativeRoot, extensions = new Set(['.md'])) {
  const absoluteRoot = path.join(ROOT, relativeRoot);
  if (!fs.existsSync(absoluteRoot)) return [];

  const files = [];
  const stack = [absoluteRoot];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '__pycache__') continue;
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(absolute);
      } else if (extensions.has(path.extname(entry.name).toLowerCase())) {
        files.push(toPosix(path.relative(ROOT, absolute)));
      }
    }
  }
  return files.sort();
}

function readFileSafe(relativePath) {
  try {
    return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
  } catch {
    return '';
  }
}

function frontmatterField(content, field) {
  const frontmatter = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!frontmatter) return null;
  const match = frontmatter[1].match(new RegExp(`^${field}:\\s*(.+)$`, 'm'));
  return match ? match[1].trim().replace(/^['"]|['"]$/g, '') : null;
}

function firstHeading(content) {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

function makeResource(type, relativePath, source, extra = {}) {
  const content = readFileSafe(relativePath);
  const declaredName = frontmatterField(content, 'name') || firstHeading(content) || slugToName(relativePath);
  const normalizedName = declaredName.toLowerCase();
  const domain = toPosix(path.dirname(relativePath)).split('/').slice(0, 3).join('/');
  const keywords = Array.from(new Set([
    declaredName,
    normalizedName,
    slugToName(relativePath),
    path.basename(path.dirname(relativePath)),
  ].filter(Boolean)));

  return {
    type,
    name: declaredName,
    keywords,
    domain,
    relativePath: toPosix(relativePath),
    portablePath: portable(relativePath),
    source,
    ...extra,
  };
}

function readRouter() {
  if (!fs.existsSync(ROUTER_PATH)) {
    throw new Error(`Missing ${ROUTER_RELATIVE}`);
  }
  return fs.readFileSync(ROUTER_PATH, 'utf8');
}

function parseSkillRouter() {
  const router = readRouter();
  const resources = [];
  let domain = 'unknown';

  for (const line of router.split(/\r?\n/)) {
    const heading = line.match(/^##\s+(.+)$/);
    if (heading) {
      domain = heading[1].trim().toLowerCase().replace(/\s+/g, '_');
      continue;
    }

    const route = line.match(/^- (.+?) -> `(.+?)`$/);
    if (!route) continue;

    const keywords = [...route[1].matchAll(/`([^`]+)`/g)].map((match) => match[1]);
    const relativePath = toPosix(path.posix.join('2_KNOWLEDGE', route[2].replace(/\/$/, '/')));
    const name = keywords.find((keyword) => keyword.includes(':')) || keywords[0] || slugToName(relativePath);

    resources.push({
      type: 'skill',
      name,
      keywords,
      domain,
      relativePath,
      portablePath: portable(relativePath),
      source: 'SKILLS_ROUTER',
    });
  }

  return resources;
}

function buildGraphResources() {
  const resources = [...parseSkillRouter()];

  for (const collection of GRAPH_COLLECTIONS) {
    for (const file of walkFiles(collection.root)) {
      resources.push(makeResource(collection.type, file, collection.source));
    }
  }

  for (const contract of CONTRACTS) {
    if (exists(contract)) {
      resources.push(makeResource('contract', contract, 'CONTRACTS'));
    }
  }

  return resources;
}

function groupCounts(resources) {
  return resources.reduce((counts, resource) => {
    counts[resource.type] = (counts[resource.type] || 0) + 1;
    return counts;
  }, {});
}

function buildManifest() {
  const resources = buildGraphResources();
  const skills = resources.filter((resource) => resource.type === 'skill');
  return {
    schema: 'seosona.system_graph_manifest.v2',
    root: PORTABLE_ROOT,
    generatedFrom: portable(ROUTER_RELATIVE),
    startupSequence: [
      portable('1_CORE/SOUL.md'),
      portable('2_KNOWLEDGE/MASTER_INDEX.md'),
      portable('2_KNOWLEDGE/SKILLS_ROUTER.md'),
      portable('3_MEMORY/knowledge_items/'),
      portable('1_CORE/scripts/seosona_capability_bridge.js'),
    ],
    contracts: CONTRACTS.map(portable),
    highlightedCapabilities: REQUIRED_ROUTE_NAMES,
    counts: groupCounts(resources),
    capabilities: skills,
    resources,
  };
}

function route(query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    throw new Error('route requires a non-empty query');
  }

  const terms = normalized.split(/\s+/).filter(Boolean);
  const matches = buildGraphResources()
    .map((resource) => {
      const haystack = [
        resource.type,
        resource.name,
        resource.domain,
        resource.relativePath,
        ...resource.keywords,
      ].join(' ').toLowerCase();
      const score = terms.reduce((total, term) => total + (haystack.includes(term) ? 1 : 0), 0);
      return { ...resource, score };
    })
    .filter((resource) => resource.score > 0)
    .sort((a, b) => b.score - a.score || a.type.localeCompare(b.type) || a.name.localeCompare(b.name))
    .slice(0, 20);

  return { query, matches };
}

function scanPortability() {
  const extensions = new Set(['.md', '.json', '.js', '.cjs', '.mjs', '.ps1', '.py', '.yml', '.yaml']);
  const scanFiles = [];
  for (const target of PORTABILITY_SCAN_ROOTS) {
    const absolute = path.join(ROOT, target);
    if (!fs.existsSync(absolute)) continue;
    const stat = fs.statSync(absolute);
    if (stat.isDirectory()) scanFiles.push(...walkFiles(target, extensions));
    else if (extensions.has(path.extname(target).toLowerCase())) scanFiles.push(toPosix(target));
  }

  for (const skillPath of walkFiles('2_KNOWLEDGE/frameworks', new Set(['.md']))) {
    if (path.basename(skillPath) === 'SKILL.md') scanFiles.push(skillPath);
  }

  const forbidden = /(^|[^A-Za-z])([A-Za-z]:\\(?!n|r|t)|[A-Za-z]:\/|\/home\/[^/\s`"']+|\/Users\/[^/\s`"']+)/g;
  const findings = [];
  for (const relativePath of Array.from(new Set(scanFiles)).sort()) {
    const lines = readFileSafe(relativePath).split(/\r?\n/);
    lines.forEach((line, index) => {
      const rawMatches = [...line.matchAll(forbidden)].map((match) => match[2]);
      if (rawMatches.length) {
        findings.push({
          relativePath,
          line: index + 1,
          matches: Array.from(new Set(rawMatches)),
        });
      }
    });
  }

  return {
    ok: findings.length === 0,
    scannedFiles: Array.from(new Set(scanFiles)).length,
    findings,
  };
}

function validate() {
  const manifest = buildManifest();
  const errors = [];

  for (const relativePath of CONTRACTS) {
    if (!exists(relativePath)) {
      errors.push(`Missing required file: ${relativePath}`);
    }
  }

  const names = new Set(manifest.capabilities.flatMap((capability) => capability.keywords));
  for (const requiredName of REQUIRED_ROUTE_NAMES) {
    if (!names.has(requiredName)) {
      errors.push(`Required capability is not routeable: ${requiredName}`);
    }
  }

  for (const resource of manifest.resources) {
    if (!exists(resource.relativePath)) {
      errors.push(`Resource path does not resolve: ${resource.relativePath}`);
    }
  }

  const serialized = JSON.stringify(manifest);
  if (/(^|[^A-Za-z])([A-Za-z]:\\|[A-Za-z]:\/|\/home\/|\/Users\/)/.test(serialized)) {
    errors.push('Manifest emitted a machine-specific path');
  }

  const portability = scanPortability();
  if (!portability.ok) {
    errors.push(`Portability audit found ${portability.findings.length} machine-specific path reference(s)`);
  }

  return {
    ok: errors.length === 0,
    resourceCount: manifest.resources.length,
    capabilityCount: manifest.capabilities.length,
    counts: manifest.counts,
    requiredCapabilities: REQUIRED_ROUTE_NAMES,
    portability,
    errors,
  };
}

function writeJson(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

function main() {
  const [command = 'manifest', ...args] = process.argv.slice(2);

  try {
    if (command === 'manifest') {
      writeJson(buildManifest());
    } else if (command === 'route') {
      writeJson(route(args.join(' ')));
    } else if (command === 'validate') {
      const result = validate();
      writeJson(result);
      if (!result.ok) process.exitCode = 1;
    } else if (command === 'audit-portability') {
      const result = scanPortability();
      writeJson(result);
      if (!result.ok) process.exitCode = 1;
    } else {
      throw new Error(`Unknown command: ${command}`);
    }
  } catch (error) {
    writeJson({ ok: false, error: error.message });
    process.exitCode = 1;
  }
}

main();
