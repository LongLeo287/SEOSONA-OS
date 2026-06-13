"use client"

import Link from "next/link"
import { AnAgentChat } from "@21st-sdk/react"
import { MOCK_SHORT_MESSAGES } from "@/components/features/agents/an/showcase/mocks/messages"
import { THEME_PRESETS } from "@/components/features/agents/an/showcase/mocks/themes"
import { PreviewContainer } from "@/components/features/agents/an/showcase/components/preview-container"
import { useShowcaseContext } from "@/components/features/agents/an/showcase/lib/showcase-context"

const BASE = "/agents/showcase"

export default function ShowcaseOverview() {
  const { colorMode } = useShowcaseContext()

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-8 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">21st Agents SDK Component Showcase</h1>
        <p className="text-sm text-gray-500 mb-8">
          Visual catalog of all @21st-sdk/react components, tool renderers, and theming options.
          Components are imported from source — edits to SDK files reflect here instantly.
        </p>

        {/* Quick preview */}
        <section className="mb-10">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Live Preview
          </h2>
          <PreviewContainer colorMode={colorMode} height="400px">
            <AnAgentChat
              messages={MOCK_SHORT_MESSAGES}
              onSend={() => {}}
              status="ready"
              onStop={() => {}}
              colorMode={colorMode}
            />
          </PreviewContainer>
        </section>

        {/* Theme presets */}
        <section className="mb-10">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Theme Presets
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(THEME_PRESETS).map(([key, preset]) => (
              <PreviewContainer
                key={key}
                theme={preset.theme}
                colorMode={colorMode}
                label={preset.name}
                height="280px"
              >
                <AnAgentChat
                  messages={MOCK_SHORT_MESSAGES}
                  onSend={() => {}}
                  status="ready"
                  onStop={() => {}}
                  theme={preset.theme}
                  colorMode={colorMode}
                />
              </PreviewContainer>
            ))}
          </div>
        </section>

        {/* Navigation grid */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            All Components
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { path: `${BASE}/components/an-agent-chat`, label: "AgentChat", desc: "Full drop-in chat component" },
              { path: `${BASE}/components/message-list`, label: "MessageList", desc: "Auto-scrolling message container" },
              { path: `${BASE}/components/input-bar`, label: "InputBar", desc: "Text input with send/stop" },
              { path: `${BASE}/components/user-message`, label: "UserMessage", desc: "User message bubble" },
              { path: `${BASE}/components/assistant-message`, label: "AssistantMessage", desc: "Assistant message with tools" },
              { path: `${BASE}/components/streaming-markdown`, label: "StreamingMarkdown", desc: "Markdown renderer" },
              { path: `${BASE}/components/message-actions`, label: "MessageActions", desc: "Copy button" },
              { path: `${BASE}/tools/bash-tool`, label: "BashTool", desc: "Terminal command display" },
              { path: `${BASE}/tools/edit-tool`, label: "EditTool", desc: "Diff viewer" },
              { path: `${BASE}/tools/search-tool`, label: "SearchTool", desc: "Web search results" },
              { path: `${BASE}/tools/todo-tool`, label: "TodoTool", desc: "Task checklist" },
              { path: `${BASE}/tools/plan-tool`, label: "PlanTool", desc: "Step-by-step plans" },
              { path: `${BASE}/tools/task-tool`, label: "TaskTool", desc: "Sub-agent tasks" },
              { path: `${BASE}/tools/mcp-tool`, label: "McpTool", desc: "MCP protocol display" },
              { path: `${BASE}/tools/thinking-tool`, label: "ThinkingTool", desc: "Reasoning indicators" },
              { path: `${BASE}/tools/generic-tool`, label: "GenericTool", desc: "Fallback renderer" },
              { path: `${BASE}/theme`, label: "Theme Editor", desc: "Visual theme customization" },
            ].map(({ path, label, desc }) => (
              <Link
                key={path}
                href={path}
                className="block p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-colors no-underline"
              >
                <div className="text-sm font-medium text-gray-900">{label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
