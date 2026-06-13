"use client"

import type { ChatStyle, TimelineStep, ChatPreviewConfig } from "./chat-preview/types"
import { PreviewAgentChatCursor } from "./chat-preview/style-cursor"
import { PreviewAgentChatDefault } from "./chat-preview/style-default"
import { PreviewAgentChatNotion } from "./chat-preview/style-notion"
import { PreviewCustomStyle } from "./chat-preview/style-custom"

export type { ChatStyle }

export function PreviewAgentChat({ style, paused, timeline, previewConfig }: { style: ChatStyle; paused?: boolean; timeline?: TimelineStep[]; previewConfig?: ChatPreviewConfig }) {
  if (style === "cursor") return <PreviewAgentChatCursor paused={paused} timeline={timeline} previewConfig={previewConfig} />
  if (style === "notion") return <PreviewAgentChatNotion paused={paused} timeline={timeline} previewConfig={previewConfig} />
  if (style === "custom") return <PreviewCustomStyle paused={paused} timeline={timeline} previewConfig={previewConfig} />
  return <PreviewAgentChatDefault paused={paused} timeline={timeline} previewConfig={previewConfig} />
}
