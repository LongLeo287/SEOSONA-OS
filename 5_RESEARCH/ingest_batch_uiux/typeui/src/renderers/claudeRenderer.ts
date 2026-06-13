import { DesignSystemInput, ProviderFile } from "../types";
import { createManagedSkillBody } from "./shared";

export function renderClaudeSkill(design: DesignSystemInput): ProviderFile {
  return {
    provider: "claude-code",
    relativePath: ".claude/skills/design-system/SKILL.md",
    content: createManagedSkillBody("Claude Code", design)
  };
}
