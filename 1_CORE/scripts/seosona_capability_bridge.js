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
  'seosona:portable-capability-bridge',
];

// Floor guard: SKILLS_ROUTER.md is auto-generated from thousands of SKILL.md
// files. If the routeable skill count collapses below this, the router is stale
// or was hand-truncated (e.g. the historical "3 skills" regression). Regenerate
// with: python 1_CORE/scripts/core/plugin_manager.py
const MIN_EXPECTED_SKILLS = 150;

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
];

const PORTABILITY_SCAN_ROOTS = [
  '1_CORE/SOUL.md',
  '1_CORE/agents',
  '1_CORE/rules',
  '1_CORE/workflows',
  '1_CORE/scripts/project_connector.js',
  '1_CORE/scripts/seosona_capability_bridge.js',
  '1_CORE/scripts/system_status.js',
  '1_CONFIG/schemas/seosona.project.schema.json',
  '2_KNOWLEDGE/MASTER_INDEX.md',
  '2_KNOWLEDGE/raw_data/INDEX.md',
  '2_KNOWLEDGE/sops',
  '4_AGENTS',
  // 3_MEMORY/knowledge_items excluded: ingested third-party distillations legitimately
  // contain example paths (docker mounts, reg commands, foreign user dirs) from the
  // source repos — they are reference content, not SEOSONA's portable runtime.
  '3_MEMORY/specs',
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

// A name is a label, not a document. Some generated KIs are written as a single long line, so the
// "first heading" / frontmatter `name` swallows the whole article — that blob then shows up as the
// resource name in every route result and drowns the real matches. Clamp it to a sane label length
// and fall back to the file slug when what we found is clearly prose, not a name.
const MAX_NAME_LENGTH = 120;

function sanitizeName(raw, relativePath) {
  const flat = (raw || '').replace(/\s+/g, ' ').trim();
  if (!flat) return slugToName(relativePath);
  if (flat.length <= MAX_NAME_LENGTH) return flat;
  const slug = slugToName(relativePath);
  return slug || `${flat.slice(0, MAX_NAME_LENGTH).trimEnd()}…`;
}

function makeResource(type, relativePath, source, extra = {}) {
  const content = readFileSafe(relativePath);
  const rawName = frontmatterField(content, 'name') || firstHeading(content) || slugToName(relativePath);
  const declaredName = sanitizeName(rawName, relativePath);
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
    const routeBase = path.posix.basename(relativePath.replace(/\/$/, ''));
    const routeSlug = routeBase.replace(/_/g, '-');
    const unprefixedRouteSlug = routeSlug.replace(/^seosona-/, '');
    const routeAliases = [
      routeSlug,
      `seosona:${routeSlug}`,
      unprefixedRouteSlug,
      `seosona:${unprefixedRouteSlug}`,
      routeBase,
    ].filter(Boolean);
    const enrichedKeywords = Array.from(new Set([...keywords, ...routeAliases]));
    const genericKeywords = new Set(['skill']);
    const name = enrichedKeywords.find((keyword) => keyword.includes(':'))
      || enrichedKeywords.find((keyword) => !genericKeywords.has(keyword))
      || enrichedKeywords[0]
      || slugToName(relativePath);

    resources.push({
      type: 'skill',
      name,
      keywords: enrichedKeywords,
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
      const matchedTerms = terms.filter((term) => haystack.includes(term));
      let score = matchedTerms.length;

      const isSystemTask = terms.some((t) => ['audit', 'system', 'workflow', 'os', 'seosona', 'capability'].includes(t));
      if (isSystemTask && resource.type === 'skill' && resource.source === 'SKILLS_ROUTER') {
        const boostedSkills = [
          'seosona:portable-capability-bridge'
        ];
        if (boostedSkills.includes(resource.name)) {
          score += 5;
        }
      }

      return enrichRouteMatch(resource, score, matchedTerms, terms.length);
    })
    .filter((resource) => resource.score > 0)
    .sort((a, b) => b.score - a.score || a.type.localeCompare(b.type) || a.name.localeCompare(b.name))
    .slice(0, 20);

  return { query, matches };
}

function enrichRouteMatch(resource, score, matchedTerms, termCount) {
  const confidence = Math.max(0.05, Math.min(1, score / Math.max(termCount, 1)));
  return {
    ...resource,
    score,
    confidence: Number(confidence.toFixed(2)),
    why_matched: matchedTerms.map((term) => `Matched query term: ${term}`),
    required_files: requiredFilesForResource(resource),
    risk_level: inferRiskLevel(resource, matchedTerms),
    safe_to_auto_execute: isSafeToAutoExecute(resource, matchedTerms),
    recommended_personas: recommendedPersonas(resource, matchedTerms),
  };
}

function requiredFilesForResource(resource) {
  const files = [resource.portablePath];
  const skillManifest = path.posix.join(resource.relativePath.replace(/\/$/, ''), 'SKILL.md');
  if (resource.type === 'skill' && exists(skillManifest)) {
    files.push(portable(skillManifest));
  }
  return Array.from(new Set(files));
}

function inferRiskLevel(resource, matchedTerms) {
  const haystack = [resource.name, resource.domain, resource.relativePath, ...matchedTerms].join(' ').toLowerCase();
  if (/(deploy|push|publish|credential|secret|security|auth|token|production|database|migration)/.test(haystack)) return 'high';
  if (/(git|commit|workflow|automation|script|api|integration|connector)/.test(haystack)) return 'medium';
  return 'low';
}

function isSafeToAutoExecute(resource, matchedTerms) {
  if (resource.type === 'contract' || resource.type === 'rule' || resource.type === 'sop' || resource.type === 'knowledge_item') return true;
  return inferRiskLevel(resource, matchedTerms) !== 'high';
}

function recommendedPersonas(resource, matchedTerms) {
  const haystack = [
    resource.type,
    resource.name,
    resource.domain,
    resource.relativePath,
    ...resource.keywords,
    ...matchedTerms,
  ].join(' ').toLowerCase();

  const personas = new Set();
  if (resource.type === 'agent') {
    personas.add(path.basename(resource.relativePath, path.extname(resource.relativePath)));
  }

  const rules = [
    [/seo|search|schema|sitemap|robots|content|keyword/, 'seo-specialist'],
    [/next|react|frontend|component|typescript|javascript|website|web app/, 'fullstack-developer'],
    [/ui|ux|design|layout|typography|palette|brand|visual/, 'ui-ux-designer'],
    [/accessibility|a11y|wcag/, 'accessibility-auditor'],
    [/motion|animation|gsap|anime/, 'frontend-motion-designer'],
    [/security|secret|credential|auth|token|vulnerab/, 'security-auditor'],
    [/test|qa|playwright|browser/, 'tester'],
    [/data|analytics|report|dashboard/, 'analytics-analyst'],
    [/automation|workflow|n8n|hook|ci|cd/, 'automation-engineer'],
    [/git|publish|release|branch|commit/, 'git-manager'],
  ];

  for (const [pattern, persona] of rules) {
    if (pattern.test(haystack)) personas.add(persona);
  }

  return Array.from(personas).sort();
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

  const skillCount = manifest.counts.skill || 0;
  if (skillCount < MIN_EXPECTED_SKILLS) {
    errors.push(
      `Skill index looks stale: only ${skillCount} routeable skills ` +
      `(expected >= ${MIN_EXPECTED_SKILLS}). Regenerate SKILLS_ROUTER.md via ` +
      `plugin_manager.py.`
    );
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
