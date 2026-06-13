"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import type {
  ToolDefinition,
  ToolParameter,
  PlaygroundAction,
} from "./playground-types"

/* ── Helpers ── */

function toSnakeCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9_]/g, "_")
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/_{2,}/g, "_")
    .replace(/^_|_$/g, "")
}

/* ── Single tool row ── */

function ToolRow({
  tool,
  dispatch,
}: {
  tool: ToolDefinition
  dispatch: React.Dispatch<PlaygroundAction>
}) {
  const [open, setOpen] = useState(true)

  return (
    <div className="border border-foreground/[0.06] rounded-lg overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="an-focus-btn w-full flex items-center gap-2 px-3 py-2 hover:bg-foreground/[0.05] transition-colors"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 shrink-0" />
        <span className="flex-1 text-left text-[12px] font-mono text-foreground/70 truncate">
          {tool.name || "untitled_tool"}
        </span>
        {tool.parameters.length > 0 && (
          <span className="text-[9px] text-foreground/55">
            {tool.parameters.length} param{tool.parameters.length !== 1 ? "s" : ""}
          </span>
        )}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className={`text-foreground/55 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Expanded editor */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-2.5 border-t border-foreground/[0.08]">
              {/* Name */}
              <div className="pt-2">
                <label className="text-[10px] text-foreground/50 mb-0.5 block">
                  Name
                </label>
                <input
                  value={tool.name}
                  onChange={(e) => {
                    const snaked = toSnakeCase(e.target.value)
                    dispatch({
                      type: "UPDATE_TOOL",
                      payload: { id: tool.id, tool: { name: snaked } },
                    })
                  }}
                  className="w-full h-7 rounded-md bg-foreground/[0.07] border border-foreground/[0.12] px-2.5 text-[12px] font-mono text-foreground placeholder:text-foreground/50 an-focus-input"
                  placeholder="search_events"
                />
              </div>

              {/* Prompt (description for LLM) */}
              <div>
                <label className="text-[10px] text-foreground/50 mb-0.5 block">
                  Prompt
                  <span className="text-foreground/55 ml-1 normal-case tracking-normal">
                    — tells the model when to use this tool
                  </span>
                </label>
                <textarea
                  value={tool.prompt}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_TOOL",
                      payload: {
                        id: tool.id,
                        tool: { prompt: e.target.value },
                      },
                    })
                  }
                  rows={2}
                  className="an-focus-input w-full rounded-md bg-foreground/[0.07] border border-foreground/[0.12] px-2.5 py-1.5 text-[11px] text-foreground/70 placeholder:text-foreground/55 resize-none leading-relaxed"
                  placeholder="Search analytics events by name and time period. Returns matching event data with counts."
                />
              </div>

              {/* Input schema (parameters) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] text-foreground/50">
                    Input schema
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const newParam: ToolParameter = {
                        name: `param${tool.parameters.length + 1}`,
                        type: "string",
                        description: "",
                      }
                      dispatch({
                        type: "UPDATE_TOOL",
                        payload: {
                          id: tool.id,
                          tool: {
                            parameters: [...tool.parameters, newParam],
                          },
                        },
                      })
                    }}
                    className="an-focus-btn text-[10px] text-foreground/55 hover:text-foreground/60 transition-colors rounded"
                  >
                    + add param
                  </button>
                </div>
                <div className="space-y-1.5">
                  {tool.parameters.map((param, pi) => (
                    <div
                      key={pi}
                      className="rounded-md bg-foreground/[0.05] border border-foreground/[0.08] px-2 py-1.5 space-y-1"
                    >
                      <div className="flex items-center gap-1.5">
                        <input
                          value={param.name}
                          onChange={(e) => {
                            const updated = [...tool.parameters]
                            updated[pi] = { ...updated[pi]!, name: e.target.value }
                            dispatch({
                              type: "UPDATE_TOOL",
                              payload: {
                                id: tool.id,
                                tool: { parameters: updated },
                              },
                            })
                          }}
                          className="flex-1 h-6 rounded bg-foreground/[0.07] border border-foreground/[0.06] px-2 text-[11px] font-mono text-foreground/60 an-focus-input"
                          placeholder="name"
                        />
                        <select
                          value={param.type}
                          onChange={(e) => {
                            const updated = [...tool.parameters]
                            updated[pi] = {
                              ...updated[pi]!,
                              type: e.target.value as ToolParameter["type"],
                            }
                            dispatch({
                              type: "UPDATE_TOOL",
                              payload: {
                                id: tool.id,
                                tool: { parameters: updated },
                              },
                            })
                          }}
                          className="an-focus-input h-6 rounded bg-foreground/[0.07] border border-foreground/[0.06] px-1.5 text-[11px] font-mono text-foreground/50 appearance-none cursor-pointer"
                        >
                          <option value="string">string</option>
                          <option value="number">number</option>
                          <option value="boolean">boolean</option>
                          <option value="object">object</option>
                          <option value="array">array</option>
                        </select>
                        <button
                          type="button"
                          aria-label={`Remove parameter ${param.name}`}
                          onClick={() => {
                            const updated = tool.parameters.filter(
                              (_, i) => i !== pi,
                            )
                            dispatch({
                              type: "UPDATE_TOOL",
                              payload: {
                                id: tool.id,
                                tool: { parameters: updated },
                              },
                            })
                          }}
                          className="p-0.5 rounded text-foreground/55 hover:bg-red-500/15 hover:text-red-400 transition-colors shrink-0 an-focus-btn"
                        >
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                            <path d="M3 3l6 6M9 3l-6 6" />
                          </svg>
                        </button>
                      </div>
                      <input
                        value={param.description}
                        onChange={(e) => {
                          const updated = [...tool.parameters]
                          updated[pi] = { ...updated[pi]!, description: e.target.value }
                          dispatch({
                            type: "UPDATE_TOOL",
                            payload: {
                              id: tool.id,
                              tool: { parameters: updated },
                            },
                          })
                        }}
                        className="w-full h-5 bg-transparent text-[10px] text-foreground/50 placeholder:text-foreground/55 outline-none"
                        placeholder="Describe this parameter for the model..."
                      />
                    </div>
                  ))}
                  {tool.parameters.length === 0 && (
                    <p className="text-[10px] text-foreground/55 py-1">
                      No parameters yet
                    </p>
                  )}
                </div>
              </div>

              {/* Remove tool */}
              <div className="pt-1 flex justify-end">
                <button
                  type="button"
                  aria-label={`Remove tool ${tool.name || "untitled"}`}
                  onClick={() => dispatch({ type: "REMOVE_TOOL", payload: tool.id })}
                  className="p-1 rounded-md text-foreground/55 hover:bg-red-500/15 hover:text-red-400 transition-colors an-focus-btn"
                >
                  <svg
                    width="12"
                    height="12"
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Tool list + add button ── */

export function PlaygroundToolEditor({
  tools,
  dispatch,
}: {
  tools: ToolDefinition[]
  dispatch: React.Dispatch<PlaygroundAction>
}) {
  const addTool = () => {
    const newTool: ToolDefinition = {
      id: `t${Date.now()}`,
      name: `tool_${tools.length + 1}`,
      prompt: "",
      parameters: [],
    }
    dispatch({ type: "ADD_TOOL", payload: newTool })
  }

  return (
    <div className="space-y-2">
      {tools.map((tool) => (
        <ToolRow key={tool.id} tool={tool} dispatch={dispatch} />
      ))}
      <button
        type="button"
        onClick={addTool}
        className="w-full h-8 rounded-lg border border-dashed border-foreground/[0.12] text-[12px] text-foreground/55 hover:text-foreground/60 hover:border-foreground/[0.15] transition-colors flex items-center justify-center gap-1.5 an-focus-btn"
      >
        <span className="text-[14px] leading-none">+</span> Add tool
      </button>
      {tools.length > 0 && (
        <p className="text-[10px] text-foreground/55">
          Define the schema — implement execute() in your code.
        </p>
      )}
    </div>
  )
}
