# KI: nagisanzenin/claude-code-production-grade-plugin

## Overview
Repository with 80 files across 32 directories. Primary language: Shell (2 files).

## Tech Stack (from code)
- Shell (2 files)
- **Total:** 80 files, 32 directories
- **File types:** .md: 72, .json: 3, .sh: 2, .gitignore: 1, .png: 1, .tmpl: 1

## File Structure
```
  .gitignore
  CHANGELOG.md
  DEV_PROTOCOL.md
  README.md
  VISION.md
  .claude-plugin/
    plugin.json
  assets/
    banner.png
  docs/
    LOOPS.md
    PUBLISHING.md
  hooks/
    hooks.json
    oracle-gate.sh
    session-guard.sh
  skills/
    _shared/
      protocols/
        boundary-safety.md
        conflict-resolution.md
        freshness-protocol.md
        input-validation.md
        loop-protocol.md
        receipt-protocol.md
        tool-efficiency.md
        ux-protocol.md
        visual-identity.md
      templates/
        production-grade.yaml.tmpl
    code-reviewer/
      SKILL.md
    data-scientist/
      SKILL.md
      phases/
        01-system-audit.md
        02-llm-optimization.md
        03-experiment-framework.md
        04-data-pipeline.md
        05-ml-infrastructure.md
        06-cost-modeling.md
    devops/
      SKILL.md
    frontend-engineer/
      SKILL.md
      phases/
        01-analysis.md
        02-design-system.md
        03-components.md
        04-pages-routes.md
        05-design-polish.md
        06-testing-a11y.md
    polymath/
      SKILL.md
      modes/
        advise.md
        ideate.md
        onboard.md
        research.md
        synthesize.md
        translate.md
    product-manager/
      SKILL.md
    production-grade/
      SKILL.md
      hooks/
        activation-rules.json
      phases/
        build.md
        define.md
        harden.md
        ship.md
        sustain.md
    qa-engineer/
      SKILL.md
    security-engineer/
      SKILL.md
      phases/
        01-threat-modeling.md
        02-code-audit.md
        03-auth-review.md
        04-data-security.md
        05-supply-chain.md
        06-remediation.md
    skill-maker/
      SKILL.md
    software-engineer/
      SKILL.md
      phases/
        01-context-analysis.md
        02-service-implementation.md
        03-cross-cutting.md
        04-integration.md
        05-local-dev.md
    solution-architect/
      SKILL.md
    sre/
      SKILL.md
      phases
```

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `skill` · **Fit:** 82/100 · **Auto-apply:** False
- **Evidence:** `skill.md`, `plugin`
- **All scores:** {'seosona-os': 82, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 28}
