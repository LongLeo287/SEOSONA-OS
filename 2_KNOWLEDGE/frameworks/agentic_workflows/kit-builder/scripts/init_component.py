#!/usr/bin/env python3
"""
Initialize ClaudeKit Marketing components: skill, agent, command, workflow.

Usage:
    python init_component.py <type> <name> [--path <output-dir>]

Examples:
    python init_component.py skill email-automation
    python init_component.py agent content-optimizer
    python init_component.py command content:optimize
    python init_component.py workflow content-pipeline
"""

import argparse
import os
import sys
from pathlib import Path
from datetime import datetime


def get_project_root():
    """Find project root by looking for .claude directory."""
    current = Path(__file__).resolve()
    for parent in current.parents:
        if (parent / '.claude').exists():
            return parent
    return Path.cwd()


def create_skill(name: str, output_dir: Path):
    """Create skill folder structure."""
    skill_dir = output_dir / name
    skill_dir.mkdir(parents=True, exist_ok=True)

    # Create SKILL.md
    skill_md = f'''---
name: {name}
description: {{DESCRIPTION - When Claude should use this skill}}
license: MIT
---

# {name.replace("-", " ").title()}

{{One-line purpose}}

## When to Use

- {{Trigger 1}}
- {{Trigger 2}}

## Quick Reference

| Pattern | Use Case |
|---------|----------|
| {{Pattern}} | {{When}} |

## References

| Topic | File |
|-------|------|
| Guide | `references/guide.md` |

## Agent Integration

**Primary Agent:** {{agent-name}}

**Related Skills:** {{skills}}
'''
    (skill_dir / 'SKILL.md').write_text(skill_md)

    # Create subdirectories
    (skill_dir / 'references').mkdir(exist_ok=True)
    (skill_dir / 'scripts').mkdir(exist_ok=True)

    # Create example reference
    (skill_dir / 'references' / 'guide.md').write_text(
        f'# {name.replace("-", " ").title()} Guide\n\n'
        '## Overview\n\n{{Add detailed patterns and workflows here}}\n'
    )

    print(f"Created skill: {skill_dir}")
    return skill_dir


def create_agent(name: str, output_dir: Path):
    """Create agent markdown file."""
    agent_file = output_dir / f'{name}.md'

    content = f'''---
name: {name}
description: Use this agent when {{trigger condition}}. Examples:\\n\\n<example>\\nContext: {{situation}}\\nuser: "{{user message}}"\\nassistant: "{{response}}"\\n<commentary>{{Why}}</commentary>\\n</example>
model: sonnet
---

You are a {{expertise}} specialist.

**IMPORTANT**: Analyze the skills catalog and activate the skills that are needed for the task during the process.

## Your Expertise

- {{Expertise 1}}
- {{Expertise 2}}

## Your Process

1. {{Step 1}}
2. {{Step 2}}
3. {{Step 3}}

## Output Format

{{What to deliver}}

## Asset Output

When saving files:
- {{Type}} → `assets/{{category}}/{{pattern}}.md`
'''
    agent_file.write_text(content)
    print(f"Created agent: {agent_file}")
    return agent_file


def create_command(name: str, output_dir: Path):
    """Create command markdown file."""
    # Handle nested commands (e.g., content:blog -> content/blog.md)
    if ':' in name:
        parts = name.split(':')
        cmd_dir = output_dir / parts[0]
        cmd_dir.mkdir(parents=True, exist_ok=True)
        cmd_file = cmd_dir / f'{parts[1]}.md'
    else:
        cmd_file = output_dir / f'{name}.md'

    content = f'''---
description: {{Short description}}
argument-hint: {{[args]}}
---

💡💡
Activate `{{skill}}` skill.

## Arguments
- $ARG = {{description}}

## Mission
{{What this command accomplishes}}

## Workflow

1. **Analyze** - {{Step}}
2. **Execute** - {{Step}}
3. **Output** - {{Step}}

## Output Requirements

- Format: {{Format}}
- Location: {{Path}}
'''
    cmd_file.write_text(content)
    print(f"Created command: {cmd_file}")
    return cmd_file


def create_workflow(name: str, output_dir: Path):
    """Create workflow markdown file."""
    workflow_file = output_dir / f'{name}.md'

    content = f'''# {name.replace("-", " ").title()}

## Purpose

{{What this workflow accomplishes}}

## Triggers

- {{When to use}}

## Agents Involved

| Agent | Role |
|-------|------|
| {{agent}} | {{role}} |

## Process

### Phase 1: {{Name}}

1. {{Step 1}}
2. {{Step 2}}

### Phase 2: {{Name}}

1. {{Step 1}}
2. {{Step 2}}

## Quality Gates

- [ ] {{Checkpoint}}

## Outputs

| Deliverable | Location |
|-------------|----------|
| {{Output}} | `{{path}}` |
'''
    workflow_file.write_text(content)
    print(f"Created workflow: {workflow_file}")
    return workflow_file


def main():
    parser = argparse.ArgumentParser(
        description='Initialize ClaudeKit Marketing components'
    )
    parser.add_argument(
        'type',
        choices=['skill', 'agent', 'command', 'workflow'],
        help='Component type to create'
    )
    parser.add_argument('name', help='Component name (lowercase-hyphenated)')
    parser.add_argument(
        '--path',
        help='Output directory (default: project .claude directory)'
    )

    args = parser.parse_args()

    # Determine output directory
    project_root = get_project_root()
    claude_dir = project_root / '.claude'

    type_dirs = {
        'skill': claude_dir / 'skills',
        'agent': claude_dir / 'agents',
        'command': claude_dir / 'commands',
        'workflow': claude_dir / 'workflows'
    }

    output_dir = Path(args.path) if args.path else type_dirs[args.type]
    output_dir.mkdir(parents=True, exist_ok=True)

    # Create component
    creators = {
        'skill': create_skill,
        'agent': create_agent,
        'command': create_command,
        'workflow': create_workflow
    }

    created = creators[args.type](args.name, output_dir)
    print(f"\nNext steps:")
    print(f"1. Edit the generated file(s)")
    print(f"2. Fill in {{placeholders}} with actual content")
    print(f"3. Test the component")


if __name__ == '__main__':
    main()
