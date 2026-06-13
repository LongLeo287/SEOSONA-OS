import { DesignSystemInput, ProviderFile } from "../types";
import { createManagedSkillBody } from "./shared";

export function renderOpenCodeSkill(design: DesignSystemInput): ProviderFile {
  return {
    provider: "open-code",
    relativePath: ".opencode/skills/design-system/SKILL.md",
    content: createManagedSkillBody("Open Code", design)
  };
}
