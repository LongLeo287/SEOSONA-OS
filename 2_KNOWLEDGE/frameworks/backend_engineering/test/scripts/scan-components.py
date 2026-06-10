#!/usr/bin/env python3
"""
Scan ClaudeKit components and generate test scenarios.
Outputs JSON with all testable commands, agents, skills, and workflows.
"""

import os
import json
import re
from pathlib import Path
from typing import Dict, List, Any

# Base path - adjust if running from different location
BASE_PATH = Path(__file__).parent.parent.parent.parent.parent

def extract_frontmatter(content: str) -> Dict[str, str]:
    """Extract YAML frontmatter from markdown file."""
    if not content.startswith('---'):
        return {}

    parts = content.split('---', 2)
    if len(parts) < 3:
        return {}

    frontmatter = {}
    for line in parts[1].strip().split('\n'):
        if ':' in line:
            key, value = line.split(':', 1)
            frontmatter[key.strip()] = value.strip().strip('"\'')

    return frontmatter

def scan_commands() -> List[Dict[str, Any]]:
    """Scan all commands in .opencode/commands/"""
    commands = []
    cmd_path = BASE_PATH / '.claude' / 'commands'

    if not cmd_path.exists():
        return commands

    for md_file in cmd_path.rglob('*.md'):
        try:
            content = md_file.read_text()
            fm = extract_frontmatter(content)

            # Build command path (e.g., /youtube:social)
            rel_path = md_file.relative_to(cmd_path)
            parts = list(rel_path.parts)

            if len(parts) == 1:
                # Root command like social.md -> /social
                cmd_name = f"/{parts[0].replace('.md', '')}"
            else:
                # Nested like youtube/social.md -> /youtube:social
                folder = parts[0]
                name = parts[-1].replace('.md', '')
                cmd_name = f"/{folder}:{name}"

            commands.append({
                'name': cmd_name,
                'path': str(md_file.relative_to(BASE_PATH)),
                'description': fm.get('description', ''),
                'argument_hint': fm.get('argument-hint', ''),
                'testable': True
            })
        except Exception as e:
            print(f"Error scanning {md_file}: {e}")

    return sorted(commands, key=lambda x: x['name'])

def scan_agents() -> List[Dict[str, Any]]:
    """Scan all agents in .opencode/agents/"""
    agents = []
    agent_path = BASE_PATH / '.claude' / 'agents'

    if not agent_path.exists():
        return agents

    for md_file in agent_path.glob('*.md'):
        try:
            content = md_file.read_text()
            fm = extract_frontmatter(content)

            agents.append({
                'name': md_file.stem,
                'path': str(md_file.relative_to(BASE_PATH)),
                'description': fm.get('description', ''),
                'model': fm.get('model', 'sonnet'),
                'testable': True
            })
        except Exception as e:
            print(f"Error scanning {md_file}: {e}")

    return sorted(agents, key=lambda x: x['name'])

def scan_skills() -> List[Dict[str, Any]]:
    """Scan all skills in .opencode/skills/"""
    skills = []
    skill_path = BASE_PATH / '.claude' / 'skills'

    if not skill_path.exists():
        return skills

    for skill_dir in skill_path.iterdir():
        if not skill_dir.is_dir():
            continue

        skill_file = skill_dir / 'SKILL.md'
        if not skill_file.exists():
            continue

        try:
            content = skill_file.read_text()
            fm = extract_frontmatter(content)

            # Check for scripts
            scripts_dir = skill_dir / 'scripts'
            has_scripts = scripts_dir.exists() and any(scripts_dir.iterdir())

            # Check for references
            refs_dir = skill_dir / 'references'
            has_refs = refs_dir.exists() and any(refs_dir.iterdir())

            skills.append({
                'name': fm.get('name', skill_dir.name),
                'path': str(skill_dir.relative_to(BASE_PATH)),
                'description': fm.get('description', ''),
                'has_scripts': has_scripts,
                'has_references': has_refs,
                'testable': has_scripts  # Only testable if has executable scripts
            })
        except Exception as e:
            print(f"Error scanning {skill_dir}: {e}")

    return sorted(skills, key=lambda x: x['name'])

