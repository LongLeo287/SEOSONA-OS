export interface AnTemplateAgentDefaults {
  agentName: string
  agentSlug: string
  runtime: "claude-code" | "codex"
}

export type AnTemplateCategory = "use-case" | "integration" | "starter"

export interface AnTemplate {
  slug: string
  name: string
  description: string
  sourceRepo: string // "owner/repo" — monorepo containing templates
  sourcePath: string // subdirectory within the repo
  image: string
  category: AnTemplateCategory
  agentDefaults?: AnTemplateAgentDefaults // templates with defaults auto-create agents
  useCases: string[]
  stack: string[]
  integrations: string[]
}

/** Default templates monorepo */
const SOURCE_REPO = "21st-dev/an-examples"

export const AN_TEMPLATE_DEMO_INTERNAL_SLUGS: Record<string, string> = {
  "chat-app": "nextjs-chat",
  "email-agent": "email-agent",
  "nia-chat": "nia-chat",
  "note-taker": "note-taker",
  "web-scraper": "web-scraper",
  "fill-form": "fill-form",
  "docs-assistant": "docs-assistant",
}

export function getTemplateDemoUrl(
  template: Pick<AnTemplate, "slug">,
  theme?: "light" | "dark",
): string | null {
  const internalSlug = AN_TEMPLATE_DEMO_INTERNAL_SLUGS[template.slug]
  if (!internalSlug) return null
  const url = new URL(`https://21st-sdk-${internalSlug}.vercel.app`)
  if (theme) {
    url.searchParams.set("theme", theme)
  }
  url.searchParams.set("sidebar", "false")
  return url.toString()
}

