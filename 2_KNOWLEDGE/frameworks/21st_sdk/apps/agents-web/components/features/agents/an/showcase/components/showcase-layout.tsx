"use client"

import type { ControlDefinition } from "../lib/use-controls"
import { ControlsPanel } from "./controls-panel"

interface ShowcaseLayoutProps {
  title: string
  description: string
  sourceFile: string
  controls?: {
    definitions: ControlDefinition[]
    values: Record<string, any>
    onChange: (name: string, value: any) => void
    onReset: () => void
  }
  preview: React.ReactNode
  variants?: React.ReactNode
}

export function ShowcaseLayout({
  title,
  description,
  sourceFile,
  controls,
  preview,
  variants,
}: ShowcaseLayoutProps) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
          <code className="text-xs text-gray-400 mt-1 block font-mono">{sourceFile}</code>
        </div>

        {/* Preview + Controls */}
        <div className="flex gap-4">
          <div className="flex-1 min-w-0">{preview}</div>
          {controls && controls.definitions.length > 0 && (
            <div className="w-72 flex-shrink-0">
              <ControlsPanel
                definitions={controls.definitions}
                values={controls.values}
                onChange={controls.onChange}
                onReset={controls.onReset}
              />
            </div>
          )}
        </div>

        {/* Variants */}
        {variants && (
          <div className="mt-8">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Variants
            </h2>
            {variants}
          </div>
        )}
      </div>
    </div>
  )
}
