"use client"

import { useState, useRef, useEffect } from "react"
import { AnAgentChat, applyTheme, extractThemeConfig, ThemeConfigContext } from "@21st-sdk/react"
import { Upload, Download, Sun, Moon } from "lucide-react"
import { useThemeState } from "@/components/features/agents/an/showcase/lib/use-theme-state"
import { getVarsByCategory } from "@/components/features/agents/an/showcase/lib/css-var-registry"
import { ThemeUploadModal } from "@/components/features/agents/an/showcase/components/theme-upload-modal"
import { MOCK_MESSAGES } from "@/components/features/agents/an/showcase/mocks/messages"
import { THEME_PRESETS } from "@/components/features/agents/an/showcase/mocks/themes"
import { SelectControl, ToggleControl, TextControl, ColorControl } from "@/components/features/agents/an/showcase/components/control-widgets"

const THEME_CONFIG_CONTROLS = [
  { key: "messageStyle", cssVar: "--an-message-style", options: ["bubble-right", "full-width"] },
  { key: "messageDensity", cssVar: "--an-message-density", options: ["relaxed", "compact", "dense"] },
  { key: "inputStyle", cssVar: "--an-input-style", options: ["rounded", "flat", "bordered"] },
  { key: "sendButtonStyle", cssVar: "--an-send-button-style", options: ["circle-icon", "pill-text", "minimal"] },
  { key: "stopButtonStyle", cssVar: "--an-stop-button-style", options: ["circle-square", "pill-text"] },
  { key: "thinkingDisplay", cssVar: "--an-thinking-display", options: ["collapsed", "streaming", "hidden"] },
  { key: "codeActionDisplay", cssVar: "--an-code-action-display", options: ["diff-card", "minimal", "hidden"] },
  { key: "bashDisplay", cssVar: "--an-bash-display", options: ["terminal-card", "minimal", "hidden"] },
  { key: "searchDisplay", cssVar: "--an-search-display", options: ["rich-group", "minimal", "hidden"] },
  { key: "toolCallStyle", cssVar: "--an-tool-call-style", options: ["normal", "compact"] },
  { key: "textContrast", cssVar: "--an-text-contrast", options: ["normal", "high"] },
] as const

const THEME_CONFIG_BOOLEANS = [
  { key: "showToolIcons", cssVar: "--an-show-tool-icons" },
  { key: "messageShadow", cssVar: "--an-message-shadow" },
  { key: "stickyUserMessages", cssVar: "--an-sticky-user-messages" },
  { key: "showDateDivider", cssVar: "--an-show-date-divider" },
  { key: "showCopyButton", cssVar: "--an-show-copy-button" },
] as const

