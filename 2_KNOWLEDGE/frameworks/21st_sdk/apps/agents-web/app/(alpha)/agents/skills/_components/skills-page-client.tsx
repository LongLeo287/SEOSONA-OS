"use client"

import { useEffect, useState, useRef } from "react"
import { api } from "@/trpc/client"
import { useAtomValue, useSetAtom } from "jotai"
import { selectedTeamIdAtom } from "@/lib/atoms/team"
import { anSkillsCreateAtom, anSkillsSaveAtom } from "@/lib/atoms/an-agent"
import { AnLogoSpinner } from "@/components/features/agents/an/dashboard/an-logo-spinner"
import { Spinner } from "@/components/icons/spinner"
import { ConfigSection } from "@/components/features/agents/an/playground/config/config-shared"
import { X, Trash2 } from "lucide-react"
import { SkillIcon } from "@/components/icons"
import { AnimatePresence, motion } from "motion/react"
import { createPortal } from "react-dom"
import { toast } from "sonner"

type FormData = {
  name: string
  slug: string
  description: string
  tags: string[]
  content: string
}

const defaultForm: FormData = {
  name: "",
  slug: "",
  description: "",
  tags: [],
  content: "",
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export function SkillsPageClient() {
  const teamId = useAtomValue(selectedTeamIdAtom)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormData>(defaultForm)
  const [autoSlug, setAutoSlug] = useState(true)
  const [tagInput, setTagInput] = useState("")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle")
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const setSkillsCreate = useSetAtom(anSkillsCreateAtom)
  const setSkillsSave = useSetAtom(anSkillsSaveAtom)

  const { data: skills, isLoading } = api.agentConfigs.listSkills.useQuery(
    { teamId: teamId! },
    { enabled: !!teamId },
  )

  const utils = api.useUtils()
  const invalidate = () => {
    utils.agentConfigs.listSkills.invalidate({ teamId: teamId! })
  }

  const createMutation = api.agentConfigs.createSkill.useMutation({
    onMutate: () => setSaveState("saving"),
    onSuccess: () => {
      invalidate()
      setSaveState("saved")
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current)
      savedTimerRef.current = setTimeout(() => {
        setSaveState("idle")
        setIsCreating(false)
        setForm(defaultForm)
        setAutoSlug(true)
        setTagInput("")
      }, 1200)
      toast.success("Skill created")
    },
    onError: (err) => {
      setSaveState("idle")
      toast.error(err.message)
    },
  })

  const updateMutation = api.agentConfigs.updateSkill.useMutation({
    onMutate: () => setSaveState("saving"),
    onSuccess: () => {
      invalidate()
      setSaveState("saved")
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current)
      savedTimerRef.current = setTimeout(() => setSaveState("idle"), 2000)
      toast.success("Skill updated")
    },
    onError: (err) => {
      setSaveState("idle")
      toast.error(err.message)
    },
  })

  const deleteMutation = api.agentConfigs.deleteSkill.useMutation({
    onSuccess: () => {
      invalidate()
      setShowDeleteDialog(false)
      setDeleteConfirmation("")
      if (deletingId === editingId) {
        setEditingId(null)
        setIsCreating(false)
        setForm(defaultForm)
      }
      setDeletingId(null)
      toast.success("Skill deleted")
    },
    onError: (err) => { toast.error(err.message) },
  })

  // Auto-slug from name
  useEffect(() => {
    if (autoSlug && form.name) {
      setForm((f) => ({ ...f, slug: slugify(f.name) }))
    }
  }, [form.name, autoSlug])

  // Load a skill into the form
  function loadSkill(skill: NonNullable<typeof skills>[number]) {
    setForm({
      name: skill.name,
      slug: skill.slug,
      description: skill.description ?? "",
      tags: skill.tags,
      content: skill.content,
    })
    setEditingId(skill.id)
    setIsCreating(false)
    setAutoSlug(false)
    setTagInput("")
    setSaveState("idle")
  }

  function openCreate() {
    setForm(defaultForm)
    setEditingId(null)
    setIsCreating(true)
    setAutoSlug(true)
    setTagInput("")
    setSaveState("idle")
  }

  // Register create skill callback in dashboard header
  useEffect(() => {
    setSkillsCreate(() => openCreate)
    return () => setSkillsCreate(null)
  }, [setSkillsCreate])

  function handleSave() {
    if (!teamId) return
    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        name: form.name,
        slug: form.slug,
        description: form.description || null,
        content: form.content,
        tags: form.tags,
      })
    } else {
      createMutation.mutate({
        teamId,
        name: form.name,
        slug: form.slug || undefined,
        description: form.description || undefined,
        content: form.content,
        tags: form.tags,
      })
    }
  }

  function addTag() {
    const tag = tagInput.trim()
    if (tag && !form.tags.includes(tag)) {
      setForm((f) => ({ ...f, tags: [...f.tags, tag] }))
    }
    setTagInput("")
  }

  const selectedSkill = skills?.find((s) => s.id === editingId)
  const deletingSkill = skills?.find((s) => s.id === deletingId)
  const showForm = isCreating || !!editingId
  const canSave = form.name && form.content

  // Expose save action to DashboardHeader
  const handleSaveRef = useRef(handleSave)
  handleSaveRef.current = handleSave

  useEffect(() => {
    if (showForm) {
      setSkillsSave({
        onSave: () => handleSaveRef.current(),
        state: saveState,
        disabled: saveState === "saving" || !canSave,
        label: saveState === "saved" ? "Saved" : editingId ? "Save" : "Create",
      })
    } else {
      setSkillsSave(null)
    }
  }, [showForm, saveState, canSave, editingId, setSkillsSave])

  useEffect(() => {
    return () => setSkillsSave(null)
  }, [setSkillsSave])

  if (!teamId || isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <AnLogoSpinner />
      </div>
    )
  }

  return (
    <div className="flex h-full">
      {/* ── Left: Skills list ── */}
      <div className="w-[280px] shrink-0 flex flex-col border-r border-border" style={{ borderRightWidth: "0.5px" }}>
        {/* Skill list */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {!skills?.length ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 px-4">
              <SkillIcon className="h-5 w-5 text-muted-foreground" />
              <p className="text-[12px] text-muted-foreground text-center">No skills yet</p>
              <button
                onClick={openCreate}
                className="mt-1 h-7 px-3 rounded-md bg-foreground text-background text-[11px] font-medium hover:bg-foreground/90 transition-colors active:scale-[0.98]"
              >
                Create first skill
              </button>
            </div>
          ) : (
            <div className="py-1">
              {skills.map((skill) => {
                const isSelected = editingId === skill.id
                return (
                  <button
                    key={skill.id}
                    onClick={() => loadSkill(skill)}
                    className={`flex flex-col w-full text-left px-4 py-2.5 transition-colors duration-150 ${
                      isSelected
                        ? "bg-foreground/5"
                        : "hover:bg-foreground/[0.03]"
                    }`}
                  >
                    <span className={`text-[13px] truncate ${isSelected ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                      {skill.name}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground truncate">
                      {skill.slug}
                    </span>
                    {skill.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {skill.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[9px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                        {skill.tags.length > 3 && (
                          <span className="text-[9px] text-muted-foreground">+{skill.tags.length - 3}</span>
                        )}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Right: Skill editor ── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {showForm ? (
          <>
            {/* Form content */}
            <div className="flex-1 min-h-0 overflow-y-auto [&>*:last-child]:border-b-0">
              {/* Name & Slug */}
              <ConfigSection overline="Name & Slug" delay={0.02}>
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] text-foreground/55 mb-1.5 block">Name</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className="an-focus-input w-full h-8 rounded-md bg-foreground/[0.05] border border-border hover:border-foreground/15 px-2.5 text-[13px] text-foreground placeholder:text-foreground/40"
                      placeholder="Code Review"
                      maxLength={100}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-foreground/55 mb-1.5 block">Slug</label>
                    <input
                      value={form.slug}
                      onChange={(e) => {
                        setAutoSlug(false)
                        setForm((f) => ({ ...f, slug: e.target.value }))
                      }}
                      className="an-focus-input w-full h-8 rounded-md bg-foreground/[0.05] border border-border hover:border-foreground/15 px-2.5 text-[12px] font-mono text-foreground/70 placeholder:text-foreground/40"
                      placeholder="code-review"
                    />
                  </div>
                </div>
              </ConfigSection>

              {/* Description */}
              <ConfigSection overline="Description" delay={0.06}>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={2}
                  className="an-focus-input w-full rounded-md bg-foreground/[0.05] border border-border hover:border-foreground/15 px-3 py-2 text-[12px] text-foreground/80 placeholder:text-foreground/40 resize-none leading-relaxed"
                  placeholder="What does this skill do?"
                />
              </ConfigSection>

              {/* Tags */}
              <ConfigSection overline={`Tags${form.tags.length ? ` (${form.tags.length})` : ""}`} delay={0.10}>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addTag()
                        }
                      }}
                      className="an-focus-input flex-1 h-8 rounded-md bg-foreground/[0.05] border border-border hover:border-foreground/15 px-2.5 text-[12px] text-foreground/80 placeholder:text-foreground/40"
                      placeholder="Add tag + Enter"
                    />
                  </div>
                  {form.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {form.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-muted pl-2 pr-1 py-0.5 rounded-md"
                        >
                          {tag}
                          <button
                            onClick={() =>
                              setForm((f) => ({
                                ...f,
                                tags: f.tags.filter((t) => t !== tag),
                              }))
                            }
                            className="rounded p-0.5 hover:bg-foreground/10 transition-colors"
                          >
                            <X className="h-2.5 w-2.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </ConfigSection>

              {/* Content */}
              <ConfigSection overline="Content (SKILL.md)" delay={0.14}>
                <div className="relative">
                  <textarea
                    value={form.content}
                    onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                    className="an-focus-input w-full min-h-[280px] rounded-md bg-foreground/[0.07] border border-foreground/[0.12] px-3 py-2 text-[12px] font-mono text-foreground/90 placeholder:text-foreground/50 resize-none leading-[1.7]"
                    placeholder="# Skill Instructions&#10;&#10;Write your skill markdown here..."
                    maxLength={10000}
                  />
                  <span className="absolute bottom-2.5 right-2.5 text-[10px] text-muted-foreground">
                    {form.content.length} / 10000
                  </span>
                </div>
              </ConfigSection>

              {/* Delete */}
              {editingId && (
                <div className="px-4 py-4">
                  <button
                    onClick={() => {
                      setDeletingId(editingId)
                      setShowDeleteDialog(true)
                    }}
                    className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete skill
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <SkillIcon className="h-6 w-6 text-muted-foreground" />
            <p className="text-[13px] text-muted-foreground">
              {skills?.length ? "Select a skill to edit" : "Create a skill to get started"}
            </p>
          </div>
        )}
      </div>

      {/* Delete Dialog */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {showDeleteDialog && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: [0.55, 0.055, 0.675, 0.19] }}
                className="fixed inset-0 z-[45] bg-black/25"
                onClick={() => { if (!deleteMutation.isPending) { setShowDeleteDialog(false); setDeleteConfirmation("") } }}
              />
              <div className="fixed inset-0 z-[46] flex items-center justify-center pointer-events-none">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.55, 0.055, 0.675, 0.19] }}
                  className="w-[90vw] max-w-[400px] pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="bg-background rounded-2xl border border-border/50 overflow-hidden" style={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)" }}>
                    <div className="px-5 pt-4 pb-4 space-y-3">
                      <div>
                        <h2 className="text-[15px] font-semibold">Delete Skill</h2>
                        <p className="text-[12px] text-muted-foreground mt-1.5 leading-relaxed">
                          This will permanently delete the skill. Agents referencing this skill will need to be updated. This action cannot be undone.
                        </p>
                      </div>
                      <div>
                        <p className="text-[12px] text-muted-foreground mb-1.5">
                          Type{" "}
                          <code
                            className="px-1 py-0.5 bg-muted rounded text-foreground font-medium text-[11px] select-all"
                            onClick={(e) => {
                              const range = document.createRange()
                              range.selectNodeContents(e.currentTarget)
                              const sel = window.getSelection()
                              sel?.removeAllRanges()
                              sel?.addRange(range)
                            }}
                          >
                            {deletingSkill?.name}
                          </code>{" "}
                          to confirm
                        </p>
                        <input
                          value={deleteConfirmation}
                          onChange={(e) => setDeleteConfirmation(e.target.value)}
                          placeholder={deletingSkill?.name}
                          disabled={deleteMutation.isPending}
                          autoComplete="off"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && deleteConfirmation === deletingSkill?.name && !deleteMutation.isPending) {
                              if (deletingId) deleteMutation.mutate({ id: deletingId })
                            }
                            if (e.key === "Escape") { setShowDeleteDialog(false); setDeleteConfirmation("") }
                          }}
                          className="an-focus-input w-full h-9 rounded-lg bg-foreground/[0.05] border border-border hover:border-foreground/15 px-3 text-[13px] text-foreground placeholder:text-foreground/30 disabled:opacity-50"
                        />
                      </div>
                    </div>
                    <div className="bg-muted/50 px-5 py-3 flex justify-between" style={{ boxShadow: "inset 0 1px 0 0 var(--border), inset 0 2px 0 0 var(--background)" }}>
                      <button
                        onClick={() => { setShowDeleteDialog(false); setDeleteConfirmation("") }}
                        disabled={deleteMutation.isPending}
                        className="h-8 px-3 rounded-lg text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          if (deletingId) deleteMutation.mutate({ id: deletingId })
                        }}
                        disabled={deleteMutation.isPending || deleteConfirmation !== deletingSkill?.name}
                        className="relative h-8 min-w-[72px] px-3 rounded-lg bg-destructive text-destructive-foreground text-[12px] font-medium hover:bg-destructive/90 transition-colors disabled:opacity-40 overflow-hidden"
                      >
                        <span className={deleteMutation.isPending ? "opacity-0" : ""}>Delete</span>
                        <AnimatePresence>
                          {deleteMutation.isPending && (
                            <motion.span
                              initial={{ y: 12, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              exit={{ y: -12, opacity: 0 }}
                              transition={{ duration: 0.15 }}
                              className="absolute inset-0 flex items-center justify-center"
                            >
                              <Spinner size={14} color="currentColor" />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  )
}
