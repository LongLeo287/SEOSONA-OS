#!/usr/bin/env node
/**
 * template-loader.cjs — Load, validate, list, and instantiate playbook templates
 *
 * Functions: loadTemplate, validateTemplate, listTemplates, instantiateTemplate
 * CLI: node template-loader.cjs list|validate <path>|load <id>
 */

const fs = require('fs');
const path = require('path');

const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');
const SCHEMA_PATH = path.join(TEMPLATES_DIR, '_schema.json');

let _cachedSchema = null;

/**
 * Load and parse the schema (cached)
 */
function getSchema() {
  if (!_cachedSchema) {
    _cachedSchema = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf-8'));
  }
  return _cachedSchema;
}

/**
 * Validate a value against a simple JSON Schema subset (no $ref resolution needed for top-level)
 * Returns { valid: boolean, errors: string[] }
 */
function validateTemplate(template) {
  const schema = getSchema();
  const errors = [];

  // Check required top-level fields
  if (schema.required) {
    for (const field of schema.required) {
      if (template[field] === undefined || template[field] === null) {
        errors.push(`Missing required field: "${field}"`);
      }
    }
  }

  // Validate id
  if (template.id !== undefined) {
    if (typeof template.id !== 'string') {
      errors.push('"id" must be a string');
    } else if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(template.id)) {
      errors.push('"id" must be kebab-case (lowercase alphanumeric and hyphens)');
    }
  }

  // Validate name
  if (template.name !== undefined && (typeof template.name !== 'string' || template.name.length === 0)) {
    errors.push('"name" must be a non-empty string');
  }

  // Validate version (semver)
  if (template.version !== undefined) {
    if (typeof template.version !== 'string' || !/^\d+\.\d+\.\d+$/.test(template.version)) {
      errors.push('"version" must be semver format (e.g. "1.0.0")');
    }
  }

  // Validate difficulty
  if (template.difficulty !== undefined) {
    const allowed = ['beginner', 'intermediate', 'advanced'];
    if (!allowed.includes(template.difficulty)) {
      errors.push(`"difficulty" must be one of: ${allowed.join(', ')}`);
    }
  }

  // Validate stages
  if (Array.isArray(template.stages)) {
    if (template.stages.length === 0) {
      errors.push('"stages" must have at least 1 item');
    }
    // Precompute all step IDs for O(1) dependency lookups
    const allStepIds = new Set(
      template.stages.flatMap(s => (s.steps || []).map(st => st.id).filter(Boolean))
    );
    const seenIds = new Set();
    for (let si = 0; si < template.stages.length; si++) {
      const stage = template.stages[si];
      if (!stage.id) errors.push(`stages[${si}]: missing "id"`);
      if (!stage.name) errors.push(`stages[${si}]: missing "name"`);
      if (!Array.isArray(stage.steps) || stage.steps.length === 0) {
        errors.push(`stages[${si}] ("${stage.id || si}"): must have at least 1 step`);
        continue;
      }
      for (let ti = 0; ti < stage.steps.length; ti++) {
        const step = stage.steps[ti];
        const loc = `stages[${si}].steps[${ti}] ("${step.id || ti}")`;
        if (!step.id) errors.push(`${loc}: missing "id"`);
        if (!step.name) errors.push(`${loc}: missing "name"`);
        if (!step.strategy || typeof step.strategy !== 'string' || step.strategy.length < 20) {
          errors.push(`${loc}: "strategy" must be a string with at least 20 characters of substantive advice`);
        }
        if (!step.ai_execution || typeof step.ai_execution !== 'string' || step.ai_execution.length < 20) {
          errors.push(`${loc}: "ai_execution" must be a string with at least 20 characters`);
        }
        if (!step.human_decision || typeof step.human_decision !== 'string' || step.human_decision.length < 20) {
          errors.push(`${loc}: "human_decision" must be a string with at least 20 characters`);
        }
        if (step.id) {
          if (seenIds.has(step.id)) {
            errors.push(`${loc}: duplicate step id "${step.id}"`);
          }
          seenIds.add(step.id);
        }
        if (Array.isArray(step.dependsOn)) {
          for (const dep of step.dependsOn) {
            if (!allStepIds.has(dep)) {
              errors.push(`${loc}: dependsOn references unknown step "${dep}"`);
            }
          }
        }
      }
    }
  }

  // Validate gates
  if (template.gates) {
    for (const [name, gate] of Object.entries(template.gates)) {
      if (!gate.type || !['auto', 'manual'].includes(gate.type)) {
        errors.push(`gates["${name}"]: "type" must be "auto" or "manual"`);
      }
      if (gate.pass_threshold !== undefined && (gate.pass_threshold < 0 || gate.pass_threshold > 1)) {
        errors.push(`gates["${name}"]: "pass_threshold" must be between 0 and 1`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Load a template by ID (looks in templates/) or by file path
 */
function loadTemplate(idOrPath) {
  let filePath;

  // Check if it's a file path
  if (idOrPath.includes('/') || idOrPath.includes('\\') || idOrPath.endsWith('.json')) {
    filePath = path.resolve(idOrPath);
    // Containment check: block path traversal outside templates dir or CWD
    if (!filePath.startsWith(TEMPLATES_DIR + path.sep) && !filePath.startsWith(process.cwd() + path.sep)) {
      throw new Error(`Path traversal blocked: ${idOrPath} resolves outside allowed directories`);
    }
  } else {
    // Treat as template ID — look in templates dir
    filePath = path.join(TEMPLATES_DIR, `${idOrPath}.json`);
  }

  if (!fs.existsSync(filePath)) {
    throw new Error(`Template not found: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const template = JSON.parse(raw);
  return template;
}

/**
 * List all available templates from the templates/ directory
 */
function listTemplates() {
  if (!fs.existsSync(TEMPLATES_DIR)) return [];

  const files = fs.readdirSync(TEMPLATES_DIR)
    .filter(f => f.endsWith('.json') && !f.startsWith('_'));

  return files.map(f => {
    const filePath = path.join(TEMPLATES_DIR, f);
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const t = JSON.parse(raw);
      return {
        id: t.id || f.replace('.json', ''),
        name: t.name || f,
        version: t.version || 'unknown',
        difficulty: t.difficulty || 'unknown',
        stages: (t.stages || []).length,
        steps: (t.stages || []).reduce((sum, s) => sum + (s.steps || []).length, 0),
        tags: t.tags || [],
        estimatedDuration: t.estimatedDuration || 'unknown',
        file: f
      };
    } catch (e) {
      return { id: f.replace('.json', ''), name: f, error: e.message, file: f };
    }
  });
}

/**
 * Instantiate a template with user inputs — returns manifest-ready data
 */
function instantiateTemplate(template, inputs) {
  const errors = [];

  // Validate required inputs
  if (template.inputs && template.inputs.required) {
    for (const req of template.inputs.required) {
      if (inputs[req.key] === undefined || inputs[req.key] === null || inputs[req.key] === '') {
        errors.push(`Missing required input: "${req.key}" — ${req.prompt}`);
      }
    }
  }
  if (errors.length > 0) {
    throw new Error(`Input validation failed:\n  ${errors.join('\n  ')}`);
  }

  // Merge defaults for optional inputs
  const mergedInputs = { ...inputs };
  if (template.inputs && template.inputs.optional) {
    for (const opt of template.inputs.optional) {
      if (mergedInputs[opt.key] === undefined) {
        mergedInputs[opt.key] = opt.default;
      }
    }
  }

  // Build goal targets with defaults
  const goals = {};
  if (template.goal_targets) {
    for (const [key, config] of Object.entries(template.goal_targets)) {
      goals[key] = {
        target: mergedInputs[key] || config.default,
        current: 0,
        metric: config.metric,
        status: 'pending'
      };
    }
  }

  // Build steps map (keyed by ID) for manifest — matches manifest.cjs format
  const steps = {};
  for (const stage of template.stages) {
    for (const step of stage.steps) {
      steps[step.id] = {
        status: 'pending',
        stageId: stage.id,
        stageName: stage.name,
        name: step.name,
        strategy: step.strategy,
        ai_execution: step.ai_execution,
        human_decision: step.human_decision,
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

  // Build manifest structure
  const slug = template.id;
  const now = new Date().toISOString();

  return {
    slug,
    name: template.name,
    templateId: template.id,
    templateVersion: template.version,
    createdAt: now,
    updatedAt: now,
    status: 'active',
    currentStage: template.stages[0].id,
    currentStep: template.stages[0].steps[0].id,
    inputs: mergedInputs,
    goals,
    stages: template.stages.map(s => ({
      id: s.id,
      name: s.name,
      status: 'pending'
    })),
    steps,
    gates: template.gates || {},
    learnings: [],
    log: [{ ts: now, event: 'created', detail: `Instantiated from template ${template.id} v${template.version}` }]
  };
}

// CLI mode
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];

  if (!cmd || cmd === 'help') {
    console.log('Usage:');
    console.log('  node template-loader.cjs list                   — List available templates');
    console.log('  node template-loader.cjs load <id>              — Load and display a template');
    console.log('  node template-loader.cjs validate <id|path>     — Validate a template');
    process.exit(0);
  }

  if (cmd === 'list') {
    const templates = listTemplates();
    if (templates.length === 0) {
      console.log('No templates found.');
    } else {
      console.log(`Found ${templates.length} template(s):\n`);
      for (const t of templates) {
        if (t.error) {
          console.log(`  [!] ${t.file}: ${t.error}`);
        } else {
          console.log(`  ${t.id} (v${t.version}) — ${t.name}`);
          console.log(`      ${t.stages} stages, ${t.steps} steps | ${t.difficulty} | ${t.estimatedDuration}`);
          if (t.tags.length) console.log(`      tags: ${t.tags.join(', ')}`);
        }
      }
    }
    process.exit(0);
  }

  if (cmd === 'load') {
    const id = args[1];
    if (!id) { console.error('Usage: node template-loader.cjs load <id>'); process.exit(1); }
    try {
      const t = loadTemplate(id);
      console.log(JSON.stringify(t, null, 2));
    } catch (e) {
      console.error(`Error: ${e.message}`);
      process.exit(1);
    }
    process.exit(0);
  }

  if (cmd === 'validate') {
    const target = args[1];
    if (!target) { console.error('Usage: node template-loader.cjs validate <id|path>'); process.exit(1); }
    try {
      const t = loadTemplate(target);
      const result = validateTemplate(t);
      if (result.valid) {
        console.log(`VALID: "${t.name}" (${t.id} v${t.version})`);
      } else {
        console.log(`INVALID: ${result.errors.length} error(s):`);
        for (const e of result.errors) console.log(`  - ${e}`);
      }
      process.exit(result.valid ? 0 : 1);
    } catch (e) {
      console.error(`Error: ${e.message}`);
      process.exit(1);
    }
  }

  console.error(`Unknown command: ${cmd}`);
  process.exit(1);
}

module.exports = { loadTemplate, validateTemplate, listTemplates, instantiateTemplate };
