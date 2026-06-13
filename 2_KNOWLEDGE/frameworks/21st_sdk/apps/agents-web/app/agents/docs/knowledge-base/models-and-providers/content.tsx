import { CopyMarkdownButton } from "@/components/features/agents/an/docs/copy-markdown-button"
import { AgentsLink as Link } from "@/components/agents-link"

const MODELS = [
  {
    provider: "Anthropic",
    models: [
      { name: "Claude Opus 4.6", id: "anthropic/claude-opus-4-6", context: "200K", strengths: "Top-tier reasoning, complex multi-step tasks, code generation" },
      { name: "Claude Sonnet 4.6", id: "anthropic/claude-sonnet-4-6", context: "200K", strengths: "Best balance of speed, cost, and intelligence" },
      { name: "Claude Haiku 4.5", id: "anthropic/claude-haiku-4-5-20251001", context: "200K", strengths: "Fastest and cheapest, great for simple tasks" },
    ],
  },
  {
    provider: "Google",
    models: [
      { name: "Gemini 3.1 Pro", id: "google/gemini-3.1-pro", context: "1M", strengths: "Highest benchmark scores, massive context window" },
      { name: "Gemini 3.0 Flash", id: "google/gemini-3.0-flash", context: "1M", strengths: "Fast and affordable with million-token context" },
    ],
  },
  {
    provider: "DeepSeek",
    models: [
      { name: "DeepSeek V3.2", id: "deepseek/deepseek-v3.2", context: "128K", strengths: "Near-frontier performance at 10x lower cost, strong reasoning" },
      { name: "DeepSeek R1", id: "deepseek/deepseek-r1", context: "128K", strengths: "Advanced chain-of-thought reasoning" },
    ],
  },
  {
    provider: "Meta",
    models: [
      { name: "Llama 4 Maverick", id: "meta-llama/llama-4-maverick", context: "256K", strengths: "Open-weight, strong coding and multilingual" },
      { name: "Llama 4 Scout", id: "meta-llama/llama-4-scout", context: "10M", strengths: "Largest context window available, open-weight" },
    ],
  },
  {
    provider: "Alibaba",
    models: [
      { name: "Qwen 3.5 Max", id: "qwen/qwen-3.5-max", context: "128K", strengths: "119 languages, competitive with frontier models" },
      { name: "Qwen 3.5 Coder", id: "qwen/qwen-3.5-coder", context: "128K", strengths: "Optimized for code generation and analysis" },
    ],
  },
  {
    provider: "Zhipu AI",
    models: [
      { name: "GLM-5", id: "zhipu/glm-5", context: "128K", strengths: "Top open-weight model, strong agentic and SWE tasks" },
      { name: "GLM-4.7 Flash", id: "zhipu/glm-4.7-flash", context: "128K", strengths: "Lightweight MoE, efficient for local coding tasks" },
    ],
  },
  {
    provider: "OpenAI",
    models: [
      { name: "GPT-5.4", id: "openai/gpt-5.4", context: "128K", strengths: "Frontier reasoning and analysis" },
      { name: "GPT-5.2 Codex", id: "openai/gpt-5.2-codex", context: "128K", strengths: "Optimized for code, multiple reasoning levels" },
    ],
  },
]

