import type { ProviderV2 } from '@ai-sdk/provider';
import { NoSuchModelError } from '@ai-sdk/provider';
import { generateId, withoutTrailingSlash } from '@ai-sdk/provider-utils';
import { SandboxLanguageModel } from './sandbox-language-model';
import type { SandboxProviderSettings } from './types';

export interface SandboxProvider extends ProviderV2 {
  (modelId: string): SandboxLanguageModel;
  languageModel(modelId: string): SandboxLanguageModel;
}

export function createSandbox(
  options: SandboxProviderSettings
): SandboxProvider {
  const sandboxBaseURL = withoutTrailingSlash(options.sandboxBaseURL) as string;
  const relayBaseURL = withoutTrailingSlash(options.relayBaseURL) as string;

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    ...options.headers,
  });

  const createLanguageModel = (modelId: string) =>
    new SandboxLanguageModel(modelId, {
      provider: 'sandbox',
      sandboxBaseURL,
      relayBaseURL,
      headers: getHeaders,
      fetch: options.fetch,
      generateId,
    });

  const provider = function (modelId: string) {
    if (new.target) {
      throw new Error('Cannot be called with new keyword');
    }
    return createLanguageModel(modelId);
  } as SandboxProvider;

  provider.languageModel = createLanguageModel;

  provider.textEmbeddingModel = (modelId: string) => {
    throw new NoSuchModelError({ modelId, modelType: 'textEmbeddingModel' });
  };

  return provider;
}
