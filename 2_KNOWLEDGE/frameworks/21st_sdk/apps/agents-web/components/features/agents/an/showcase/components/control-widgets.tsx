"use client"

interface SelectControlProps {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
  description?: string
}

export function SelectControl({ label, value, options, onChange, description }: SelectControlProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-sm border border-gray-200 rounded-md px-2 py-1.5 bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {description && <span className="text-[10px] text-gray-400">{description}</span>}
    </div>
  )
}

interface ToggleControlProps {
  label: string
  value: boolean
  onChange: (value: boolean) => void
  description?: string
}

export function ToggleControl({ label, value, onChange, description }: ToggleControlProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-col">
        <label className="text-xs font-medium text-gray-500">{label}</label>
        {description && <span className="text-[10px] text-gray-400">{description}</span>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-9 h-5 rounded-full transition-colors ${
          value ? "bg-blue-500" : "bg-gray-200"
        }`}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
            value ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  )
}

interface TextControlProps {
  label: string
  value: string
  onChange: (value: string) => void
  description?: string
}

export function TextControl({ label, value, onChange, description }: TextControlProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-sm border border-gray-200 rounded-md px-2 py-1.5 bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      {description && <span className="text-[10px] text-gray-400">{description}</span>}
    </div>
  )
}

interface NumberControlProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  description?: string
}

export function NumberControl({ label, value, onChange, min, max, step = 1, description }: NumberControlProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-full text-sm border border-gray-200 rounded-md px-2 py-1.5 bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      {description && <span className="text-[10px] text-gray-400">{description}</span>}
    </div>
  )
}

interface ColorControlProps {
  label: string
  value: string
  onChange: (value: string) => void
  description?: string
}

export function ColorControl({ label, value, onChange, description }: ColorControlProps) {
  const isHex = /^#[0-9a-fA-F]{3,8}$/.test(value)

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-col flex-1 min-w-0">
        <label className="text-xs font-medium text-gray-500">{label}</label>
        {description && <span className="text-[10px] text-gray-400">{description}</span>}
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {isHex && (
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-6 h-6 rounded cursor-pointer border border-gray-200"
            style={{ padding: 0 }}
          />
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-20 text-xs border border-gray-200 rounded px-1.5 py-1 bg-white text-gray-700 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
    </div>
  )
}
