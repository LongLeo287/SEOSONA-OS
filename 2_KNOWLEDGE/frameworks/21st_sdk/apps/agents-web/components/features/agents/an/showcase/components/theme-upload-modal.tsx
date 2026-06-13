"use client"

import { useState, useRef } from "react"
import { X, Upload } from "lucide-react"

interface ThemeUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onLoad: (json: string) => boolean
}

export function ThemeUploadModal({ isOpen, onClose, onLoad }: ThemeUploadModalProps) {
  const [jsonText, setJsonText] = useState("")
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleLoad = () => {
    setError("")
    if (!jsonText.trim()) {
      setError("Please paste or upload a JSON theme file")
      return
    }
    const success = onLoad(jsonText)
    if (success) {
      setJsonText("")
      onClose()
    } else {
      setError('Invalid theme JSON. Expected { theme: {...}, light: {...}, dark: {...} }')
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      setJsonText(text)
      setError("")
    }
    reader.readAsText(file)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-[560px] max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">Load Theme JSON</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-hidden flex flex-col gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload File
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          <textarea
            value={jsonText}
            onChange={(e) => {
              setJsonText(e.target.value)
              setError("")
            }}
            placeholder='Paste your ChatTheme JSON here...\n\n{\n  "theme": { ... },\n  "light": { ... },\n  "dark": { ... }\n}'
            className="flex-1 min-h-[200px] w-full text-xs font-mono border border-gray-200 rounded-md p-3 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
          />

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 px-4 py-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleLoad}
            className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Load Theme
          </button>
        </div>
      </div>
    </div>
  )
}