export default function ThemeEditorPage() {
  const {
    theme,
    colorMode,
    setColorMode,
    themeConfig,
    setSharedVar,
    setColorVar,
    setConfigValue,
    loadThemeFromJson,
    exportThemeAsJson,
  } = useThemeState()

  const [showUpload, setShowUpload] = useState(false)
  const [showJson, setShowJson] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (previewRef.current) {
      applyTheme(previewRef.current, theme, colorMode)
    }
  }, [theme, colorMode])

  const handleExport = () => {
    const json = exportThemeAsJson()
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "an-theme.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handlePresetChange = (presetKey: string) => {
    const preset = THEME_PRESETS[presetKey]
    if (preset) {
      loadThemeFromJson(JSON.stringify(preset.theme))
    }
  }

  const varsByCategory = getVarsByCategory()
  const resolvedThemeConfig = extractThemeConfig(theme)

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-semibold text-gray-900">Theme Editor</h1>
          <select
            onChange={(e) => handlePresetChange(e.target.value)}
            className="text-xs border border-gray-200 rounded px-2 py-1 bg-white text-gray-600"
            defaultValue=""
          >
            <option value="" disabled>
              Load preset...
            </option>
            {Object.entries(THEME_PRESETS).map(([key, p]) => (
              <option key={key} value={key}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-1 px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 transition-colors"
          >
            <Upload className="w-3 h-3" /> Load JSON
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-1 px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 transition-colors"
          >
            <Download className="w-3 h-3" /> Export JSON
          </button>
          <button
            onClick={() => setShowJson(!showJson)}
            className={`px-2 py-1 text-xs border border-gray-200 rounded transition-colors ${showJson ? "bg-gray-100" : "hover:bg-gray-50"}`}
          >
            JSON
          </button>
          <button
            onClick={() => setColorMode(colorMode === "light" ? "dark" : "light")}
            className="flex items-center gap-1 px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 transition-colors"
          >
            {colorMode === "light" ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
            {colorMode}
          </button>
        </div>
      </div>

      {/* Main 3-panel layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Theme Config */}
        <div className="w-56 border-r border-gray-200 bg-white overflow-y-auto flex-shrink-0">
          <div className="p-3">
            <h2 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Config
            </h2>
            <div className="space-y-3">
              {THEME_CONFIG_CONTROLS.map(({ key, cssVar, options }) => (
                <SelectControl
                  key={key}
                  label={key}
                  value={(themeConfig as any)[key] || options[0]}
                  options={[...options]}
                  onChange={(v) => setConfigValue(key, cssVar, v)}
                />
              ))}
              {THEME_CONFIG_BOOLEANS.map(({ key, cssVar }) => (
                <ToggleControl
                  key={key}
                  label={key}
                  value={(themeConfig as any)[key] || false}
                  onChange={(v) => setConfigValue(key, cssVar, v)}
                />
              ))}
              <TextControl
                label="inputBarPlaceholder"
                value={theme.theme["--an-input-placeholder"] || "Send a message..."}
                onChange={(v) => setSharedVar("--an-input-placeholder", v)}
              />
            </div>
          </div>
        </div>

        {/* Middle: CSS Variables */}
        <div className="w-64 border-r border-gray-200 bg-white overflow-y-auto flex-shrink-0">
          <div className="p-3">
            <h2 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
              CSS Variables ({colorMode} mode)
            </h2>
            {Object.entries(varsByCategory).map(([category, vars]) => (
              <div key={category} className="mb-4">
                <h3 className="text-[10px] font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  {category}
                </h3>
                <div className="space-y-2">
                  {vars.map((v) => {
                    const currentValue =
                      v.scope === "shared"
                        ? theme.theme[v.name] || v.defaultValue
                        : theme[colorMode][v.name] || v.defaultValue

                    if (v.type === "color") {
                      return (
                        <ColorControl
                          key={v.name}
                          label={v.label}
                          value={currentValue}
                          onChange={(val) =>
                            v.scope === "shared"
                              ? setSharedVar(v.name, val)
                              : setColorVar(v.name, val)
                          }
                        />
                      )
                    }

                    return (
                      <TextControl
                        key={v.name}
                        label={v.label}
                        value={currentValue}
                        onChange={(val) =>
                          v.scope === "shared"
                            ? setSharedVar(v.name, val)
                            : setColorVar(v.name, val)
                        }
                      />
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ThemeConfigContext.Provider value={resolvedThemeConfig}>
            <div
              ref={previewRef}
              className="an-root flex-1 flex flex-col overflow-hidden"
              style={{
                fontFamily: "var(--an-font-family, system-ui, sans-serif)",
                fontSize: "var(--an-text-size, 14px)",
                color: "var(--an-foreground, #1a1a1a)",
                backgroundColor: "var(--an-background, #ffffff)",
              }}
            >
              <AnAgentChat
                messages={MOCK_MESSAGES}
                onSend={() => {}}
                status="ready"
                onStop={() => {}}
                theme={theme}
                colorMode={colorMode}
              />
            </div>
          </ThemeConfigContext.Provider>

          {/* JSON preview */}
          {showJson && (
            <div className="h-48 border-t border-gray-200 bg-gray-900 overflow-y-auto flex-shrink-0">
              <pre className="p-3 text-xs text-gray-300 font-mono whitespace-pre-wrap">
                {exportThemeAsJson()}
              </pre>
            </div>
          )}
        </div>
      </div>

      <ThemeUploadModal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onLoad={loadThemeFromJson}
      />
    </div>
  )
}