def scan_workflows() -> List[Dict[str, Any]]:
    """Scan all workflows in .opencode/workflows/"""
    workflows = []
    wf_path = BASE_PATH / '.claude' / 'workflows'

    if not wf_path.exists():
        return workflows

    for md_file in wf_path.glob('*.md'):
        try:
            content = md_file.read_text()
            fm = extract_frontmatter(content)

            workflows.append({
                'name': md_file.stem,
                'path': str(md_file.relative_to(BASE_PATH)),
                'description': fm.get('description', ''),
                'testable': False  # Workflows are documentation, not directly testable
            })
        except Exception as e:
            print(f"Error scanning {md_file}: {e}")

    return sorted(workflows, key=lambda x: x['name'])

def generate_test_scenarios(commands: List, skills: List) -> List[Dict[str, Any]]:
    """Generate test scenarios based on scanned components."""
    scenarios = []

    # Happy case prompts
    happy_cases = {
        'youtube_url': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'blog_topic': '10 productivity tips for remote workers',
        'email_flow': 'welcome',
        'brand_preset': 'ocean-professional',
        'social_platform': 'twitter',
        'writing_style': 'casual'
    }

    # Generate scenarios for key commands
    for cmd in commands:
        name = cmd['name']

        if 'youtube' in name:
            scenarios.append({
                'name': f"Test {name}",
                'type': 'command',
                'steps': [
                    {
                        'action': name,
                        'input': happy_cases['youtube_url'],
                        'verify': ['Output generated', 'No errors', 'Format correct']
                    }
                ]
            })
        elif 'content' in name or 'blog' in name:
            scenarios.append({
                'name': f"Test {name}",
                'type': 'command',
                'steps': [
                    {
                        'action': name,
                        'input': happy_cases['blog_topic'],
                        'verify': ['Content generated', 'SEO metadata present']
                    }
                ]
            })
        elif 'email' in name:
            scenarios.append({
                'name': f"Test {name}",
                'type': 'command',
                'steps': [
                    {
                        'action': name,
                        'input': happy_cases['email_flow'],
                        'verify': ['Sequence generated', 'Timing defined']
                    }
                ]
            })
        elif 'social' in name:
            scenarios.append({
                'name': f"Test {name}",
                'type': 'command',
                'steps': [
                    {
                        'action': name,
                        'input': happy_cases['social_platform'],
                        'verify': ['Posts generated', 'Platform format correct']
                    }
                ]
            })

    return scenarios

def main():
    """Main entry point."""
    import argparse

    parser = argparse.ArgumentParser(description='Scan ClaudeKit components')
    parser.add_argument('--json', action='store_true', help='Output as JSON')
    parser.add_argument('--scenarios', action='store_true', help='Generate test scenarios')
    parser.add_argument('--type', choices=['commands', 'agents', 'skills', 'workflows', 'all'],
                       default='all', help='Component type to scan')
    args = parser.parse_args()

    result = {}

    if args.type in ['commands', 'all']:
        result['commands'] = scan_commands()
    if args.type in ['agents', 'all']:
        result['agents'] = scan_agents()
    if args.type in ['skills', 'all']:
        result['skills'] = scan_skills()
    if args.type in ['workflows', 'all']:
        result['workflows'] = scan_workflows()

    if args.scenarios:
        result['scenarios'] = generate_test_scenarios(
            result.get('commands', []),
            result.get('skills', [])
        )

    if args.json:
        print(json.dumps(result, indent=2))
    else:
        # Summary output
        print("=" * 60)
        print("ClaudeKit Component Scan")
        print("=" * 60)

        for comp_type, items in result.items():
            if comp_type == 'scenarios':
                continue
            testable = sum(1 for i in items if i.get('testable', False))
            print(f"\n{comp_type.upper()}: {len(items)} total, {testable} testable")
            for item in items[:10]:  # Show first 10
                status = "✓" if item.get('testable') else "○"
                print(f"  {status} {item['name']}")
            if len(items) > 10:
                print(f"  ... and {len(items) - 10} more")

        if args.scenarios and 'scenarios' in result:
            print(f"\nTEST SCENARIOS: {len(result['scenarios'])} generated")

if __name__ == '__main__':
    main()
