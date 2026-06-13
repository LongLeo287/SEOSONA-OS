import { DesignSystemInput, Provider, SkillMetadata } from "../types";
import { upsertManagedSkillFile } from "../io/updateSkillFile";
import { renderProviderFiles } from "../renderers";

export interface GenerationOptions {
  projectRoot: string;
  providers: Provider[];
  designSystem: DesignSystemInput;
  metadata: SkillMetadata;
  dryRun?: boolean;
}

export interface GenerationResult {
  filePath: string;
  changed: boolean;
}

export async function runGeneration(options: GenerationOptions): Promise<GenerationResult[]> {
  const providerFiles = renderProviderFiles(options.designSystem, options.providers, options.metadata);
  const results: GenerationResult[] = [];

  for (const file of providerFiles) {
    const result = await upsertManagedSkillFile(
      options.projectRoot,
      file.relativePath,
      file.content,
      options.dryRun ?? false
    );
    results.push({
      filePath: result.absPath,
      changed: result.changed
    });
  }

  return results;
}
