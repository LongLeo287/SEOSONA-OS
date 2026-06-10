#!/usr/bin/env node
/**
 * manifest.cjs — Playbook manifest CRUD operations
 *
 * Manages data/playbooks/{slug}/manifest.json state.
 * Handles creation, reading, updating steps, goals, and learnings.
 */

const fs = require('fs');
const path = require('path');

const PLAYBOOKS_DIR = 'data/playbooks';

let _cachedPlaybooksDir = null;

/**
 * Resolve absolute path for playbooks directory from project root (cached)
 */
function getPlaybooksDir() {
  if (_cachedPlaybooksDir) return _cachedPlaybooksDir;
  let dir = process.cwd();
  for (let i = 0; i < 10; i++) {
    if (fs.existsSync(path.join(dir, 'CLAUDE.md')) || fs.existsSync(path.join(dir, 'package.json'))) {
      _cachedPlaybooksDir = path.join(dir, PLAYBOOKS_DIR);
      return _cachedPlaybooksDir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  _cachedPlaybooksDir = path.join(process.cwd(), PLAYBOOKS_DIR);
  return _cachedPlaybooksDir;
}

/**
 * Slugify a playbook name
 */
function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Get manifest path for a playbook
 */
function getManifestPath(slug) {
  return path.join(getPlaybooksDir(), slug, 'manifest.json');
}

/**
 * Get playbook directory path
 */
function getPlaybookDir(slug) {
  return path.join(getPlaybooksDir(), slug);
}

/**
 * Read manifest for a playbook
 * @param {string} slug — playbook slug
 * @returns {object|null} manifest object or null if not found
 */
function readManifest(slug) {
  const manifestPath = getManifestPath(slug);
  try {
    return JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    console.error(`Error reading manifest for ${slug}: ${err.message}`);
    return null;
  }
}

/**
 * Write manifest for a playbook
 * @param {string} slug — playbook slug
 * @param {object} manifest — manifest object
 */
function writeManifest(slug, manifest) {
  const manifestPath = getManifestPath(slug);
  const dir = path.dirname(manifestPath);
  fs.mkdirSync(dir, { recursive: true });
  manifest.updatedAt = new Date().toISOString();
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf-8');
}

/**
 * Create a new playbook manifest from a template
 * @param {string} name — display name
 * @param {object} template — parsed template object
 * @param {object} inputs — user-provided input values
 * @returns {object} created manifest
 */
function createManifest(name, template, inputs) {
  const slug = slugify(name);
  const now = new Date().toISOString();

  // Build steps from template stages
  const steps = {};
  if (template && template.stages) {
    for (const stage of template.stages) {
      for (const step of stage.steps) {
        steps[step.id] = {
          status: 'pending',
          stageId: stage.id,
          stageName: stage.name,
          name: step.name,
          strategy: step.strategy || '',
          ai_execution: step.ai_execution || '',
          human_decision: step.human_decision || '',
          command: step.command || null,
          agent: step.agent || null,
          skills: step.skills || [],
          dependsOn: step.dependsOn || [],
          parallel: step.parallel || false,
          gate: step.gate || null,
          expectedOutputs: step.outputs || [],
          outputs: [],
          startedAt: null,
          completedAt: null,
          metrics_impact: {}
        };
      }
    }
  }

  // Build goals from template defaults
  const goals = {};
  if (template && template.goal_targets) {
    for (const [key, config] of Object.entries(template.goal_targets)) {
      goals[key] = {
        current: 0,
        target: config.default || 0,
        baseline: 0,
        source: config.metric || 'manual',
        trend: [],
        updated_at: null
      };
    }
  }

  const manifest = {
    id: slug,
    name: name,
    slug: slug,
    templateId: template ? `${template.id}@${template.version}` : null,
    status: 'active',
    createdAt: now,
    updatedAt: now,
    inputs: inputs || {},
    goals: goals,
    steps: steps,
    learnings: [],
    customizations: {
      skippedSteps: [],
      addedSteps: [],
      modifiedGates: {}
    },
    meta: {
      totalSteps: Object.keys(steps).length,
      completed: 0,
      inProgress: 0,
      gatePending: 0,
      blocked: 0,
      pending: Object.keys(steps).length,
      stale: 0
    }
  };

  // Create workspace directories
  const playbookDir = getPlaybookDir(slug);
  const dirs = ['research', 'content', 'reports'];
  for (const d of dirs) {
    const dirPath = path.join(playbookDir, d);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  writeManifest(slug, manifest);
  return manifest;
}

/**
 * Update a step's status in the manifest
 * @param {string} slug — playbook slug
 * @param {string} stepId — step identifier
 * @param {object} updates — fields to update (status, outputs, gate, etc.)
 * @returns {object|null} updated manifest
 */
function updateStep(slug, stepId, updates) {
  const manifest = readManifest(slug);
  if (!manifest) return null;
  if (!manifest.steps[stepId]) return null;

  const step = manifest.steps[stepId];
  const now = new Date().toISOString();

  if (updates.status) {
    step.status = updates.status;
    if (updates.status === 'in-progress' && !step.startedAt) {
      step.startedAt = now;
    }
    if (updates.status === 'completed') {
      step.completedAt = now;
    }
  }

  if (updates.outputs) {
    step.outputs = [...new Set([...step.outputs, ...updates.outputs])];
  }

  if (updates.gate) {
    step.gate = { ...step.gate, ...updates.gate };
  }

  if (updates.metrics_impact) {
    step.metrics_impact = { ...step.metrics_impact, ...updates.metrics_impact };
  }

  // Recompute meta counts
  recalcMeta(manifest);
  writeManifest(slug, manifest);
  return manifest;
}

/**
 * Update goal values in the manifest
 * @param {string} slug — playbook slug
 * @param {string} metricKey — goal metric key
 * @param {object} updates — { current, target, baseline, source }
 * @returns {object|null} updated manifest
 */
function updateGoal(slug, metricKey, updates) {
  const manifest = readManifest(slug);
  if (!manifest) return null;

  if (!manifest.goals) manifest.goals = {};

  const now = new Date().toISOString();
  const existing = manifest.goals[metricKey] || {
    current: 0,
    target: 0,
    baseline: 0,
    source: 'manual',
    trend: [],
    updated_at: null
  };

  if (updates.current !== undefined) {
    existing.trend.push(updates.current);
    // Keep last 30 data points
    if (existing.trend.length > 30) {
      existing.trend = existing.trend.slice(-30);
    }
    existing.current = updates.current;
    existing.updated_at = now;
  }

  if (updates.target !== undefined) existing.target = updates.target;
  if (updates.baseline !== undefined) existing.baseline = updates.baseline;
  if (updates.source !== undefined) existing.source = updates.source;

  manifest.goals[metricKey] = existing;
  writeManifest(slug, manifest);
  return manifest;
}

/**
 * Add a learning to the manifest
 * @param {string} slug — playbook slug
 * @param {object} learning — { category, pattern, source, example }
 */
function addLearning(slug, learning) {
  const manifest = readManifest(slug);
  if (!manifest) return null;

  manifest.learnings.push({
    ...learning,
    capturedAt: new Date().toISOString()
  });

  // Cap at 30 learnings
  if (manifest.learnings.length > 30) {
    manifest.learnings = manifest.learnings.slice(-30);
  }

  writeManifest(slug, manifest);
  return manifest;
}

/**
 * Reset a step or entire playbook
 * @param {string} slug — playbook slug
 * @param {string|null} stepId — specific step to reset, or null for all
 */
function resetStep(slug, stepId) {
  const manifest = readManifest(slug);
  if (!manifest) return null;

  if (stepId) {
    if (!manifest.steps[stepId]) return null;
    manifest.steps[stepId].status = 'pending';
    manifest.steps[stepId].startedAt = null;
    manifest.steps[stepId].completedAt = null;
    manifest.steps[stepId].outputs = [];

    // Mark downstream steps as stale
    for (const step of Object.values(manifest.steps)) {
      if (step.dependsOn && step.dependsOn.includes(stepId) && step.status === 'completed') {
        step.status = 'stale';
      }
    }
  } else {
    // Reset all steps
    for (const step of Object.values(manifest.steps)) {
      step.status = 'pending';
      step.startedAt = null;
      step.completedAt = null;
      step.outputs = [];
    }
  }

  recalcMeta(manifest);
  writeManifest(slug, manifest);
  return manifest;
}

/**
 * List all playbooks
 * @returns {Array} list of { slug, name, status, templateId, meta }
 */
function listPlaybooks() {
  const dir = getPlaybooksDir();
  if (!fs.existsSync(dir)) return [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const playbooks = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith('.')) continue;

    const manifest = readManifest(entry.name);
    if (manifest) {
      playbooks.push({
        slug: manifest.slug,
        name: manifest.name,
        status: manifest.status,
        templateId: manifest.templateId,
        createdAt: manifest.createdAt,
        updatedAt: manifest.updatedAt,
        meta: manifest.meta,
        goals: manifest.goals
      });
    }
  }

  return playbooks;
}

/**
 * Recalculate meta counts from step statuses
 */
function recalcMeta(manifest) {
  const counts = {
    totalSteps: 0,
    completed: 0,
    inProgress: 0,
    gatePending: 0,
    blocked: 0,
    pending: 0,
    stale: 0
  };

  for (const step of Object.values(manifest.steps)) {
    counts.totalSteps++;
    switch (step.status) {
      case 'completed': counts.completed++; break;
      case 'in-progress': counts.inProgress++; break;
      case 'gate-pending': counts.gatePending++; break;
      case 'blocked': counts.blocked++; break;
      case 'stale': counts.stale++; break;
      default: counts.pending++; break;
    }
  }

  manifest.meta = counts;
}

/**
 * Check if output files exist for a step
 * @param {string} slug — playbook slug
 * @param {string} stepId — step identifier
 * @returns {object} { exists: boolean, missing: string[] }
 */
function checkOutputs(slug, stepId) {
  const manifest = readManifest(slug);
  if (!manifest || !manifest.steps[stepId]) return { exists: false, missing: [] };

  const step = manifest.steps[stepId];
  const playbookDir = getPlaybookDir(slug);
  const missing = [];

  for (const output of step.expectedOutputs) {
    const outputPath = path.join(playbookDir, output);
    if (!fs.existsSync(outputPath)) {
      missing.push(output);
    }
  }

  return { exists: missing.length === 0, missing };
}

// CLI mode
if (require.main === module) {
  const [,, action, ...args] = process.argv;

  switch (action) {
    case 'list': {
      const playbooks = listPlaybooks();
      console.log(JSON.stringify(playbooks, null, 2));
      break;
    }
    case 'read': {
      const manifest = readManifest(args[0]);
      console.log(JSON.stringify(manifest, null, 2));
      break;
    }
    case 'create': {
      const name = args[0];
      const templatePath = args[1];
      let template = null;
      if (templatePath && fs.existsSync(templatePath)) {
        template = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));
      }
      const manifest = createManifest(name, template, {});
      console.log(JSON.stringify(manifest, null, 2));
      break;
    }
    case 'update-step': {
      const updates = JSON.parse(args.slice(2).join(' '));
      const result = updateStep(args[0], args[1], updates);
      console.log(JSON.stringify(result, null, 2));
      break;
    }
    case 'update-goal': {
      const goalUpdates = JSON.parse(args.slice(2).join(' '));
      const goalResult = updateGoal(args[0], args[1], goalUpdates);
      console.log(JSON.stringify(goalResult, null, 2));
      break;
    }
    default:
      console.log('Usage: manifest.cjs [list|read|create|update-step|update-goal] [args...]');
  }
}

module.exports = {
  slugify,
  getPlaybooksDir,
  getPlaybookDir,
  getManifestPath,
  readManifest,
  writeManifest,
  createManifest,
  updateStep,
  updateGoal,
  addLearning,
  resetStep,
  listPlaybooks,
  recalcMeta,
  checkOutputs
};
