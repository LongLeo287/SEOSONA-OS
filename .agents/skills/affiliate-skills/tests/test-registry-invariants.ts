import { readdirSync, existsSync, readFileSync } from "fs";
import { join } from "path";

const root = process.cwd();
const skillsDir = join(root, "skills");
const registryPath = join(root, "registry.json");

function assert(name: string, condition: boolean, detail = "") {
  if (!condition) {
    console.error(`❌ ${name}${detail ? ` — ${detail}` : ""}`);
    process.exitCode = 1;
  } else {
    console.log(`✅ ${name}`);
  }
}

function getSkillFiles(): Array<{ stage: string; slug: string; path: string }> {
  const out: Array<{ stage: string; slug: string; path: string }> = [];
  for (const stage of readdirSync(skillsDir, { withFileTypes: true })) {
    if (!stage.isDirectory()) continue;
    const stageDir = join(skillsDir, stage.name);
    for (const skill of readdirSync(stageDir, { withFileTypes: true })) {
      if (!skill.isDirectory()) continue;
      const skillPath = join(stageDir, skill.name, "SKILL.md");
      if (existsSync(skillPath)) {
        out.push({
          stage: stage.name,
          slug: skill.name,
          path: `skills/${stage.name}/${skill.name}`,
        });
      }
    }
  }
  return out.sort((a, b) => a.path.localeCompare(b.path));
}

const registry = JSON.parse(readFileSync(registryPath, "utf8"));
const skillFiles = getSkillFiles();
const registrySkills: any[] = registry.skills || [];

console.log("=== Test 1: registry count matches skill files ===");
assert(
  "registry skill count matches filesystem",
  registrySkills.length === skillFiles.length,
  `registry=${registrySkills.length}, files=${skillFiles.length}`
);

console.log("\n=== Test 2: every skill file exists in registry ===");
for (const file of skillFiles) {
  const entry = registrySkills.find((s) => s.path === file.path);
  assert(`registry contains ${file.path}`, !!entry);
  if (!entry) continue;
  assert(`${file.path} stage matches`, entry.stage === file.stage, `registry=${entry.stage}`);
  assert(`${file.path} slug matches`, entry.slug === file.slug, `registry=${entry.slug}`);
  assert(`${file.path} name matches folder slug`, entry.name === file.slug, `registry=${entry.name}`);
}

console.log("\n=== Test 3: every registry entry points to real skill file ===");
for (const entry of registrySkills) {
  const skillMd = join(root, entry.path, "SKILL.md");
  assert(`${entry.path} exists on disk`, existsSync(skillMd), skillMd);
}

console.log("\n=== Test 4: every SKILL.md has frontmatter ===");
for (const file of skillFiles) {
  const content = readFileSync(join(root, file.path, "SKILL.md"), "utf8");
  assert(`${file.path}/SKILL.md starts with frontmatter`, content.startsWith("---\n") || content.startsWith("---\r\n"));
}

console.log("\n=== Test 5: registry stages exist in stage map ===");
const stageMap = registry.stages || {};
for (const file of skillFiles) {
  assert(`stage '${file.stage}' exists in registry.stages`, !!stageMap[file.stage]);
}

if (process.exitCode) {
  console.error("\n❌ Registry invariants failed");
  process.exit(process.exitCode);
}

console.log("\n✅ All registry invariants passed");
