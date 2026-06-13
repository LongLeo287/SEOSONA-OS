import { describe, expect, it } from "vitest";
import { buildDefaultSkillMetadata } from "../src/skillMetadata";

describe("buildDefaultSkillMetadata", () => {
  it("builds a slug name and short generated style description", () => {
    expect(buildDefaultSkillMetadata("TypeUI Pro")).toEqual({
      name: "typeui-pro",
      description: "TypeUI Pro style guide for AI coding agents."
    });
  });
});
