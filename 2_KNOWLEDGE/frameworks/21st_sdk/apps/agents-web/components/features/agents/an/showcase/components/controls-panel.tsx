"use client"

import type { ControlDefinition } from "../lib/use-controls"
import {
  SelectControl,
  ToggleControl,
  TextControl,
  NumberControl,
  ColorControl,
} from "./control-widgets"

interface ControlsPanelProps {
  definitions: ControlDefinition[]
  values: Record<string, any>
  onChange: (name: string, value: any) => void
  onReset: () => void
}

export function ControlsPanel({ definitions, values, onChange, onReset }: ControlsPanelProps) {
  if (definitions.length === 0) return null

  return (
    <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 bg-gray-50">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Controls</span>
        <button
          onClick={onReset}
          className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors"
        >
          Reset
        </button>
      </div>
      <div className="p-3 space-y-3">
        {definitions.map((def) => {
          const value = values[def.name]
          switch (def.type) {
            case "select":
              return (
                <SelectControl
                  key={def.name}
                  label={def.name}
                  value={value}
                  options={def.options || []}
                  onChange={(v) => onChange(def.name, v)}
                  description={def.description}
                />
              )
            case "boolean":
              return (
                <ToggleControl
                  key={def.name}
                  label={def.name}
                  value={value}
                  onChange={(v) => onChange(def.name, v)}
                  description={def.description}
                />
              )
            case "string":
              return (
                <TextControl
                  key={def.name}
                  label={def.name}
                  value={value}
                  onChange={(v) => onChange(def.name, v)}
                  description={def.description}
                />
              )
            case "number":
              return (
                <NumberControl
                  key={def.name}
                  label={def.name}
                  value={value}
                  onChange={(v) => onChange(def.name, v)}
                  description={def.description}
                />
              )
            case "color":
              return (
                <ColorControl
                  key={def.name}
                  label={def.name}
                  value={value}
                  onChange={(v) => onChange(def.name, v)}
                  description={def.description}
                />
              )
            default:
              return null
          }
        })}
      </div>
    </div>
  )
}
