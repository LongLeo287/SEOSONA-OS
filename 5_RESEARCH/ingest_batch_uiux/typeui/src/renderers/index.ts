import { DesignSystemInput, PROVIDER_DETAILS, Provider, ProviderFile, SkillMetadata } from "../types";
import { createManagedSkillFile } from "./shared";

export function renderProviderFiles(
  design: DesignSystemInput,
  providers: Provider[],
  metadata: SkillMetadata
): ProviderFile[] {
  return providers.map((provider) => ({
    provider,
    relativePath: PROVIDER_DETAILS[provider].relativePath,
    content: createManagedSkillFile(PROVIDER_DETAILS[provider].title, design, metadata)
  }));
}
