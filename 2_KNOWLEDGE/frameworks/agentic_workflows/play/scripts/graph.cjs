#!/usr/bin/env node
/**
 * graph.cjs — Dependency graph evaluator for playbook steps
 *
 * Determines which steps are ready, blocked, stale, or completed.
 * Uses topological sort to resolve execution order.
 * Detects cycles, parallel-ready groups, and blocking chains.
 */

const fs = require('fs');
const path = require('path');
const { readManifest, writeManifest, getPlaybookDir } = require('./manifest.cjs');

/**
 * Evaluate the dependency graph for a playbook
 * @param {string} slug — playbook slug
 * @param {object} [manifest] — pre-loaded manifest (avoids re-read)
 * @returns {object} { ready, blocked, completed, inProgress, stale, gatePending, executionOrder }
 */
function evaluateGraph(slug, manifest) {
  if (!manifest) manifest = readManifest(slug);
  if (!manifest) {
    return { error: `Playbook "${slug}" not found`, ready: [], blocked: [], completed: [], inProgress: [], stale: [], gatePending: [], executionOrder: [] };
  }

  const steps = manifest.steps;
  const result = {
    ready: [],
    blocked: [],
    completed: [],
    inProgress: [],
    stale: [],
    gatePending: [],
    executionOrder: [],
    parallelGroups: []
  };

  let dirty = false;

  // First pass: categorize by current status
  for (const [id, step] of Object.entries(steps)) {
    switch (step.status) {
      case 'completed':
        result.completed.push(id);
        break;
      case 'in-progress':
        result.inProgress.push(id);
        break;
      case 'gate-pending':
        result.gatePending.push(id);
        break;
      case 'stale':
        result.stale.push(id);
        break;
      default:
        break;
    }
  }

  // Second pass: evaluate pending steps for readiness
  for (const [id, step] of Object.entries(steps)) {
    if (step.status !== 'pending' && step.status !== 'blocked') continue;

    const deps = step.dependsOn || [];
    const depsResolved = deps.every(depId => {
      const depStep = steps[depId];
      return depStep && depStep.status === 'completed';
    });

    if (depsResolved) {
      result.ready.push(id);
      if (step.status === 'blocked') {
        step.status = 'pending';
        dirty = true;
      }
    } else {
      result.blocked.push(id);
      if (step.status !== 'blocked') {
        step.status = 'blocked';
        dirty = true;
      }
      step.blockedBy = deps.filter(depId => {
        const depStep = steps[depId];
        return !depStep || depStep.status !== 'completed';
      });
      step.blockReason = buildBlockReason(steps, step.blockedBy);
    }
  }

  result.executionOrder = topologicalSort(steps);
  result.parallelGroups = identifyParallelGroups(steps, result.ready);

  if (dirty) {
    writeManifest(slug, manifest);
  }

  return result;
}

/**
 * Build a human-readable block reason
 */
function buildBlockReason(steps, blockerIds) {
  return blockerIds.map(id => {
    const step = steps[id];
    if (!step) return `Unknown step "${id}"`;
    const statusLabel = step.status === 'gate-pending' ? 'awaiting gate approval' : step.status;
    return `"${step.name}" (${statusLabel})`;
  }).join(', ');
}

/**
 * Topological sort of steps by dependency order
 */
function topologicalSort(steps) {
  const visited = new Set();
  const visiting = new Set();
  const order = [];

  function visit(id) {
    if (visited.has(id)) return;
    if (visiting.has(id)) return; // cycle

    visiting.add(id);
    const step = steps[id];
    if (step && step.dependsOn) {
      for (const depId of step.dependsOn) {
        visit(depId);
      }
    }
    visiting.delete(id);
    visited.add(id);
    order.push(id);
  }

  for (const id of Object.keys(steps)) {
    visit(id);
  }

  return order;
}

/**
 * Identify groups of steps that can run in parallel
 */
function identifyParallelGroups(steps, readyIds) {
  if (readyIds.length <= 1) return readyIds.length ? [readyIds] : [];

  const groups = [];
  const assigned = new Set();

  for (const id of readyIds) {
    if (assigned.has(id)) continue;

    const group = [id];
    assigned.add(id);

    const step = steps[id];
    if (!step.parallel) continue;

    for (const otherId of readyIds) {
      if (assigned.has(otherId)) continue;
      const otherStep = steps[otherId];
      if (!otherStep.parallel) continue;

      const hasDep = (step.dependsOn || []).includes(otherId)
        || (otherStep.dependsOn || []).includes(id);

      const outputOverlap = (step.expectedOutputs || []).some(o =>
        (otherStep.expectedOutputs || []).includes(o)
      );

      if (!hasDep && !outputOverlap) {
        group.push(otherId);
        assigned.add(otherId);
      }
    }

    groups.push(group);
  }

  for (const id of readyIds) {
    if (!assigned.has(id)) {
      groups.push([id]);
    }
  }

  return groups;
}

