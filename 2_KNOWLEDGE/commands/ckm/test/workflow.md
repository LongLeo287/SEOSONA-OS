---
description: Run workflow tests with step-by-step manual verification
argument-hint: "[workflow: youtube|content|email|brand|all]"
---

# Workflow Test Runner

Execute ClaudeKit workflow tests with manual verification at each step.

## Workflow Options

| Workflow | Steps | Description |
|----------|-------|-------------|
| `youtube` | 5 | YouTube → social, blog, infographic |
| `content` | 3 | Topic → blog → CRO → social |
| `email` | 2 | Flow type → sequence → copywriting |
| `brand` | 3 | Brand context → update → verify |
| `all` | 13 | Run all workflows |

## Execution Protocol

### Step 1: Scan Components

```bash
python3 .claude/skills/test-orchestrator/scripts/scan-components.py --json --scenarios
```

### Step 2: Load Workflow

Based on `$ARGUMENTS`, load the appropriate workflow from test-orchestrator skill.

### Step 3: For Each Step

1. **Display:**
   ```
   [STEP {n}/{total}] {step_name}
   ─────────────────────────────────────────
   Action: {action}
   Input: {input}
   Verify: {checklist}
   ```

2. **Execute actual command/skill/agent**
   - Use happy case prompts
   - Capture output

3. **Show output and ask:**
   - Use AskUserQuestion: Pass / Fail / Skip
   - Log result

4. **Continue or stop**

### Step 4: Report

```
═══════════════════════════════════════════
WORKFLOW TEST: {workflow}
═══════════════════════════════════════════
Pass: {n} | Fail: {n} | Skip: {n}

{details}
```

## Happy Case Prompts

| Key | Value |
|-----|-------|
| `youtube_url` | `https://www.youtube.com/watch?v=dQw4w9WgXcQ` |
| `blog_topic` | `10 productivity tips for remote workers` |
| `email_flow` | `welcome` |
| `brand_preset` | `ocean-professional` |

## Workflow Definitions

### youtube
| Step | Action | Input | Verify |
|------|--------|-------|--------|
| 1 | VidCap info | youtube_url | Returns title, duration |
| 2 | VidCap summary | youtube_url | Returns structured content |
| 3 | /youtube:social | youtube_url | Multi-platform posts |
| 4 | /youtube:blog | youtube_url | SEO article |
| 5 | /youtube:infographic | youtube_url | Visual layout |

### content
| Step | Action | Input | Verify |
|------|--------|-------|--------|
| 1 | /content:blog | blog_topic | Article with frontmatter |
| 2 | /content:cro | article | CRO optimization |
| 3 | /social | summary | Platform posts |

### email
| Step | Action | Input | Verify |
|------|--------|-------|--------|
| 1 | /email:flow | email_flow | 5-email sequence |
| 2 | copywriting skill | sequence | PAS/AIDA applied |

### brand
| Step | Action | Input | Verify |
|------|--------|-------|--------|
| 1 | inject-brand-context.cjs | - | Returns JSON |
| 2 | /brand:update | brand_preset | Tokens synced |
| 3 | Content generation | any | Brand voice applied |

## Skills Required

- `test-orchestrator`
- `debugging` (failure analysis)