export const AN_TEMPLATES: AnTemplate[] = [
  {
    slug: "chat-app",
    name: "Next.js Starter",
    description: "Next.js chat interface with AI agent powered by 21st Agents SDK",
    sourceRepo: SOURCE_REPO,
    sourcePath: "nextjs-chat",
    image: "/agents/templates/chat-app.png",
    category: "starter",
    agentDefaults: {
      agentName: "Chat Agent",
      agentSlug: "chat-agent",
      runtime: "claude-code",
    },
    useCases: ["Chatbot", "Documentation Search", "Starter"],
    stack: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
    integrations: ["21st Agents SDK", "Claude Code", "DuckDuckGo"],
  },
  {
    slug: "python-terminal-chat",
    name: "Python Starter",
    description: "Minimal server-side Python chat client using the 21st SDK",
    sourceRepo: SOURCE_REPO,
    sourcePath: "python-terminal-chat",
    image: "/agents/templates/logos/python.svg",
    category: "starter",
    useCases: ["CLI Chat", "Server Integration", "Python Starter"],
    stack: ["Python", "21st SDK"],
    integrations: ["21st Agents SDK"],
  },
  {
    slug: "golang-terminal-chat",
    name: "Go Starter",
    description: "Minimal terminal chat client in Go using the 21st SDK",
    sourceRepo: SOURCE_REPO,
    sourcePath: "golang-terminal-chat",
    image: "/agents/templates/logos/go.svg",
    category: "starter",
    useCases: ["CLI Chat", "Server Integration", "Go Starter"],
    stack: ["Go", "21st SDK"],
    integrations: ["21st Agents SDK"],
  },
  {
    slug: "nia-chat",
    name: "Explain GitHub repos with Nia",
    description: "Next.js repository chat with Nia MCP-backed GitHub analysis",
    sourceRepo: SOURCE_REPO,
    sourcePath: "nia-chat",
    image: "/agents/templates/nia-chat.png",
    category: "integration",
    agentDefaults: {
      agentName: "Nia Agent",
      agentSlug: "nia-agent",
      runtime: "claude-code",
    },
    useCases: ["Repository Analysis", "GitHub Research", "Codebase Chat"],
    stack: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
    integrations: ["21st Agents SDK", "Claude Code", "Nia MCP"],
  },
  {
    slug: "email-agent",
    name: "AgentMail Agent",
    description: "Email operations copilot — send, read inbox, auto-reply via AgentMail",
    sourceRepo: SOURCE_REPO,
    sourcePath: "email-agent",
    image: "/agents/templates/email-agent.png",
    category: "integration",
    agentDefaults: {
      agentName: "Email Agent",
      agentSlug: "email-agent",
      runtime: "claude-code",
    },
    useCases: ["Email Automation", "Outreach", "Customer Communication"],
    stack: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
    integrations: ["21st Agents SDK", "Claude Code", "AgentMail"],
  },
  {
    slug: "note-taker",
    name: "Note Taker with Convex",
    description: "AI notebook assistant with persistent notes and real-time sync via Convex",
    sourceRepo: SOURCE_REPO,
    sourcePath: "note-taker",
    image: "/agents/templates/note-taker.png",
    category: "integration",
    agentDefaults: {
      agentName: "Note Taker",
      agentSlug: "note-taker",
      runtime: "claude-code",
    },
    useCases: ["Note Taking", "Knowledge Base", "Personal Assistant"],
    stack: ["Next.js", "React", "Convex", "Tailwind CSS", "TypeScript"],
    integrations: ["21st Agents SDK", "Claude Code", "Convex"],
  },
  {
    slug: "monitor-agent",
    name: "Slack Monitor Agent",
    description: "Track service status and send updates directly to Slack",
    sourceRepo: SOURCE_REPO,
    sourcePath: "monitor-agent",
    image: "/agents/templates/monitor-agent.png",
    category: "integration",
    agentDefaults: {
      agentName: "Monitor Agent",
      agentSlug: "monitor-agent",
      runtime: "claude-code",
    },
    useCases: ["Monitoring", "Alerting", "DevOps"],
    stack: ["Node.js", "TypeScript"],
    integrations: ["21st Agents SDK", "Claude Code", "Slack", "Atlassian Statuspage"],
  },
  {
    slug: "web-scraper",
    name: "BrowserUse Agent",
    description: "Extract structured data from any website using Browser Use Cloud",
    sourceRepo: SOURCE_REPO,
    sourcePath: "web-scraper",
    image: "/agents/templates/web-scraper.png",
    category: "integration",
    agentDefaults: {
      agentName: "Web Scraper",
      agentSlug: "web-scraper",
      runtime: "claude-code",
    },
    useCases: ["Web Scraping", "Data Extraction", "Content Aggregation"],
    stack: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
    integrations: ["21st Agents SDK", "Claude Code", "Browser Use"],
  },
  {
    slug: "lead-research-agent",
    name: "Lead Research Agent",
    description: "Research people by email online, qualify leads, and send Slack alerts for interesting prospects",
    sourceRepo: "21st-dev/21st-sdk-examples",
    sourcePath: "lead-research-agent",
    image: "/agents/templates/logos/slack.svg",
    category: "use-case",
    agentDefaults: {
      agentName: "Lead Research",
      agentSlug: "lead-research",
      runtime: "claude-code",
    },
    useCases: ["Outreach", "Lead Qualification", "Sales Research"],
    stack: ["Node.js", "TypeScript"],
    integrations: ["21st Agents SDK", "Claude Code", "Slack", "Exa.ai"],
  },
  {
    slug: "fill-form",
    name: "Form Autocomplete",
    description: "AI-powered form filling with tabbed forms and chat interface",
    sourceRepo: SOURCE_REPO,
    sourcePath: "fill-form",
    image: "/agents/templates/fill-form.png",
    category: "use-case",
    agentDefaults: {
      agentName: "Form Agent",
      agentSlug: "form-agent",
      runtime: "claude-code",
    },
    useCases: ["Data Entry", "Form Automation", "Internal Tool"],
    stack: ["Next.js", "React", "React Hook Form", "Zod", "Tailwind CSS"],
    integrations: ["21st Agents SDK", "Claude Code"],
  },
  {
    slug: "docs-assistant",
    name: "Docs Assistant (llms.txt)",
    description: "Documentation Q&A agent — provide a docs URL and get an instant assistant that searches via llms.txt",
    sourceRepo: "21st-dev/21st-sdk-examples",
    sourcePath: "docs-assistant",
    image: "/agents/templates/logos/duckduckgo.svg",
    category: "use-case",
    agentDefaults: {
      agentName: "Docs Assistant",
      agentSlug: "docs-assistant",
      runtime: "claude-code",
    },
    useCases: ["Documentation Search", "Q&A", "Developer Support"],
    stack: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
    integrations: ["21st Agents SDK", "Claude Code", "llms.txt"],
  },
  {
    slug: "support-agent",
    name: "Support Agent",
    description: "Docs-powered support agent that answers questions from llms.txt and escalates unanswered ones via email (Resend)",
    sourceRepo: "21st-dev/21st-sdk-examples",
    sourcePath: "support-agent",
    image: "/agents/templates/logos/duckduckgo.svg",
    category: "use-case",
    agentDefaults: {
      agentName: "Support Agent",
      agentSlug: "support-agent",
      runtime: "claude-code",
    },
    useCases: ["Customer Support", "Documentation Search", "Email Escalation"],
    stack: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
    integrations: ["21st Agents SDK", "Claude Code", "llms.txt", "Resend"],
  },
]

export const AN_STARTER_TEMPLATES = AN_TEMPLATES.filter(
  (t) => t.category === "starter",
)
export const AN_USE_CASE_TEMPLATES = AN_TEMPLATES.filter(
  (t) => t.category === "use-case",
)
export const AN_INTEGRATION_TEMPLATES = AN_TEMPLATES.filter(
  (t) => t.category === "integration",
)
