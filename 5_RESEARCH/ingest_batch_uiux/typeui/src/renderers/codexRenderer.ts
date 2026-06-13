import { DesignSystemInput, ProviderFile } from "../types";
import { createManagedSkillBody } from "./shared";

export function renderCodexSkill(design: DesignSystemInput): ProviderFile {
  return {
    provider: "codex",
    relativePath: ".codex/skills/design-system/SKILL.md",
    content: createManagedSkillBody("Codex", design)
  };
}
