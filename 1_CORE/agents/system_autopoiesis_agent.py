import os
import sys
import json
import time

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

class SystemAutopoiesisAgent:
    """
    The "Self-Evolution" Agent.
    Monitors 3_MEMORY/errors/ for recurring errors that were resolved.
    If a pattern is found, it automatically generates a new SKILL.md to permanently
    vaccinate the system against that error.
    """
    def __init__(self):
        self.memory_dir = os.path.join(os.path.dirname(__file__), "..", "..", "3_MEMORY", "errors")
        self.knowledge_dir = os.path.join(os.path.dirname(__file__), "..", "..", "2_KNOWLEDGE", "frameworks", "core_system")
        
    def scan_for_evolution_triggers(self):
        """Scans the fix loop logs to see what the system learned recently."""
        log_file = os.path.join(self.memory_dir, "fix_loop_log.json")
        if not os.path.exists(log_file):
            print("📭 [Autopoiesis] No error logs found to learn from.")
            return

        with open(log_file, "r", encoding="utf-8") as f:
            try:
                logs = json.load(f)
            except json.JSONDecodeError:
                logs = []

        # Find resolved errors that took more than 2 attempts (means it was a hard lesson)
        hard_lessons = [log for log in logs if log.get("success") and log.get("total_attempts", 0) > 2]
        
        if hard_lessons:
            print(f"🧠 [Autopoiesis] Detected {len(hard_lessons)} hard lessons. Generating new Skill to vaccinate system...")
            self._generate_vaccine_skill(hard_lessons[0])
        else:
            print("💤 [Autopoiesis] No critical evolution triggers found. Sleeping.")

    def _generate_vaccine_skill(self, lesson: dict):
        """Writes a new SKILL.md file based on the lesson."""
        connector_name = lesson.get("connector", "unknown_connector")
        skill_name = f"auto_vaccine_{connector_name}"
        
        skill_dir = os.path.join(self.knowledge_dir, skill_name)
        os.makedirs(skill_dir, exist_ok=True)
        
        skill_path = os.path.join(skill_dir, "SKILL.md")
        
        content = f"""---
name: "{skill_name}"
description: "Autonomously generated vaccine skill to prevent {connector_name} errors."
keywords: ["vaccine", "autopoiesis", "error-prevention"]
---

# 🛡️ Auto-Vaccine: {connector_name}

This skill was generated autonomously by the System Autopoiesis Agent.
It detects that `{connector_name}` previously required multiple fix loops to resolve.

## Prevention Strategy
1. **Always Check Rate Limits**: Ensure sleep delays are respected before calling {connector_name}.
2. **Validate Input Format**: The most common cause of multi-attempt failures is malformed input.

*Generated at: {time.strftime('%Y-%m-%dT%H:%M:%SZ')}*
"""
        with open(skill_path, "w", encoding="utf-8") as f:
            f.write(content)
            
        print(f"🧬 [Autopoiesis] Evolution complete. New skill written to: {skill_path}")
        print("🔧 Remember to run `knowledge_graph.py --build` to wire this into the Omni-Brain.")

if __name__ == "__main__":
    agent = SystemAutopoiesisAgent()
    agent.scan_for_evolution_triggers()
