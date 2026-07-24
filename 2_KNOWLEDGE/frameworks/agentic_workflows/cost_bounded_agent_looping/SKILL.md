---

name: cost-bounded-agent-looping
version: 1.0.0
description: "Control costs in autonomous agent loops by enforcing ceilings on iterations, spending, and time."
  Enforce cost, iteration, and time ceilings on agent loops to prevent
  runaway token spending. Provides a cost_tracker.js module for tracking
  token usage per-iteration, detecting diminishing returns, and generating
  session reports. Integrates with SEOSONA CLI via `seosona cost`.
license: MIT
compatibility: claude-code opencode antigravity
allowed-tools:
  - Read
  - Exec
  - Grep
---

# Cost-Bounded Agent Looping

Control costs in autonomous agent loops by enforcing ceilings on iterations, spending, and time.

## Quick Start

```javascript
const ct = require('~/.seosona/1_CORE/scripts/cost_tracker');

// Create tracker with preset
const tracker = ct.createTracker({ taskType: 'standard' });

// In your agent loop:
while (ct.shouldContinue(tracker)) {
    const result = doWork();
    const iterResult = ct.recordIteration(tracker, {
        input: result.inputTokens,
        output: result.outputTokens
    }, result.qualityScore);

    if (iterResult.stopped) {
        console.log(`Loop stopped: ${iterResult.reason}`);
        break;
    }
    if (iterResult.warnings.length) {
        console.warn(iterResult.warnings.join('; '));
    }
}

// Save session and get report
const report = ct.saveSession(tracker);
console.log(`Total: $${report.totalCost} over ${report.iterations} iterations`);
```

## CLI Commands

```bash
seosona cost estimate "Refactor the authentication module"
seosona cost report
seosona cost models
seosona cost ceilings
```

## Loop Design Rules

### Rule 1: Always Set max_iterations
Never allow unbounded loops. Even "unlimited" preset caps at 100 iterations.

### Rule 2: Track Cumulative Cost
Not just per-iteration — total cumulative cost matters. The tracker enforces a `costCeiling` in USD.

### Rule 3: Implement Exponential Backoff
On retries, increase wait time. Don't hammer the API with rapid retry loops.

### Rule 4: Log Every Iteration
The tracker records every iteration's tokens, cost, and timestamp for post-mortem analysis. Sessions are saved to `~/.seosona/3_MEMORY/logs/cost_tracker_sessions.jsonl`.

### Rule 5: Exit Early on Diminishing Returns
If `qualityScore` plateaus across 3 consecutive iterations (delta < threshold), the loop stops automatically.

## Ceiling Presets

| Type | Max Iters | Ceiling | Timeout | Use Case |
|---|---|---|---|---|
| `quick` | 3 | $0.10 | 60s | Simple fixes, formatting |
| `standard` | 10 | $1.00 | 5min | Normal development |
| `deep` | 25 | $5.00 | 10min | Complex refactoring |
| `research` | 50 | $10.00 | 30min | UAP triage, analysis |
| `unlimited` | 100 | $50.00 | 60min | Full audit, overnight |

## Decision Tree: Choosing a Ceiling

```
Is this a one-shot task?
├── Yes → 'quick' (3 iters, $0.10)
└── No → Does it involve multiple files?
    ├── No → 'standard' (10 iters, $1.00)
    └── Yes → Is it exploratory/research?
        ├── No → 'deep' (25 iters, $5.00)
        └── Yes → 'research' (50 iters, $10.00)
```

## Model Pricing

The tracker embeds current pricing for 15+ models:
- **Anthropic**: Claude Sonnet 4, Opus 4, Haiku
- **Google**: Gemini 2.5 Pro/Flash, 2.0 Flash
- **OpenAI**: GPT-4o, 4.1, o3, o4-mini

## Integration Points

- **Module**: `~/.seosona/1_CORE/scripts/cost_tracker.js`
- **CLI**: `seosona cost estimate|report|models|ceilings`
- **Session logs**: `~/.seosona/3_MEMORY/logs/cost_tracker_sessions.jsonl`
- **SOP**: `~/.seosona/2_KNOWLEDGE/sops/agent_loop_design_sop.md`
