import type { Metadata } from "next"
import ModelsAndProvidersContent from "./content"
import {
  buildDocArticleJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/agents-docs/structured-data"

const jsonLd = [
  buildDocArticleJsonLd({
    title: "Models & Providers – Use Any AI Model with 21st Agents",
    description:
      "Use Claude, GPT, Gemini, DeepSeek, Llama, Qwen, GLM and hundreds more AI models through OpenRouter integration. Compare models, switch at runtime, and optimize for cost or performance.",
    path: "/docs/knowledge-base/models-and-providers",
  }),
  buildBreadcrumbJsonLd([
    { name: "Docs", path: "/docs" },
    { name: "Knowledge Base", path: "/docs/knowledge-base" },
    {
      name: "Models & Providers",
      path: "/docs/knowledge-base/models-and-providers",
    },
  ]),
]

export const metadata: Metadata = {
  title: "Models & Providers – Use Any AI Model with 21st Agents",
  description:
    "Use Claude, GPT, Gemini, DeepSeek, Llama, Qwen, GLM and hundreds more AI models through OpenRouter integration. Compare models, switch at runtime, and optimize for cost or performance.",
  alternates: { canonical: "/docs/knowledge-base/models-and-providers" },
  openGraph: {
    title:
      "Models & Providers – Use Any AI Model with 21st Agents",
    description:
      "Use Claude, GPT, Gemini, DeepSeek, Llama, Qwen, GLM and hundreds more AI models through OpenRouter integration. Compare models, switch at runtime, and optimize for cost or performance.",
    url: "/docs/knowledge-base/models-and-providers",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Models & Providers – Use Any AI Model with 21st Agents",
    description:
      "Use Claude, GPT, Gemini, DeepSeek, Llama, Qwen, GLM and hundreds more AI models through OpenRouter integration. Compare models, switch at runtime, and optimize for cost or performance.",
  },
}

export default function ModelsAndProvidersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <ModelsAndProvidersContent />
    </>
  )
}
