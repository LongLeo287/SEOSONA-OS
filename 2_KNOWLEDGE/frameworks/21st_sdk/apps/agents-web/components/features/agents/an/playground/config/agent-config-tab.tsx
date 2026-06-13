"use client"

import { motion, AnimatePresence } from "motion/react"
import type {
  AgentConfig,
  PlaygroundAction,
  ClaudeModelId,
  CodexModelId,
  AgentMode,
  AttachmentType,
  IconFamily,
} from "../playground-types"
import {
  CLAUDE_MODELS,
  CODEX_MODELS,
  ATTACHMENT_TYPE_OPTIONS,
  MODE_OPTIONS,
} from "../playground-types"
import { PlaygroundToolEditor } from "../playground-tool-editor"
import {
  ConfigSection,
  SegmentedControl,
  SwitchRow,
  CheckboxRow,
  PlanField,
  ClaudeIcon,
  CodexIcon,
} from "./config-shared"

export function AgentConfigTab({
  config,
  dispatch,
  mode = "playground",
}: {
  config: AgentConfig
  dispatch: React.Dispatch<PlaygroundAction>
  mode?: "playground" | "theme-builder"
}) {
  const activeModels =
    config.agentProvider === "claude-code" ? CLAUDE_MODELS : CODEX_MODELS

  return (
    <div className="[&>*:last-child]:border-b-0">
      {/* ── Agent & Model ── */}
      <ConfigSection overline={mode === "theme-builder" ? "Preview Settings" : "Agent & Model"} delay={0.04}>
        <div className="space-y-3">
          {mode !== "theme-builder" && (
            <>
              <div>
                <label htmlFor="agent-name" className="text-[11px] text-foreground/55 mb-1 block">
                  Agent name
                </label>
                <input
                  id="agent-name"
                  value={config.name}
                  onChange={(e) =>
                    dispatch({ type: "SET_NAME", payload: e.target.value })
                  }
                  className="w-full h-8 rounded-md bg-foreground/[0.07] border border-foreground/[0.12] px-3 text-sm font-mono text-foreground placeholder:text-foreground/50 an-focus-input"
                  placeholder="my-agent"
                />
              </div>
              <div>
                <label htmlFor="agent-description" className="text-[11px] text-foreground/55 mb-1 block">
                  Description
                </label>
                <input
                  id="agent-description"
                  value={config.description}
                  onChange={(e) =>
                    dispatch({ type: "SET_DESCRIPTION", payload: e.target.value })
                  }
                  className="w-full h-8 rounded-md bg-foreground/[0.07] border border-foreground/[0.12] px-3 text-sm text-foreground placeholder:text-foreground/50 an-focus-input"
                  placeholder="A helpful AI assistant"
                />
              </div>
            </>
          )}

          {/* Agent selector */}
          <div>
            <label className="text-[11px] text-foreground/55 mb-1.5 block">
              Agent
            </label>
            <SegmentedControl
              value={config.agentProvider}
              options={[
                { id: "claude-code" as const, label: "Claude Code", icon: <ClaudeIcon /> },
                { id: "codex" as const, label: "OpenAI", icon: <CodexIcon /> },
              ]}
              onChange={(id) =>
                dispatch({ type: "SET_AGENT_PROVIDER", payload: id })
              }
              layoutId="playground-agent-indicator"
            />
          </div>

          {/* Default model */}
          <div>
            <label className="text-[11px] text-foreground/55 mb-1.5 block">
              Default model
            </label>
            <SegmentedControl
              value={
                config.agentProvider === "claude-code"
                  ? config.claudeModel
                  : config.codexModel
              }
              options={activeModels.map((m) => ({
                id: m.id,
                label: m.version ? `${m.name} ${m.version}` : m.name,
              }))}
              onChange={(id) => {
                if (config.agentProvider === "claude-code") {
                  dispatch({
                    type: "SET_CLAUDE_MODEL",
                    payload: id as ClaudeModelId,
                  })
                } else {
                  dispatch({
                    type: "SET_CODEX_MODEL",
                    payload: id as CodexModelId,
                  })
                }
                if (config.allowedModels.length <= 1) {
                  // Model switching is off — just replace with new default
                  dispatch({
                    type: "SET_ALLOWED_MODELS",
                    payload: [id],
                  })
                } else if (!config.allowedModels.includes(id)) {
                  // Model switching is on — add new default to the list
                  dispatch({
                    type: "SET_ALLOWED_MODELS",
                    payload: [...config.allowedModels, id],
                  })
                }
              }}
              layoutId="playground-model-indicator"
            />
          </div>

          {/* Allow model switching */}
          <SwitchRow
            label="Allow model switching"
            description="Let users switch between models"
            checked={config.allowedModels.length > 1}
            onCheckedChange={(enabled) => {
              const currentDefault =
                config.agentProvider === "claude-code"
                  ? config.claudeModel
                  : config.codexModel
              if (!enabled) {
                // Reset to only the default model
                dispatch({
                  type: "SET_ALLOWED_MODELS",
                  payload: [currentDefault],
                })
              } else {
                // Enable all models
                dispatch({
                  type: "SET_ALLOWED_MODELS",
                  payload: activeModels.map((m) => m.id),
                })
              }
            }}
          />
          <AnimatePresence>
            {config.allowedModels.length > 1 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-1.5"
              >
                {activeModels.map((m) => {
                  const currentDefault =
                    config.agentProvider === "claude-code"
                      ? config.claudeModel
                      : config.codexModel
                  const isDefault = m.id === currentDefault
                  const isAllowed = config.allowedModels.includes(m.id)
                  return (
                    <div
                      key={m.id}
                      className={isDefault ? "opacity-50 pointer-events-none" : ""}
                    >
                      <CheckboxRow
                        checked={isAllowed}
                        onChange={(checked) => {
                          if (isDefault) return
                          const next = checked
                            ? [...config.allowedModels, m.id]
                            : config.allowedModels.filter((id) => id !== m.id)
                          // Don't allow unchecking everything — keep at least default + 1
                          if (next.length < 2) return
                          dispatch({
                            type: "SET_ALLOWED_MODELS",
                            payload: next,
                          })
                        }}
                        label={`${m.version ? `${m.name} ${m.version}` : m.name}${isDefault ? " (default)" : ""}`}
                      />
                    </div>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ConfigSection>

      {/* ── System Prompt ── */}
      {mode !== "theme-builder" && (
        <ConfigSection overline="System Prompt" delay={0.08}>
          <div className="relative">
            <textarea
              id="system-prompt"
              aria-label="System prompt"
              value={config.systemPrompt}
              onChange={(e) =>
                dispatch({ type: "SET_SYSTEM_PROMPT", payload: e.target.value })
              }
              rows={4}
              className="an-focus-input w-full rounded-md bg-foreground/[0.07] border border-foreground/[0.12] px-3 py-2 text-[12px] font-mono text-foreground/90 placeholder:text-foreground/50 resize-none leading-relaxed"
              placeholder="You are a helpful assistant that..."
              maxLength={4000}
            />
            <span className="absolute bottom-2.5 right-2.5 text-[10px] text-foreground/40">
              {config.systemPrompt.length} / 4000
            </span>
          </div>
        </ConfigSection>
      )}

      {/* ── Execution Modes ── */}
      {mode !== "theme-builder" && <ConfigSection overline="Execution Modes" delay={0.14}>
        <div className="space-y-3">
          <div className="space-y-2">
            {MODE_OPTIONS.map((mode) => {
              const isSoon = mode.id === "plan"
              const isActive = !isSoon && config.modes.available.includes(mode.id)
              return (
                <div key={mode.id} className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <SwitchRow
                      label={mode.label}
                      description={mode.description}
                      checked={isActive}
                      disabled={isSoon}
                      onCheckedChange={(checked) => {
                        if (isSoon) return
                        let next: AgentMode[]
                        if (checked) {
                          next = [...config.modes.available, mode.id]
                        } else {
                          next = config.modes.available.filter(
                            (m) => m !== mode.id,
                          )
                          if (next.length === 0) next = ["agent"]
                        }
                        const payload: Partial<AgentConfig["modes"]> = {
                          available: next,
                        }
                        if (!next.includes(config.modes.defaultMode)) {
                          payload.defaultMode = next[0]!
                        }
                        dispatch({ type: "SET_MODES", payload })
                      }}
                    />
                  </div>
                  {isSoon && (
                    <span className="shrink-0 text-[9px] font-medium uppercase tracking-wider text-foreground/40 bg-foreground/[0.06] px-1.5 py-0.5 rounded">
                      Soon
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Default mode (if both enabled) */}
          <AnimatePresence>
            {config.modes.available.length > 1 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div>
                  <label className="text-[11px] text-foreground/55 mb-1.5 block">
                    Default mode
                  </label>
                  <SegmentedControl
                    value={config.modes.defaultMode}
                    options={config.modes.available.map((m) => ({
                      id: m,
                      label: MODE_OPTIONS.find((o) => o.id === m)?.label ?? m,
                    }))}
                    onChange={(id) =>
                      dispatch({
                        type: "SET_MODES",
                        payload: { defaultMode: id as AgentMode },
                      })
                    }
                    layoutId="playground-default-mode-indicator"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ConfigSection>}

      {/* ── Tools ── */}
      {mode !== "theme-builder" && (
        <ConfigSection overline="Tools" delay={0.16}>
          <PlaygroundToolEditor tools={config.tools} dispatch={dispatch} />
        </ConfigSection>
      )}

      {/* ── Attachments ── */}
      <ConfigSection overline="Attachments" delay={0.2}>
        <div className="space-y-3">
          <SwitchRow
            label="Allow file attachments"
            description="Let users upload files to the conversation"
            checked={config.attachments.enabled}
            onCheckedChange={(v) =>
              dispatch({ type: "SET_ATTACHMENTS", payload: { enabled: v } })
            }
          />
          <AnimatePresence>
            {config.attachments.enabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                <div className="space-y-1.5">
                  <label className="text-[11px] text-foreground/50 block">
                    Allowed file types
                  </label>
                  {ATTACHMENT_TYPE_OPTIONS.map((at) => {
                    const isAll = at.id === "all"
                    const isChecked =
                      config.attachments.allowedTypes.includes(at.id)
                    return (
                      <CheckboxRow
                        key={at.id}
                        checked={isChecked}
                        onChange={(checked) => {
                          let next: AttachmentType[]
                          if (isAll) {
                            next = checked ? ["all"] : []
                          } else if (checked) {
                            next = [
                              ...config.attachments.allowedTypes.filter(
                                (t) => t !== "all",
                              ),
                              at.id,
                            ]
                          } else {
                            next = config.attachments.allowedTypes.filter(
                              (t) => t !== at.id,
                            )
                          }
                          dispatch({
                            type: "SET_ATTACHMENTS",
                            payload: { allowedTypes: next },
                          })
                        }}
                        label={at.label}
                        description={at.extensions}
                      />
                    )
                  })}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] text-foreground/50 block">
                    Custom extensions
                  </label>
                  <input
                    type="text"
                    value={config.attachments.customExtensions}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_ATTACHMENTS",
                        payload: { customExtensions: e.target.value },
                      })
                    }
                    placeholder=".csv, .xlsx, .sql, .env"
                    className="w-full h-8 rounded-md border border-border bg-foreground/[0.06] px-2.5 text-[12px] text-foreground/80 placeholder:text-foreground/40 an-focus-input"
                  />
                  <p className="text-[10px] text-foreground/40">
                    Comma-separated file extensions
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ConfigSection>

      {/* ── Plans & Billing ── */}
      {mode !== "theme-builder" && <ConfigSection overline="Plans & Billing" delay={0.24}>
        <div className="space-y-3">
          <SwitchRow
            label="Enable usage plans"
            description="Configure billing tiers with limits"
            checked={config.plans.enabled}
            onCheckedChange={(v) =>
              dispatch({ type: "SET_PLANS_ENABLED", payload: v })
            }
          />
          <AnimatePresence>
            {config.plans.enabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {/* Plan tiers */}
                {config.plans.tiers.map((tier, idx) => (
                  <div
                    key={tier.id}
                    className="border border-border rounded-md p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-foreground/50 uppercase tracking-wider">
                        Plan {idx + 1}
                      </span>
                      <button
                        type="button"
                        aria-label={`Remove plan ${tier.name || `Plan ${idx + 1}`}`}
                        onClick={() =>
                          dispatch({
                            type: "REMOVE_PLAN_TIER",
                            payload: tier.id,
                          })
                        }
                        className="an-focus-btn p-1 rounded-md text-foreground/40 hover:bg-red-500/15 hover:text-red-400 transition-colors"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <g transform="scale(1.15) translate(-1.8, -1.8)">
                            <path d="M5 6.5L5.80734 18.2064C5.91582 19.7794 7.22348 21 8.80023 21H15.1998C16.7765 21 18.0842 19.7794 18.1927 18.2064L19 6.5" />
                            <path d="M10 11V16" />
                            <path d="M14 11V16" />
                            <path d="M3.5 6H20.5" />
                            <path d="M8.07092 5.74621C8.42348 3.89745 10.0485 2.5 12 2.5C13.9515 2.5 15.5765 3.89745 15.9291 5.74621" />
                          </g>
                        </svg>
                      </button>
                    </div>
                    <input
                      value={tier.name}
                      onChange={(e) =>
                        dispatch({
                          type: "UPDATE_PLAN_TIER",
                          payload: {
                            id: tier.id,
                            tier: { name: e.target.value },
                          },
                        })
                      }
                      aria-label={`Plan ${idx + 1} name`}
                      className="w-full h-7 rounded-md bg-foreground/[0.07] border border-foreground/[0.12] px-2.5 text-[11px] text-foreground/80 placeholder:text-foreground/50 an-focus-input"
                      placeholder="Plan name (e.g. Pro)"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <PlanField
                        label="Messages/mo"
                        value={tier.messagesPerMonth}
                        onChange={(v) =>
                          dispatch({
                            type: "UPDATE_PLAN_TIER",
                            payload: {
                              id: tier.id,
                              tier: { messagesPerMonth: v },
                            },
                          })
                        }
                      />
                      <PlanField
                        label="Tokens/mo"
                        value={tier.tokensPerMonth}
                        onChange={(v) =>
                          dispatch({
                            type: "UPDATE_PLAN_TIER",
                            payload: {
                              id: tier.id,
                              tier: { tokensPerMonth: v },
                            },
                          })
                        }
                      />
                    </div>
                    <PlanField
                      label="Budget per user"
                      prefix="$"
                      value={tier.budgetPerUser}
                      onChange={(v) =>
                        dispatch({
                          type: "UPDATE_PLAN_TIER",
                          payload: {
                            id: tier.id,
                            tier: { budgetPerUser: v },
                          },
                        })
                      }
                    />
                  </div>
                ))}

                {/* Add plan tier */}
                <button
                  type="button"
                  onClick={() => {
                    const id = `plan_${Date.now()}`
                    dispatch({
                      type: "ADD_PLAN_TIER",
                      payload: {
                        id,
                        name: "",
                        messagesPerMonth: "unlimited",
                        tokensPerMonth: "unlimited",
                        budgetPerUser: "unlimited",
                      },
                    })
                  }}
                  className="an-focus-btn w-full h-8 rounded-md border border-dashed border-foreground/[0.15] text-[11px] text-foreground/50 hover:border-foreground/20 hover:text-foreground/50 transition-colors"
                >
                  + Add plan tier
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ConfigSection>}
    </div>
  )
}
