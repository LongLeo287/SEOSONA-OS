import { SkillMetadataSchema } from "./domain/designSystemSchema";
import { SkillMetadata } from "./types";

export const SKILL_AUTHOR = "typeui.sh";

export function slugifySkillName(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "design-system";
}

export function buildDefaultSkillMetadata(productName: string): SkillMetadata {
  return SkillMetadataSchema.parse({
    name: slugifySkillName(productName),
    description: `${productName} style guide for AI coding agents.`
  });
}
