import { AgentsLink as Link } from "@/components/agents-link"
import type { ReactNode } from "react"
import {
  BookIcon,
  CoinsIcon,
  RocketIcon,
  ShieldIcon,
  WrenchIcon,
} from "@/components/features/agents/an/docs/icons"
import {
  ClockIcon,
  EyeIcon,
  IconChatBubble,
} from "@/components/features/agents/ui/canvas/[id]/{components}/ui/icons"

function AgentServiceIcon() {
  return (
    <div className="relative h-4 w-4">
      {/* Claude icon */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="absolute inset-0 text-[#D97757]"
        style={{ animation: "icon-swap-in 8s ease-in-out infinite" }}
      >
        <path d="M5.92405 15.2962L9.85823 13.0903L9.92405 12.8981L9.85823 12.7918H9.66582L9.0076 12.7513L6.75949 12.6906L4.81013 12.6097L2.92152 12.5085L2.44557 12.4073L2 11.8204L2.04557 11.5269L2.44557 11.2588L3.01772 11.3094L4.28354 11.3954L6.18228 11.5269L7.55949 11.6079L9.6 11.8204H9.92405L9.96962 11.6888L9.85823 11.6079L9.77215 11.5269L7.8076 10.1963L5.68101 8.78978L4.56709 7.98027L3.96456 7.57045L3.66076 7.18594L3.52911 6.34607L4.07595 5.74399L4.81013 5.79459L4.99747 5.84518L5.74177 6.4169L7.33165 7.64635L9.4076 9.1743L9.71139 9.42727L9.83291 9.34126L9.8481 9.28055L9.71139 9.05287L8.58228 7.01391L7.37722 4.93954L6.84051 4.07943L6.69873 3.56337C6.6481 3.35087 6.61266 3.17379 6.61266 2.95624L7.23544 2.11131L7.57975 2L8.41013 2.11131L8.75949 2.41487L9.27595 3.59373L10.1114 5.45054L11.4076 7.97521L11.7873 8.72401L11.9899 9.41715L12.0658 9.62965H12.1975V9.50822L12.3038 8.08652L12.5013 6.34101L12.6937 4.09461L12.7595 3.46218L13.0734 2.70326L13.6962 2.29345L14.1823 2.52618L14.5823 3.0979L14.5266 3.46724L14.2886 5.01037L13.8228 7.42879L13.519 9.04781H13.6962L13.8987 8.84543L14.719 7.75765L16.0962 6.03744L16.7038 5.35441L17.4127 4.60056L17.8684 4.24134H18.7291L19.362 5.18239L19.0785 6.15381L18.1924 7.27701L17.4582 8.22818L16.4051 9.64483L15.7468 10.7781L15.8076 10.8692L15.9646 10.854L18.3443 10.3481L19.6304 10.1154L21.1646 9.85226L21.8582 10.1761L21.9342 10.5049L21.6608 11.1778L20.0203 11.5826L18.0962 11.9671L15.2304 12.6451L15.1949 12.6704L15.2354 12.721L16.5266 12.8424L17.0785 12.8728H18.4304L20.9468 13.06L21.6051 13.4951L22 14.0263L21.9342 14.4311L20.9215 14.9471L19.5544 14.6233L16.3646 13.8644L15.2709 13.5912H15.119V13.6823L16.0304 14.5727L17.7013 16.0804L19.7924 18.0233L19.8987 18.5039L19.6304 18.8834L19.3468 18.8429L17.5089 17.4617L16.8 16.8394L15.1949 15.4885H15.0886V15.6302L15.4582 16.1715L17.4127 19.106L17.5139 20.0066L17.3722 20.3L16.8658 20.4771L16.3089 20.3759L15.1646 18.7721L13.9848 16.9658L13.0329 15.3468L12.9165 15.4126L12.3544 21.4586L12.0911 21.7673L11.4835 22L10.9772 21.6155L10.7089 20.9932L10.9772 19.7637L11.3013 18.1599L11.5646 16.8849L11.8025 15.3013L11.9443 14.7751L11.9342 14.7397L11.8177 14.7549L10.6228 16.3941L8.80506 18.848L7.36709 20.386L7.02279 20.5226L6.42532 20.214L6.48101 19.6625L6.81519 19.1718L8.80506 16.642L10.0051 15.0736L10.7797 14.168L10.7747 14.0364H10.7291L5.44304 17.4667L4.50127 17.5882L4.0962 17.2087L4.14684 16.5864L4.33924 16.384L5.92911 15.2912L5.92405 15.2962Z" />
      </svg>
      {/* OpenAI icon */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="absolute inset-0 text-muted-foreground"
        style={{ animation: "icon-swap-out 8s ease-in-out infinite" }}
      >
        <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.998 5.998 0 0 0-3.998 2.9 6.042 6.042 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073M13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.143-.08 4.773-2.756a.776.776 0 0 0 .391-.676v-6.738l2.018 1.165a.07.07 0 0 1 .038.052v5.573a4.504 4.504 0 0 1-4.487 4.5M3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.774 2.756a.776.776 0 0 0 .78 0l5.83-3.368v2.332a.08.08 0 0 1-.03.06L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646M2.34 7.896a4.485 4.485 0 0 1 2.34-1.972V11.6a.77.77 0 0 0 .387.676l5.829 3.365-2.017 1.165a.076.076 0 0 1-.069.006L4 14.019a4.5 4.5 0 0 1-1.66-6.123M19.42 11.6l-5.829-3.366L15.608 7.07a.076.076 0 0 1 .069-.006l4.812 2.779a4.5 4.5 0 0 1-.69 8.138v-5.677a.79.79 0 0 0-.378-.703m2.009-3.023-.142-.085-4.774-2.756a.776.776 0 0 0-.78 0L9.902 9.1V6.77a.08.08 0 0 1 .03-.061l4.813-2.787a4.5 4.5 0 0 1 6.684 4.655m-12.64 4.135L6.77 11.547a.07.07 0 0 1-.037-.052V5.922a4.5 4.5 0 0 1 7.37-3.463l-.143.08L9.188 5.3a.776.776 0 0 0-.391.676zm1.095-2.362 2.596-1.5 2.596 1.5v2.999l-2.596 1.5-2.596-1.5z" />
      </svg>
    </div>
  )
}

function ThemesIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className="text-muted-foreground"
    >
      <path
        d="M10.25 2.75H4.75C3.64543 2.75 2.75 3.64543 2.75 4.75V16.5C2.75 19.1234 4.87665 21.25 7.5 21.25C10.1234 21.25 12.25 19.1234 12.25 16.5V4.75C12.25 3.64543 11.3546 2.75 10.25 2.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
      <path
        d="M11.6133 18.8751L17.4883 8.69935C18.0406 7.74277 17.7128 6.51958 16.7562 5.9673L12.2493 3.36523"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.875 20.6136L20.0508 14.7386C21.0074 14.1863 21.3351 12.9632 20.7828 12.0066L18.181 7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.25 16.5C9.25 17.4665 8.4665 18.25 7.5 18.25C6.5335 18.25 5.75 17.4665 5.75 16.5C5.75 15.5335 6.5335 14.75 7.5 14.75C8.4665 14.75 9.25 15.5335 9.25 16.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CostTrackingIcon() {
  return (
    <div className="relative h-4 w-4">
      <ClockIcon
        className="absolute inset-0 h-4 w-4 text-muted-foreground"
        style={{ animation: "icon-swap-in 8s ease-in-out infinite" }}
      />
      <CoinsIcon
        className="absolute inset-0 h-4 w-4 text-muted-foreground"
        style={{ animation: "icon-swap-out 8s ease-in-out infinite" }}
      />
    </div>
  )
}

const FEATURES: { title: string; description: string; icon: ReactNode }[] = [
  {
    title: "Agents",
    description: "Claude Agent and OpenAI Codex (coming soon) with model switching",
    icon: <AgentServiceIcon />,
  },
  {
    title: "Sandbox execution",
    description: "Isolated environments powered by E2B with configurable permissions",
    icon: <ShieldIcon className="h-4 w-4 text-muted-foreground" />,
  },
  {
    title: "Session management",
    description: "Persistent sandboxes with threaded conversation history",
    icon: <IconChatBubble className="h-4 w-4 text-muted-foreground" />,
  },
  {
    title: "Cost tracking",
    description: "Token counts and USD costs for every conversation turn",
    icon: <CostTrackingIcon />,
  },
  {
    title: "Chat UI & themes",
    description: "Beautiful chat interface with customizable theme variables",
    icon: <ThemesIcon />,
  },
  {
    title: "Built-in tools",
    description: "Web search, file handling, code execution, and custom actions",
    icon: <WrenchIcon className="h-4 w-4 text-muted-foreground" />,
  },
  {
    title: "SSE streaming",
    description: "Real-time token streaming with AI SDK compatibility",
    icon: <RocketIcon className="h-4 w-4 text-muted-foreground" />,
  },
  {
    title: "Logs & debugging",
    description: "Session search, conversation replay, live monitoring",
    icon: <EyeIcon className="h-4 w-4 text-muted-foreground" />,
  },
  {
    title: "File attachments",
    description: "Image, document, and code uploads with type filtering",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-muted-foreground">
        <path d="M6 11V15C6 18.3137 8.68629 21 12 21C15.3137 21 18 18.3137 18 15V7C18 4.79086 16.2091 3 14 3C11.7909 3 10 4.79086 10 7V15C10 16.1046 10.8954 17 12 17C13.1046 17 14 16.1046 14 15V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Skills system",
    description: "On-demand context blocks referenced from the system prompt",
    icon: <BookIcon className="h-4 w-4 text-muted-foreground" />,
  },
]

export default function DocsIntroductionPage() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight">
          Introduction
        </h1>
        <p className="max-w-[600px] text-[14px] leading-relaxed text-muted-foreground">
          Add a production-ready AI agent to your product without building the
          infrastructure yourself. 21st Agents handles the runtime, sandboxing, streaming,
          tools, and UI - you just configure and ship.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/agents/docs/get-started"
            className="an-focus-btn inline-flex items-center gap-2 rounded-[10px] bg-foreground px-4 py-1.5 text-[13px] font-medium text-background transition-all duration-150 hover:opacity-90 active:scale-[0.99]"
          >
            Get Started
          </Link>
          <Link
            href="/agents/docs/try-it-out"
            className="an-focus-btn inline-flex items-center gap-2 rounded-[10px] border border-border bg-secondary px-4 py-1.5 text-[13px] font-medium text-foreground transition-all duration-150 hover:bg-accent active:scale-[0.99]"
          >
            Try It Out
          </Link>
        </div>
      </div>

      {/* Backed by */}
      <div className="space-y-4">
        <h2 className="text-[15px] font-medium">Backed by</h2>
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-[13px] font-medium text-foreground">
            <svg
              className="h-4 w-4 shrink-0"
              viewBox="0 0 256 256"
              fill="none"
            >
              <rect width="256" height="256" rx="40" fill="#FC6A21" />
              <path
                d="M119.374 144.746L75.433 62.432h20.081l25.848 52.092c.398.928.862 1.889 1.392 2.883.53.994.994 2.022 1.391 3.082.266.398.464.762.597 1.094.133.33.265.63.398.894a65.643 65.643 0 0 1 1.79 3.877c.53 1.26.993 2.42 1.39 3.48 1.061-2.254 2.221-4.673 3.48-7.257 1.26-2.585 2.552-5.27 3.877-8.053l26.246-52.092h18.69l-44.34 83.308v53.087h-16.9v-54.081z"
                fill="white"
              />
            </svg>
            Y Combinator
          </span>
          <a href="https://www.linkedin.com/in/christianreber/" target="_blank" rel="noopener noreferrer" className="an-focus-btn inline-flex items-center rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-[13px] font-medium text-foreground transition-colors hover:bg-accent">
            Christian Reber <span className="ml-1 text-muted-foreground">Wunderlist, Pitch</span>
          </a>
          <a href="https://www.linkedin.com/in/thom-wolf" target="_blank" rel="noopener noreferrer" className="an-focus-btn inline-flex items-center rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-[13px] font-medium text-foreground transition-colors hover:bg-accent">
            Thomas Wolf <span className="ml-1 text-muted-foreground">Hugging Face</span>
          </a>
          <a href="https://www.linkedin.com/in/gokulrajaram1/" target="_blank" rel="noopener noreferrer" className="an-focus-btn inline-flex items-center rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-[13px] font-medium text-foreground transition-colors hover:bg-accent">
            Gokul Rajaram <span className="ml-1 text-muted-foreground">Google</span>
          </a>
          <a href="https://www.linkedin.com/in/nick--baumann" target="_blank" rel="noopener noreferrer" className="an-focus-btn inline-flex items-center rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-[13px] font-medium text-foreground transition-colors hover:bg-accent">
            Nick Baumann <span className="ml-1 text-muted-foreground">OpenAI Codex</span>
          </a>
          <a href="https://www.linkedin.com/in/andyzg/" target="_blank" rel="noopener noreferrer" className="an-focus-btn inline-flex items-center rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-[13px] font-medium text-foreground transition-colors hover:bg-accent">
            Andy Zhang <span className="ml-1 text-muted-foreground">Google DeepMind</span>
          </a>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-4">
        <h2 className="text-[15px] font-medium">Features</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="flex items-start gap-3 py-1">
              <div className="shrink-0 mt-0.5">{feature.icon}</div>
              <div className="min-w-0">
                <p className="text-[13px] font-medium leading-tight">
                  {feature.title}
                </p>
                <p className="text-[12px] text-muted-foreground leading-snug mt-0.5">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community */}
      <div className="rounded-xl border border-dashed border-border bg-sidebar p-6 text-center space-y-3">
        <div>
          <p className="text-[15px] font-medium">Community & Support</p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Join the community for help, feature requests, and to stay up to date.
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <a
            href="https://discord.gg/yn3pzMb7VR"
            target="_blank"
            rel="noopener noreferrer"
            className="an-focus-btn inline-flex items-center gap-1.5 rounded-[10px] bg-foreground px-4 py-1.5 text-[13px] font-medium text-background transition-all duration-150 hover:opacity-90 active:scale-[0.99]"
          >
            Join Discord
          </a>
          <a
            href="https://x.com/21st_dev"
            target="_blank"
            rel="noopener noreferrer"
            className="an-focus-btn inline-flex items-center gap-1.5 rounded-[10px] border border-border bg-secondary px-4 py-1.5 text-[13px] font-medium text-foreground transition-all duration-150 hover:bg-accent active:scale-[0.99]"
          >
            Follow on X
          </a>
        </div>
      </div>
    </div>
  )
}