export default function ModelsAndProvidersContent() {
  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            Models &amp; Providers
          </h1>
          <CopyMarkdownButton />
        </div>
        <p className="mt-1.5 text-[14px] text-muted-foreground leading-relaxed">
          21st Agents supports multiple AI models from different providers.
          Use Anthropic Claude natively or connect any model through OpenRouter
          for maximum flexibility.
        </p>
      </div>

      {/* Native runtimes */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">
          Which runtimes are supported natively?
        </h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          21st Agents ships with two native runtimes that work out of the box:
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border/70 p-4">
            <p className="text-[13px] font-medium text-foreground">
              Anthropic &middot; Claude Code
            </p>
            <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed">
              Full-featured agentic runtime with tool use, web access, and
              sandboxed execution. Models: Claude Opus 4.6, Sonnet 4.6,
              Haiku 4.5.
            </p>
          </div>
          <div className="rounded-lg border border-border/70 p-4 opacity-60">
            <p className="text-[13px] font-medium text-foreground">
              OpenAI &middot; Codex{" "}
              <span className="ml-1 rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                Soon
              </span>
            </p>
            <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed">
              OpenAI&apos;s optimized runtime with multiple reasoning levels.
              Models: GPT-5.2 Codex, GPT-5.2 Codex (High), GPT-5.1 Codex Mini.
            </p>
          </div>
        </div>
      </section>

      {/* OpenRouter */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">
          Can I use models beyond Anthropic and OpenAI?
        </h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          <span className="font-medium text-foreground">Yes.</span>{" "}
          Through{" "}
          <a
            href="https://openrouter.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            OpenRouter
          </a>
          , you can route your agent to hundreds of models from Google, Meta,
          DeepSeek, Alibaba, Zhipu AI, Mistral, and other providers &mdash; all
          through a single, unified API. OpenRouter handles authentication,
          billing, and failover across providers so you don&apos;t have to
          manage multiple API keys.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          This is especially useful when you want to:
        </p>
        <ul className="space-y-2 text-[14px] text-muted-foreground leading-relaxed">
          <li className="flex gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
            <span>
              Use cost-efficient open-weight models like DeepSeek V3.2 or
              Llama 4 for high-volume, lower-complexity tasks
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
            <span>
              Access the largest context windows (Gemini 3.1 Pro at 1M tokens,
              Llama 4 Scout at 10M tokens)
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
            <span>
              Experiment with specialized models like GLM-5 for agentic
              workloads or Qwen 3.5 for multilingual support across 119
              languages
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
            <span>
              Set up automatic fallback chains &mdash; if one provider is down,
              OpenRouter routes to an alternative
            </span>
          </li>
        </ul>
      </section>

      {/* Model switching */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">
          How does model switching work?
        </h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          You can let end users switch between models at runtime without
          redeploying your agent. Enable{" "}
          <span className="font-medium text-foreground">
            &ldquo;Allow model switching&rdquo;
          </span>{" "}
          in the agent config and select which models to expose. This is useful
          when you want users to choose between faster (cheaper) and more
          capable (pricier) options.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          For example, you might expose Claude Haiku 4.5 for quick questions
          and Claude Opus 4.6 for deep analysis &mdash; or let users pick
          between DeepSeek V3.2 for cost efficiency and Gemini 3.1 Pro for
          maximum context.
        </p>
      </section>

      {/* Models table */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">
          Popular models available through 21st Agents
        </h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The table below lists popular models you can use. Native runtimes
          work out of the box; all others are available via OpenRouter
          integration.
        </p>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-3 py-2 text-left font-medium text-foreground">
                  Provider
                </th>
                <th className="px-3 py-2 text-left font-medium text-foreground">
                  Model
                </th>
                <th className="px-3 py-2 text-left font-medium text-foreground">
                  Context
                </th>
                <th className="px-3 py-2 text-left font-medium text-foreground">
                  Best for
                </th>
              </tr>
            </thead>
            <tbody>
              {MODELS.map((group) =>
                group.models.map((model, i) => (
                  <tr
                    key={model.id}
                    className="border-b border-border/50 last:border-0"
                  >
                    {i === 0 && (
                      <td
                        className="px-3 py-2 align-top font-medium text-foreground"
                        rowSpan={group.models.length}
                      >
                        {group.provider}
                      </td>
                    )}
                    <td className="px-3 py-2 text-muted-foreground">
                      <code className="rounded bg-muted px-1.5 py-0.5 text-[12px] font-mono text-foreground">
                        {model.name}
                      </code>
                      <code className="mt-1 block text-[11px] font-mono text-muted-foreground">
                        {model.id}
                      </code>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">
                      {model.context}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {model.strengths}
                    </td>
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Choosing a model */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">
          How do I choose the right model?
        </h2>
        <div className="space-y-3 text-[14px] text-muted-foreground leading-relaxed">
          <p>
            <span className="font-medium text-foreground">
              For complex agentic tasks
            </span>{" "}
            &mdash; use Claude Opus 4.6 or GPT-5.4. These models excel at
            multi-step reasoning, tool use, and long-horizon tasks where
            accuracy matters more than cost.
          </p>
          <p>
            <span className="font-medium text-foreground">
              For balanced production workloads
            </span>{" "}
            &mdash; Claude Sonnet 4.6 or Gemini 3.1 Pro offer the best
            price-to-performance ratio. Sonnet is the default for most 21st
            agents.
          </p>
          <p>
            <span className="font-medium text-foreground">
              For high-volume, cost-sensitive tasks
            </span>{" "}
            &mdash; DeepSeek V3.2 delivers near-frontier performance at roughly
            10x lower cost than Claude Opus. Qwen 3.5 and Llama 4 are strong
            open-weight alternatives.
          </p>
          <p>
            <span className="font-medium text-foreground">
              For massive context windows
            </span>{" "}
            &mdash; Gemini 3.1 Pro (1M tokens) or Llama 4 Scout (10M tokens)
            can process entire codebases, legal documents, or research corpora
            in a single call.
          </p>
          <p>
            <span className="font-medium text-foreground">
              For multilingual applications
            </span>{" "}
            &mdash; Qwen 3.5 supports 119 languages with strong performance
            across all of them. GLM-5 is another strong option for Chinese and
            multilingual workloads.
          </p>
          <p>
            <span className="font-medium text-foreground">
              For quick, simple tasks
            </span>{" "}
            &mdash; Claude Haiku 4.5 or GLM-4.7 Flash are the fastest and
            cheapest options while still being highly capable.
          </p>
        </div>
      </section>

      {/* Pricing note */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">
          How does pricing work with different models?
        </h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          When using native runtimes (Anthropic Claude Code), pricing is based on
          your 21st Agents plan. When routing through OpenRouter, you pay
          OpenRouter&apos;s per-token rates for the chosen model &mdash; these vary
          significantly between providers. DeepSeek and Qwen models are among the
          most affordable, while frontier models like Claude Opus 4.6 and GPT-5.4
          cost more per token but deliver higher quality.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          You can set a{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-[13px] font-mono text-foreground">
            maxBudgetUsd
          </code>{" "}
          per agent run to control costs regardless of which model you use.
        </p>
      </section>

      {/* CTA */}
      <section className="rounded-xl border border-dashed border-border bg-sidebar p-6">
        <p className="text-[14px] font-medium text-foreground">
          Ready to try a different model?
        </p>
        <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed">
          Check the{" "}
          <Link
            href="/agents/docs/build/agents"
            className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            Agents customization
          </Link>{" "}
          guide to configure your runtime and model, or visit{" "}
          <a
            href="https://openrouter.ai/models"
            target="_blank"
            rel="noopener noreferrer"
            className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            OpenRouter models
          </a>{" "}
          to browse all available models with live pricing.
        </p>
      </section>
    </div>
  )
}
