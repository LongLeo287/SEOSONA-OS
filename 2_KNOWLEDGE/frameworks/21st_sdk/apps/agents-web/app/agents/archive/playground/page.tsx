import type { Metadata } from "next"
import AnPlayground from "@/components/features/agents/an/playground/an-playground"

export const metadata: Metadata = {
  title: "Playground | 21st Agents SDK - Configure Your AI Agent",
  description:
    "Interactively configure and preview your AI agent with 21st Agents SDK. Choose styles, add tools, and generate production-ready code.",
  openGraph: {
    title: "Playground | 21st Agents SDK - Configure Your AI Agent",
    description:
      "Interactively configure and preview your AI agent with 21st Agents SDK. Choose styles, add tools, and generate production-ready code.",
    url: "https://an.dev/playground",
    siteName: "an.dev",
    type: "website",
    images: [
      {
        url: "/opengraph-an.png",
        width: 1200,
        height: 600,
        alt: "An Playground - Configure Your AI Agent",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Playground | 21st Agents SDK - Configure Your AI Agent",
    description:
      "Interactively configure and preview your AI agent with 21st Agents SDK. Choose styles, add tools, and generate production-ready code.",
    images: ["/opengraph-an.png"],
  },
}

export default function PlaygroundPage() {
  return <AnPlayground />
}
