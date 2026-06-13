import { DesignSystemInput, ProviderFile } from "../types";
import { createManagedSkillBody } from "./shared";

export function renderCursorSkill(design: DesignSystemInput): ProviderFile {
  return {
    provider: "cursor",
    relativePath: ".cursor/skills/design-system/SKILL.md",
    content: createManagedSkillBody("Cursor", design)
  };
}