/**
 * Check for staleness — compare output file existence
 * @param {string} slug — playbook slug
 * @param {object} [manifest] — pre-loaded manifest
 * @returns {string[]} list of stale step IDs
 */
function detectStaleness(slug, manifest) {
  if (!manifest) manifest = readManifest(slug);
  if (!manifest) return [];

  const playbookDir = getPlaybookDir(slug);
  const staleSet = new Set();

  for (const [id, step] of Object.entries(manifest.steps)) {
    if (step.status !== 'completed') continue;

    const outputsMissing = (step.expectedOutputs || []).some(output => {
      return !fs.existsSync(path.join(playbookDir, output));
    });

    if (outputsMissing) {
      step.status = 'stale';
      staleSet.add(id);
    }
  }

  if (staleSet.size > 0) {
    // Cascade downstream using Set for O(1) lookups
    const queue = [...staleSet];
    while (queue.length > 0) {
      const staleId = queue.shift();
      for (const [id, step] of Object.entries(manifest.steps)) {
        if (step.status === 'completed' && !staleSet.has(id) && (step.dependsOn || []).includes(staleId)) {
          step.status = 'stale';
          staleSet.add(id);
          queue.push(id);
        }
      }
    }

    writeManifest(slug, manifest);
  }

  return [...staleSet];
}

/**
 * Get a formatted status dashboard for a playbook
 */
function formatStatusDashboard(slug) {
  const manifest = readManifest(slug);
  if (!manifest) return `Playbook "${slug}" not found.`;

  // Single manifest, passed through — no redundant reads
  detectStaleness(slug, manifest);
  const graph = evaluateGraph(slug, manifest);

  const lines = [];
  lines.push(`\u250C${'─'.repeat(60)}\u2510`);
  lines.push(`\u2502 ${manifest.name.padEnd(58)} \u2502`);
  lines.push(`\u2502 Template: ${(manifest.templateId || 'custom').padEnd(48)} \u2502`);
  lines.push(`\u2502 Status: ${manifest.status.padEnd(50)} \u2502`);
  lines.push(`\u251C${'─'.repeat(60)}\u2524`);

  const stageMap = {};
  for (const [id, step] of Object.entries(manifest.steps)) {
    const stageName = step.stageName || 'Ungrouped';
    if (!stageMap[stageName]) stageMap[stageName] = [];
    stageMap[stageName].push({ id, ...step });
  }

  for (const [stageName, stageSteps] of Object.entries(stageMap)) {
    lines.push(`\u2502 ${stageName.padEnd(58)} \u2502`);
    for (const step of stageSteps) {
      const icon = statusIcon(step.status);
      const name = step.name.length > 44 ? step.name.substring(0, 41) + '...' : step.name;
      lines.push(`\u2502   ${icon} ${name.padEnd(54)} \u2502`);
    }
    lines.push(`\u2502${' '.repeat(60)}\u2502`);
  }

  const m = manifest.meta;
  lines.push(`\u251C${'─'.repeat(60)}\u2524`);
  lines.push(`\u2502 Progress: ${m.completed}/${m.totalSteps} completed, ${m.blocked} blocked, ${m.stale} stale${' '.repeat(Math.max(0, 14 - String(m.completed).length - String(m.totalSteps).length))} \u2502`);

  if (graph.ready.length > 0) {
    lines.push(`\u2502${' '.repeat(60)}\u2502`);
    lines.push(`\u2502 Ready to run:${' '.repeat(46)}\u2502`);
    for (const id of graph.ready.slice(0, 5)) {
      const step = manifest.steps[id];
      lines.push(`\u2502   \u2192 ${step.name.padEnd(53)} \u2502`);
    }
  }

  lines.push(`\u2514${'─'.repeat(60)}\u2518`);

  return lines.join('\n');
}

function statusIcon(status) {
  switch (status) {
    case 'completed': return '\u2705';
    case 'in-progress': return '\uD83D\uDD04';
    case 'gate-pending': return '\u23F8\uFE0F';
    case 'blocked': return '\u26D4';
    case 'stale': return '\u26A0\uFE0F';
    default: return '\u23F3';
  }
}

// CLI mode
if (require.main === module) {
  const [,, action, slug] = process.argv;

  switch (action) {
    case 'evaluate': {
      const result = evaluateGraph(slug);
      console.log(JSON.stringify(result, null, 2));
      break;
    }
    case 'status': {
      console.log(formatStatusDashboard(slug));
      break;
    }
    case 'staleness': {
      const stale = detectStaleness(slug);
      console.log(JSON.stringify(stale, null, 2));
      break;
    }
    default:
      console.log('Usage: graph.cjs [evaluate|status|staleness] <slug>');
  }
}

module.exports = {
  evaluateGraph,
  topologicalSort,
  identifyParallelGroups,
  detectStaleness,
  formatStatusDashboard
};
