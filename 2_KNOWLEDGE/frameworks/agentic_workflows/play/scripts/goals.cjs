#!/usr/bin/env node
/**
 * goals.cjs — Goal tracking, trend computation, and dashboard formatting
 *
 * Orchestrates goal management for playbooks: read/set goals,
 * update values, pull metrics from external sources, and display progress.
 */

const { readManifest, updateGoal } = require('./manifest.cjs');

/**
 * Get all goals for a playbook
 * @param {string} slug — playbook slug
 * @returns {object|null} goals map or null
 */
function getGoals(slug) {
  const manifest = readManifest(slug);
  if (!manifest) return null;
  return manifest.goals || {};
}

/**
 * Set a goal target
 * @param {string} slug — playbook slug
 * @param {string} metricKey — goal metric key (e.g. organic_traffic)
 * @param {number} target — target value
 * @param {string} source — data source identifier (e.g. ga4, gsc, stripe, manual)
 * @returns {object|null} updated manifest
 */
function setGoal(slug, metricKey, target, source) {
  return updateGoal(slug, metricKey, { target, source: source || 'manual' });
}

/**
 * Update a goal's current value and append to trend history
 * @param {string} slug — playbook slug
 * @param {string} metricKey — goal metric key
 * @param {number} currentValue — latest value
 * @returns {object|null} updated manifest
 */
function updateGoalValue(slug, metricKey, currentValue) {
  return updateGoal(slug, metricKey, { current: currentValue });
}

/**
 * Pull all metrics from configured sources via metrics-bridge
 * @param {string} slug — playbook slug
 * @returns {object} { updated: [], skipped: [], errors: [] }
 */
function pullAllMetrics(slug) {
  const { readManifest: readM, writeManifest: writeM } = require('./manifest.cjs');
  const manifest = readM(slug);
  if (!manifest || !manifest.goals) return { updated: [], skipped: [], errors: [] };

  let bridge;
  try {
    bridge = require('./metrics-bridge.cjs');
  } catch (err) {
    return { updated: [], skipped: [], errors: ['metrics-bridge.cjs not available'] };
  }

  const results = { updated: [], skipped: [], errors: [] };
  let dirty = false;
  const now = new Date().toISOString();

  for (const [key, goal] of Object.entries(manifest.goals)) {
    const source = goal.source || 'manual';
    if (source === 'manual') {
      results.skipped.push({ key, reason: 'manual source — update via CLI' });
      continue;
    }

    try {
      const data = bridge.pullMetric(source, { metricKey: key });
      if (data && data.available !== false && data.value !== undefined) {
        // Update in-memory — no per-goal disk write
        goal.trend.push(data.value);
        if (goal.trend.length > 30) goal.trend = goal.trend.slice(-30);
        goal.current = data.value;
        goal.updated_at = now;
        results.updated.push({ key, value: data.value, source });
        dirty = true;
      } else {
        const msg = (data && data.message) || `No data from ${source}`;
        results.skipped.push({ key, reason: msg });
      }
    } catch (err) {
      results.errors.push({ key, error: err.message });
    }
  }

  // Single write for all goal updates
  if (dirty) {
    writeM(slug, manifest);
  }

  return results;
}

/**
 * Compute trend direction from an array of values
 * @param {number[]} trendArray — historical values (oldest first)
 * @returns {string} "up", "down", or "flat"
 */
function computeTrend(trendArray) {
  if (!trendArray || trendArray.length < 2) return 'flat';

  const recent = trendArray.slice(-3);
  if (recent.length < 2) return 'flat';

  const first = recent[0];
  const last = recent[recent.length - 1];
  const diff = last - first;

  if (first === 0) return last > 0 ? 'up' : 'flat';
  const pctChange = Math.abs(diff / first);
  if (pctChange < 0.02) return 'flat';

  return diff > 0 ? 'up' : 'down';
}

/**
 * Compute gap analysis for a goal
 * @param {object} goal — { current, target, trend }
 * @returns {object} { percentage, gap, priority }
 */
function computeGap(goal) {
  const current = goal.current || 0;
  const target = goal.target || 1;
  const percentage = Math.round((current / target) * 100);
  const gap = target - current;

  let priority = 'low';
  if (percentage < 25) priority = 'high';
  else if (percentage < 50) priority = 'medium';
  else if (percentage < 75) priority = 'low';
  else priority = 'on-track';

  return { percentage, gap, priority };
}

/**
 * Format goals as a visual dashboard
 * @param {string} slug — playbook slug
 * @returns {string} formatted dashboard text
 */
function formatGoalsDashboard(slug) {
  const goals = getGoals(slug);
  if (!goals) return `Playbook "${slug}" not found.`;
  if (Object.keys(goals).length === 0) return 'No goals configured.';

  const lines = ['Goal Progress:'];

  for (const [key, goal] of Object.entries(goals)) {
    const current = goal.current || 0;
    const target = goal.target || 0;
    const pct = target > 0 ? Math.round((current / target) * 100) : 0;
    const trend = computeTrend(goal.trend);

    const trendIcon = trend === 'up' ? 'trending up' :
                      trend === 'down' ? 'trending down' :
                      'flat';
    const trendArrow = trend === 'up' ? '>' :
                       trend === 'down' ? '<' :
                       '-';

    const isRevenue = key.includes('mrr') || key.includes('revenue') || key.includes('arr');
    const fmtVal = isRevenue ? `$${current}/$${target}` : `${current}/${target}`;

    const label = key.padEnd(20);
    lines.push(`  ${label} ${fmtVal} (${pct}%) ${trendArrow} ${trendIcon}`);
  }

  return lines.join('\n');
}

// CLI mode
if (require.main === module) {
  const [,, action, ...args] = process.argv;

  switch (action) {
    case 'get': {
      const goals = getGoals(args[0]);
      console.log(JSON.stringify(goals, null, 2));
      break;
    }
    case 'set': {
      const result = setGoal(args[0], args[1], Number(args[2]), args[3]);
      console.log(JSON.stringify(result ? result.goals : null, null, 2));
      break;
    }
    case 'update': {
      const result = updateGoalValue(args[0], args[1], Number(args[2]));
      console.log(JSON.stringify(result ? result.goals : null, null, 2));
      break;
    }
    case 'pull': {
      const result = pullAllMetrics(args[0]);
      console.log(JSON.stringify(result, null, 2));
      break;
    }
    case 'dashboard': {
      console.log(formatGoalsDashboard(args[0]));
      break;
    }
    case 'gap': {
      const goals = getGoals(args[0]);
      if (!goals) { console.log('Playbook not found.'); break; }
      const gaps = {};
      for (const [key, goal] of Object.entries(goals)) {
        gaps[key] = computeGap(goal);
      }
      console.log(JSON.stringify(gaps, null, 2));
      break;
    }
    default:
      console.log('Usage: goals.cjs [get|set|update|pull|dashboard|gap] <slug> [args...]');
  }
}

module.exports = {
  getGoals,
  setGoal,
  updateGoalValue,
  pullAllMetrics,
  formatGoalsDashboard,
  computeTrend,
  computeGap
};
