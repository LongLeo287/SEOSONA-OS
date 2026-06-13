import { describe, expect, it } from "vitest";
import { renderProviderFiles } from "../src/renderers";
import { DesignSystemInput, SkillMetadata } from "../src/types";

const sampleDesign: DesignSystemInput = {
  productName: "typeui.sh",
  brandSummary: "A premium, developer-first interface language.",
  visualStyle: "minimal and modern",
  typographyScale: "12/14/16/20/24/32",
  colorPalette: "primary, neutral, semantic",
  spacingScale: "4/8/12/16/24/32",
  accessibilityRequirements: "WCAG 2.2 AA",
  writingTone: "clear and direct",
  doRules: ["use semantic tokens", "preserve hierarchy"],
  dontRules: ["use low contrast", "break spacing rhythm"]
};

const sampleMetadata: SkillMetadata = {
  name: "typeui-cli",
  description: "Guide for generating design-system skill files."
};

describe("renderProviderFiles", () => {
  it("renders paths for each selected provider", () => {
    const files = renderProviderFiles(sampleDesign, ["codex", "cursor", "claude-code", "open-code"], sampleMetadata);
    expect(files).toHaveLength(4);
    expect(files.map((f) => f.relativePath)).toEqual([
      ".codex/skills/design-system/SKILL.md",
      ".cursor/skills/design-system/SKILL.md",
      ".claude/skills/design-system/SKILL.md",
      ".opencode/skills/design-system/SKILL.md"
    ]);
    expect(files[0].content).toContain("---");
    expect(files[0].content).toContain('name: "typeui-cli"');
    expect(files[0].content).toContain('description: "Guide for generating design-system skill files."');
    expect(files[0].content).toContain("metadata:");
    expect(files[0].content).toContain("author: typeui.sh");
    expect(files[0].content).toContain("TYPEUI_SH_MANAGED_START");
    expect(files[0].content).toContain("typeui.sh");
  });
});
