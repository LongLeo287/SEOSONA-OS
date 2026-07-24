#!/usr/bin/env node
/**
 * smart-suggest.cjs — Goal-aligned suggestion engine
 *
 * Maps goal gaps to playbook steps, prioritizes by gap size,
 * and filters to only suggest steps that are actually ready to run.
 */

const { readManifest } = require('./manifest.cjs');
const { evaluateGraph } = require('./graph.cjs');
const { getGoals, computeGap, computeTrend } = require('./goals.cjs');

/**
 * Mapping of goal metric keys to relevant skill keywords
 * Steps whose skills array contains these keywords impact that goal.
 */
const GOAL_SKILL_MAP = {
  organic_traffic: ['seo', 'content-marketing', 'pseo', 'blog', 'content'],
  keywords_top10: ['seo', 'keyword', 'search'],
  page_views: ['seo', 'content-marketing', 'content', 'blog'],
  mrr: ['campaign', 'email', 'funnel', 'conversion', 'payment', 'pricing', 'sales'],
  revenue: ['campaign', 'email', 'funnel', 'conversion', 'payment', 'pricing', 'sales'],
  arr: ['campaign', 'email', 'funnel', 'conversion', 'payment', 'pricing', 'sales'],
  email_subscribers: ['email', 'content-marketing', 'lead-magnet', 'newsletter', 'content'],
  email_subs: ['email', 'content-marketing', 'lead-magnet', 'newsletter', 'content'],
  social_followers: ['social', 'content', 'community'],
  twitter_followers: ['social', 'twitter', 'content'],
  linkedin_followers: ['social', 'linkedin', 'content'],
  customers: ['funnel', 'conversion', 'campaign', 'sales', 'payment'],
  signups: ['funnel', 'conversion', 'landing-page', 'campaign'],
  trial_conversions: ['funnel', 'onboarding', 'email', 'conversion'],
  bounce_rate: ['seo', 'ux', 'content', 'performance'],
  domain_authority: ['seo', 'link-building', 'content-marketing'],
  backlinks: ['seo', 'link-building', 'outreach'],
  leads_generated: ['campaign', 'funnel', 'lead', 'landing-page', 'email', 'ads'],
  campaign_cac: ['campaign', 'ads', 'funnel', 'conversion', 'analytics'],
  content_pieces: ['content', 'content-marketing', 'blog', 'social', 'copywriting'],
  conversion_rate: ['funnel', 'conversion', 'landing-page', 'form-cro', 'campaign'],
  ph_upvotes: ['social', 'campaign', 'community', 'content-marketing'],
  launch_day_visits: ['seo', 'social', 'campaign', 'content-marketing'],
  trial_signups: ['funnel', 'campaign', 'landing-page', 'email', 'conversion'],
  email_signups: ['email', 'content-marketing', 'lead-magnet', 'landing-page'],
  content_velocity: ['content', 'content-marketing', 'blog', 'copywriting'],
  avg_time_on_page: ['content', 'seo', 'copywriting']
};

/**
 * Compute gap priority ranking for all goals
 * @param {object} goals — goals map from manifest
 * @returns {Array} sorted array of { key, gap, percentage, priority, trend }
 */
function computeGapPriority(goals) {
  const ranked = [];

  for (const [key, goal] of Object.entries(goals)) {
    const { percentage, gap, priority } = computeGap(goal);
    const trend = computeTrend(goal.trend);

    ranked.push({
      key,
      gap,
      percentage,
      priority,
      trend,
      current: goal.current || 0,
      target: goal.target || 0
    });
  }

  // Sort by gap size descending (furthest from target first)
  // Within same priority, prefer goals trending flat/down (need more help)
  ranked.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2, 'on-track': 3 };
    const pa = priorityOrder[a.priority] || 3;
    const pb = priorityOrder[b.priority] || 3;
    if (pa !== pb) return pa - pb;

    // Within same priority, prefer flat/down trends
    const trendOrder = { down: 0, flat: 1, up: 2 };
    const ta = trendOrder[a.trend] || 1;
    const tb = trendOrder[b.trend] || 1;
    if (ta !== tb) return ta - tb;

    return b.gap - a.gap;
  });

  return ranked;
}

/**
 * Map a goal key to playbook steps that impact it
 * @param {string} goalKey — goal metric key
 * @param {object} steps — steps map from manifest
 * @returns {string[]} step IDs that could impact this goal
 */
function mapGoalToSteps(goalKey, steps) {
  const skillKeywords = GOAL_SKILL_MAP[goalKey] || [];
  if (skillKeywords.length === 0) return [];

  const matching = [];

  for (const [stepId, step] of Object.entries(steps)) {
    const stepSkills = step.skills || [];
    const stepName = (step.name || '').toLowerCase();
    const stepStrategy = (step.strategy || '').toLowerCase();

    const hasMatch = skillKeywords.some(keyword => {
      const kw = keyword.toLowerCase();
      return stepSkills.some(s => s.toLowerCase().includes(kw))
        || stepName.includes(kw)
        || stepStrategy.includes(kw);
    });

    if (hasMatch) {
      matching.push(stepId);
    }
  }

  return matching;
}

/**
 * Filter to only steps that are ready to execute
 * @param {string[]} stepIds — candidate step IDs
 * @param {object} graphResult — output from evaluateGraph()
 * @returns {string[]} step IDs that are in the ready list
 */
