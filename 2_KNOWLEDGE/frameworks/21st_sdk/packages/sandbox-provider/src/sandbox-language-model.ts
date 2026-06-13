import type {
  LanguageModelV2,
  LanguageModelV2CallOptions,
  LanguageModelV2StreamPart,
  LanguageModelV2Prompt,
  LanguageModelV2FinishReason,
  LanguageModelV2Usage,
} from '@ai-sdk/provider';
import type { SandboxConfig, SandboxProviderOptions } from './types';
import { createStreamTransformer } from './sandbox-stream-transformer';
import { fetch as undiciFetch, Agent } from 'undici';

export class SandboxLanguageModel implements LanguageModelV2 {
  readonly specificationVersion = 'v2' as const;
  readonly modelId: string;
  readonly provider: string;
  readonly supportedUrls: Record<string, RegExp[]> = {};

  constructor(
    modelId: string,
    private config: SandboxConfig
  ) {
    this.modelId = modelId;
    this.provider = config.provider;
  }

  async doStream(
    options: LanguageModelV2CallOptions
  ): Promise<{
    stream: ReadableStream<LanguageModelV2StreamPart>;
    request?: { body?: unknown };
    response?: { headers?: Record<string, string> };
  }> {
    const sessionId = this.extractSessionId(options);
    const message = this.extractLastUserMessage(options.prompt);

    // Extract images from providerOptions
    const providerOpts = options.providerOptions?.sandbox as
      | SandboxProviderOptions
      | undefined;
    const images = providerOpts?.images;

    const endpoint = sessionId
      ? `${this.config.sandboxBaseURL}/sessions/${sessionId}/messages`
      : `${this.config.sandboxBaseURL}/sessions`;

    const fetchFn = this.config.fetch ?? fetch;
    console.log(`[sandbox-provider] POST ${endpoint}, sessionId=${sessionId ?? 'new'}`);
    const postT0 = Date.now();
    const postResponse = await fetchFn(endpoint, {
      method: 'POST',
      headers: this.config.headers(),
      body: JSON.stringify({ message, images }),
      signal: options.abortSignal,
    });

    if (!postResponse.ok) {
      const errorText = await postResponse.text();
      console.error(`[sandbox-provider] POST error: ${postResponse.status} - ${errorText}, elapsed=${Date.now() - postT0}ms`);
      throw new Error(`Sandbox API error: ${postResponse.status} - ${errorText}`);
    }

    const postData = await postResponse.json();
    const { streamId } = postData;
    console.log(`[sandbox-provider] POST OK, streamId=${streamId}, elapsed=${Date.now() - postT0}ms`);

    const sseUrl = `${this.config.relayBaseURL}/stream/${streamId}`;
    console.log(`[sandbox-provider] Connecting SSE: ${sseUrl}`);
    // Use undici fetch directly (not global fetch) so dispatcher option is respected.
    // Next.js patches global fetch and silently ignores the dispatcher option.
    const sseAgent = new Agent({ bodyTimeout: 0, headersTimeout: 0 });
    const sseResponse = await undiciFetch(sseUrl, {
      headers: { Accept: 'text/event-stream' },
      signal: options.abortSignal,
      dispatcher: sseAgent,
    });

    if (!sseResponse.ok || !sseResponse.body) {
      const errorText = await sseResponse.text().catch(() => 'No body');
      console.error(`[sandbox-provider] SSE error: ${sseResponse.status} - ${errorText}`);
      throw new Error(`Relay SSE error: ${sseResponse.status} - ${errorText}`);
    }
    console.log(`[sandbox-provider] SSE connected, totalSetup=${Date.now() - postT0}ms`);

    // Cast undici's ReadableStream to global ReadableStream (compatible at runtime)
    const sseBody = sseResponse.body as unknown as ReadableStream<Uint8Array>;
    const stream = sseBody.pipeThrough(
      createStreamTransformer(this.config.generateId)
    );

    // Convert undici Headers to plain record
    const headers: Record<string, string> = {};
    sseResponse.headers.forEach((value, key) => {
      headers[key] = value;
    });

    return {
      stream,
      request: { body: { message, sessionId } },
      response: { headers },
    };
  }

  async doGenerate(
    options: LanguageModelV2CallOptions
  ): Promise<{
    content: Array<{ type: 'text'; text: string }>;
    finishReason: LanguageModelV2FinishReason;
    usage: LanguageModelV2Usage;
    request?: { body?: unknown };
    response?: { headers?: Record<string, string>; body?: unknown };
    warnings: Array<{ type: 'other'; message: string }>;
  }> {
    const { stream, request, response } = await this.doStream(options);

    let text = '';
    let finishReason: LanguageModelV2FinishReason = 'unknown';
    let usage: LanguageModelV2Usage = {
      inputTokens: undefined,
      outputTokens: undefined,
      totalTokens: undefined,
    };

    const reader = stream.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        switch (value.type) {
          case 'text-delta':
            text += value.delta;
            break;
          case 'finish':
            finishReason = value.finishReason;
            usage = value.usage;
            break;
        }
      }
    } finally {
      reader.releaseLock();
    }

    return {
      content: [{ type: 'text', text }],
      finishReason,
      usage,
      request,
      response,
      warnings: [],
    };
  }

  private extractSessionId(
    options: LanguageModelV2CallOptions
  ): string | undefined {
    // 1. Check direct providerOptions passed to streamText()
    const providerOpts = options.providerOptions?.sandbox as
      | SandboxProviderOptions
      | undefined;
    if (providerOpts?.sessionId) {
      return providerOpts.sessionId;
    }

    // 2. Search in assistant messages for sessionId
    // Note: convertToModelMessages transforms providerMetadata -> providerOptions
    // So we need to check both for compatibility
    for (let i = options.prompt.length - 1; i >= 0; i--) {
      const msg = options.prompt[i];
      if (msg.role === 'assistant') {
        // Check content parts for providerOptions (from convertToModelMessages)
        const content = (msg as { content?: Array<{ providerOptions?: { sandbox?: { sessionId?: string } } }> }).content;
        if (Array.isArray(content)) {
          for (const part of content) {
            if (part.providerOptions?.sandbox?.sessionId) {
              return part.providerOptions.sandbox.sessionId;
            }
          }
        }
      }
    }

    return undefined;
  }

  private extractLastUserMessage(prompt: LanguageModelV2Prompt): string {
    for (let i = prompt.length - 1; i >= 0; i--) {
      const msg = prompt[i];
      if (msg.role === 'user') {
        return msg.content
          .filter((part): part is { type: 'text'; text: string } =>
            part.type === 'text'
          )
          .map((part) => part.text)
          .join('\n');
      }
    }
    throw new Error('No user message found in prompt');
  }

  private headersToRecord(headers: Headers): Record<string, string> {
    const result: Record<string, string> = {};
    headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
}