function filterReadySteps(stepIds, graphResult) {
  const readySet = new Set(graphResult.ready || []);
  return stepIds.filter(id => readySet.has(id));
}

/**
 * Generate top suggestions aligned to goal gaps
 * @param {string} slug — playbook slug
 * @param {number} maxSuggestions — how many to return (default 3)
 * @returns {object} { suggestions: [], gaps: [] }
 */
function generateSuggestions(slug, maxSuggestions) {
  maxSuggestions = maxSuggestions || 3;

  const manifest = readManifest(slug);
  if (!manifest) return { suggestions: [], gaps: [], error: `Playbook "${slug}" not found` };

  const goals = manifest.goals || {};
  if (Object.keys(goals).length === 0) {
    return { suggestions: [], gaps: [], error: 'No goals configured' };
  }

  const graphResult = evaluateGraph(slug);
  const gaps = computeGapPriority(goals);
  const suggestions = [];
  const usedSteps = new Set();

  for (const gap of gaps) {
    if (suggestions.length >= maxSuggestions) break;
    if (gap.priority === 'on-track') continue;

    // Find steps that impact this goal
    const candidateSteps = mapGoalToSteps(gap.key, manifest.steps);
    const readySteps = filterReadySteps(candidateSteps, graphResult);

    // Also consider non-ready candidates for awareness
    const allCandidates = candidateSteps.filter(id => !usedSteps.has(id));

    // Prefer ready steps
    const bestSteps = readySteps.filter(id => !usedSteps.has(id));

    if (bestSteps.length > 0) {
      const stepId = bestSteps[0];
      const step = manifest.steps[stepId];
      usedSteps.add(stepId);

      const trendNote = gap.trend === 'flat' ? ', needs boost' :
                        gap.trend === 'down' ? ', declining!' :
                        '';

      suggestions.push({
        priority: gap.priority.toUpperCase(),
        stepId,
        stepName: step.name,
        goalKey: gap.key,
        reason: `${gap.key} gap is biggest lever${trendNote}`,
        ready: true,
        command: step.command || null,
        gap: gap
      });
    } else if (allCandidates.length > 0) {
      // Suggest blocked step with context
      const stepId = allCandidates[0];
      const step = manifest.steps[stepId];
      usedSteps.add(stepId);

      suggestions.push({
        priority: gap.priority.toUpperCase(),
        stepId,
        stepName: step.name,
        goalKey: gap.key,
        reason: `${gap.key} needs attention (step blocked — complete dependencies first)`,
        ready: false,
        blockedBy: step.blockedBy || step.dependsOn || [],
        gap: gap
      });
    }
  }

  return { suggestions, gaps };
}

/**
 * Format suggestions as readable text
 * @param {Array} suggestions — from generateSuggestions()
 * @returns {string} formatted output
 */
function formatSuggestions(suggestions) {
  if (!suggestions || suggestions.length === 0) {
    return 'No suggestions — all goals on track or no actionable steps found.';
  }

  const lines = ['Smart Suggestions (goal-aligned):'];

  suggestions.forEach((s, i) => {
    const readyTag = s.ready ? '' : ' [BLOCKED]';
    const line = `  ${i + 1}. [${s.priority}] ${s.stepName}${readyTag} -> ${s.reason}`;
    lines.push(line);
  });

  return lines.join('\n');
}

// CLI mode
if (require.main === module) {
  const [,, action, ...args] = process.argv;

  switch (action) {
    case 'suggest': {
      const slug = args[0];
      const max = args[1] ? Number(args[1]) : 3;
      const result = generateSuggestions(slug, max);
      if (result.error) {
        console.error(result.error);
        break;
      }
      console.log(formatSuggestions(result.suggestions));
      console.log('');
      console.log('Gap analysis:');
      for (const g of result.gaps) {
        console.log(`  ${g.key}: ${g.percentage}% complete (${g.priority}) ${g.trend}`);
      }
      break;
    }
    case 'gaps': {
      const slug = args[0];
      const goals = getGoals(slug);
      if (!goals) { console.log('Playbook not found.'); break; }
      const gaps = computeGapPriority(goals);
      console.log(JSON.stringify(gaps, null, 2));
      break;
    }
    case 'map': {
      // map <slug> <goalKey> — show which steps impact a goal
      const slug = args[0];
      const goalKey = args[1];
      const manifest = readManifest(slug);
      if (!manifest) { console.log('Playbook not found.'); break; }
      const steps = mapGoalToSteps(goalKey, manifest.steps);
      console.log(JSON.stringify(steps, null, 2));
      break;
    }
    case 'json': {
      const slug = args[0];
      const max = args[1] ? Number(args[1]) : 5;
      const result = generateSuggestions(slug, max);
      console.log(JSON.stringify(result, null, 2));
      break;
    }
    default:
      console.log('Usage: smart-suggest.cjs [suggest|gaps|map|json] <slug> [args...]');
      console.log('  suggest <slug> [max]     — top N goal-aligned suggestions');
      console.log('  gaps <slug>              — ranked gap analysis');
      console.log('  map <slug> <goalKey>     — steps that impact a goal');
      console.log('  json <slug> [max]        — full JSON output');
  }
}

module.exports = {
  generateSuggestions,
  computeGapPriority,
  mapGoalToSteps,
  filterReadySteps,
  formatSuggestions
};
